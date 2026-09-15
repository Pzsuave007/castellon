from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta, time as dt_time, date as date_cls
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# ============================================================================
# CONFIG / DB
# ============================================================================

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_ALGORITHM = "HS256"
SERVICE_TYPES = ["residential", "commercial", "grease_trap", "emergency"]

app = FastAPI(title="Castellon Septic Services API")
api = APIRouter(prefix="/api")


# ============================================================================
# AUTH HELPERS
# ============================================================================

def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, hashed: str) -> bool:
    return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))


def jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
        "type": "access",
    }
    return jwt.encode(payload, jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user or user.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Unauthorized")
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ============================================================================
# MODELS
# ============================================================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AvailabilityConfig(BaseModel):
    model_config = ConfigDict(extra="ignore")
    # weekdays 0=Mon ... 6=Sun
    working_days: List[int] = Field(default_factory=lambda: [0, 1, 2, 3, 4, 5])
    start_time: str = "08:00"  # HH:MM
    end_time: str = "17:00"
    slot_duration_minutes: int = 120
    blocked_dates: List[str] = Field(default_factory=list)  # YYYY-MM-DD


class BookingCreate(BaseModel):
    service_type: Literal["residential", "commercial", "grease_trap", "emergency"]
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    customer_name: str
    customer_phone: str
    customer_email: Optional[EmailStr] = None
    address: str
    city: str
    notes: Optional[str] = None


class Booking(BookingCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: Literal["pending", "confirmed", "completed", "cancelled"] = "confirmed"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class QuoteRequestCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    service_type: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    message: str


class QuoteRequest(QuoteRequestCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: Literal["new", "contacted", "closed"] = "new"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class BookingStatusUpdate(BaseModel):
    status: Literal["pending", "confirmed", "completed", "cancelled"]


class QuoteStatusUpdate(BaseModel):
    status: Literal["new", "contacted", "closed"]


# ============================================================================
# UTIL
# ============================================================================

def _parse_hhmm(s: str) -> dt_time:
    h, m = s.split(":")
    return dt_time(int(h), int(m))


def _generate_slots_for_date(cfg: AvailabilityConfig, day: date_cls) -> List[str]:
    if day.weekday() not in cfg.working_days:
        return []
    if day.isoformat() in cfg.blocked_dates:
        return []
    start = _parse_hhmm(cfg.start_time)
    end = _parse_hhmm(cfg.end_time)
    start_min = start.hour * 60 + start.minute
    end_min = end.hour * 60 + end.minute
    slots = []
    cur = start_min
    while cur + cfg.slot_duration_minutes <= end_min:
        h, m = divmod(cur, 60)
        slots.append(f"{h:02d}:{m:02d}")
        cur += cfg.slot_duration_minutes
    return slots


async def get_availability_config() -> AvailabilityConfig:
    doc = await db.availability.find_one({"_id": "config"})
    if doc:
        doc.pop("_id", None)
        return AvailabilityConfig(**doc)
    return AvailabilityConfig()


# ============================================================================
# ROUTES — PUBLIC
# ============================================================================

@api.get("/")
async def root():
    return {"service": "Castellon Septic Services API", "status": "ok"}


@api.get("/availability/config")
async def get_public_availability():
    cfg = await get_availability_config()
    return cfg.model_dump()


@api.get("/availability/slots")
async def get_available_slots(date: str, service_type: Optional[str] = None):
    """Return available time slots for a given date (YYYY-MM-DD)."""
    try:
        day = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    cfg = await get_availability_config()
    all_slots = _generate_slots_for_date(cfg, day)

    booked = await db.bookings.find(
        {"date": date, "status": {"$ne": "cancelled"}},
        {"_id": 0, "time": 1},
    ).to_list(500)
    booked_times = {b["time"] for b in booked}
    available = [s for s in all_slots if s not in booked_times]
    return {"date": date, "service_type": service_type, "slots": available, "all_slots": all_slots}


@api.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    # Validate slot still available
    cfg = await get_availability_config()
    try:
        day = datetime.strptime(payload.date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date")
    valid_slots = _generate_slots_for_date(cfg, day)
    if payload.time not in valid_slots and payload.service_type != "emergency":
        raise HTTPException(status_code=400, detail="Time slot is not within working hours")
    if payload.service_type != "emergency":
        existing = await db.bookings.find_one(
            {"date": payload.date, "time": payload.time, "status": {"$ne": "cancelled"}}
        )
        if existing:
            raise HTTPException(status_code=409, detail="Time slot already booked")

    booking = Booking(**payload.model_dump())
    await db.bookings.insert_one(booking.model_dump())
    return booking


@api.post("/quotes", response_model=QuoteRequest)
async def create_quote(payload: QuoteRequestCreate):
    q = QuoteRequest(**payload.model_dump())
    await db.quotes.insert_one(q.model_dump())
    return q


# ============================================================================
# ROUTES — AUTH
# ============================================================================

@api.post("/auth/login")
async def login(payload: LoginRequest, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=28800,
        path="/",
    )
    return {
        "token": token,
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user.get("role")},
    }


@api.post("/auth/logout")
async def logout(response: Response, _: dict = Depends(get_current_admin)):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_admin)):
    return user


# ============================================================================
# ROUTES — ADMIN
# ============================================================================

@api.get("/admin/bookings")
async def list_bookings(_: dict = Depends(get_current_admin)):
    docs = await db.bookings.find({}, {"_id": 0}).sort("date", 1).to_list(2000)
    return docs


@api.patch("/admin/bookings/{booking_id}")
async def update_booking_status(booking_id: str, payload: BookingStatusUpdate, _: dict = Depends(get_current_admin)):
    res = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    doc = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    return doc


@api.delete("/admin/bookings/{booking_id}")
async def delete_booking(booking_id: str, _: dict = Depends(get_current_admin)):
    res = await db.bookings.delete_one({"id": booking_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


@api.get("/admin/quotes")
async def list_quotes(_: dict = Depends(get_current_admin)):
    docs = await db.quotes.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return docs


@api.patch("/admin/quotes/{quote_id}")
async def update_quote_status(quote_id: str, payload: QuoteStatusUpdate, _: dict = Depends(get_current_admin)):
    res = await db.quotes.update_one({"id": quote_id}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Quote not found")
    doc = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    return doc


@api.delete("/admin/quotes/{quote_id}")
async def delete_quote(quote_id: str, _: dict = Depends(get_current_admin)):
    res = await db.quotes.delete_one({"id": quote_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"ok": True}


@api.put("/admin/availability")
async def update_availability(cfg: AvailabilityConfig, _: dict = Depends(get_current_admin)):
    doc = cfg.model_dump()
    doc["_id"] = "config"
    await db.availability.replace_one({"_id": "config"}, doc, upsert=True)
    doc.pop("_id", None)
    return doc


@api.get("/admin/availability")
async def get_admin_availability(_: dict = Depends(get_current_admin)):
    cfg = await get_availability_config()
    return cfg.model_dump()


# ============================================================================
# APP SETUP
# ============================================================================

app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.bookings.create_index("id", unique=True)
    await db.bookings.create_index([("date", 1), ("time", 1)])
    await db.quotes.create_index("id", unique=True)

    # Seed admin (idempotent)
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one(
            {
                "id": str(uuid.uuid4()),
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "Castellon Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        logger.info("Admin user seeded: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info("Admin password updated: %s", admin_email)


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
