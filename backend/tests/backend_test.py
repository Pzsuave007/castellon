"""Backend API tests for Catellon Septic Services."""
import os
import requests
from datetime import date, timedelta

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://vacuum-pro-spokane.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@castellonsepticservices.com"
ADMIN_PASSWORD = "Catellon2026!"


def _next_weekday(weekdays):
    d = date.today() + timedelta(days=1)
    for _ in range(14):
        if d.weekday() in weekdays:
            return d
        d += timedelta(days=1)
    return d


# -------- Public availability --------
def test_availability_config_default():
    r = requests.get(f"{API}/availability/config")
    assert r.status_code == 200
    data = r.json()
    for k in ["working_days", "start_time", "end_time", "slot_duration_minutes", "blocked_dates"]:
        assert k in data
    assert isinstance(data["working_days"], list)


def test_availability_slots_future_weekday():
    cfg = requests.get(f"{API}/availability/config").json()
    d = _next_weekday(cfg["working_days"])
    r = requests.get(f"{API}/availability/slots", params={"date": d.isoformat()})
    assert r.status_code == 200
    data = r.json()
    assert "slots" in data
    assert isinstance(data["slots"], list)
    assert len(data["slots"]) > 0
    # HH:MM format
    for s in data["slots"]:
        assert len(s) == 5 and s[2] == ":"


# -------- Bookings --------
def test_create_booking_and_conflict():
    cfg = requests.get(f"{API}/availability/config").json()
    d = _next_weekday(cfg["working_days"]) + timedelta(days=1)
    # find weekday for d
    while d.weekday() not in cfg["working_days"]:
        d += timedelta(days=1)
    slots = requests.get(f"{API}/availability/slots", params={"date": d.isoformat()}).json()["slots"]
    assert slots, "No slots available"
    slot = slots[0]
    payload = {
        "service_type": "residential",
        "date": d.isoformat(),
        "time": slot,
        "customer_name": "TEST_Booking User",
        "customer_phone": "5093896138",
        "address": "123 Test St",
        "city": "Spokane",
    }
    r = requests.post(f"{API}/bookings", json=payload)
    assert r.status_code == 200, r.text
    booking = r.json()
    assert booking.get("id")
    assert booking["status"] == "confirmed"
    # Conflict
    r2 = requests.post(f"{API}/bookings", json=payload)
    assert r2.status_code == 409, f"Expected 409 got {r2.status_code}: {r2.text}"
    # save id for cleanup
    test_create_booking_and_conflict.booking_id = booking["id"]


def test_create_quote():
    r = requests.post(f"{API}/quotes", json={
        "name": "TEST_Quote Person",
        "phone": "5095551212",
        "message": "Need a quote for septic pump-out",
    })
    assert r.status_code == 200, r.text
    q = r.json()
    assert q.get("id")
    assert q["status"] == "new"
    test_create_quote.quote_id = q["id"]


# -------- Auth --------
def test_login_success_and_failure():
    # wrong pw
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401
    # correct
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    data = r.json()
    assert "token" in data and "user" in data
    assert data["user"]["email"] == ADMIN_EMAIL
    assert "access_token" in r.cookies or any(c.name == "access_token" for c in r.cookies)
    test_login_success_and_failure.token = data["token"]


def _admin_headers():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    return {"Authorization": f"Bearer {r.json()['token']}"}


def test_admin_routes_require_auth():
    r = requests.get(f"{API}/admin/bookings")
    assert r.status_code == 401
    r = requests.get(f"{API}/admin/quotes")
    assert r.status_code == 401


def test_admin_list_endpoints():
    h = _admin_headers()
    r = requests.get(f"{API}/admin/bookings", headers=h)
    assert r.status_code == 200
    assert isinstance(r.json(), list)
    r = requests.get(f"{API}/admin/quotes", headers=h)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_patch_and_delete_booking_quote():
    h = _admin_headers()
    bid = getattr(test_create_booking_and_conflict, "booking_id", None)
    qid = getattr(test_create_quote, "quote_id", None)
    if bid:
        r = requests.patch(f"{API}/admin/bookings/{bid}", json={"status": "completed"}, headers=h)
        assert r.status_code == 200
        assert r.json()["status"] == "completed"
        r = requests.delete(f"{API}/admin/bookings/{bid}", headers=h)
        assert r.status_code == 200
    if qid:
        r = requests.patch(f"{API}/admin/quotes/{qid}", json={"status": "contacted"}, headers=h)
        assert r.status_code == 200
        assert r.json()["status"] == "contacted"
        r = requests.delete(f"{API}/admin/quotes/{qid}", headers=h)
        assert r.status_code == 200


def test_update_availability_persists():
    h = _admin_headers()
    # GET current
    cur = requests.get(f"{API}/admin/availability", headers=h).json()
    new_cfg = {
        "working_days": [0, 1, 2, 3, 4],  # Mon-Fri
        "start_time": "09:00",
        "end_time": "16:00",
        "slot_duration_minutes": 60,
        "blocked_dates": [],
    }
    r = requests.put(f"{API}/admin/availability", json=new_cfg, headers=h)
    assert r.status_code == 200, r.text
    # verify
    r = requests.get(f"{API}/availability/config")
    got = r.json()
    assert got["working_days"] == [0, 1, 2, 3, 4]
    assert got["start_time"] == "09:00"
    assert got["slot_duration_minutes"] == 60
    # restore original
    requests.put(f"{API}/admin/availability", json={
        "working_days": cur["working_days"],
        "start_time": cur["start_time"],
        "end_time": cur["end_time"],
        "slot_duration_minutes": cur["slot_duration_minutes"],
        "blocked_dates": cur["blocked_dates"],
    }, headers=h)


def test_emergency_booking_anytime():
    h = _admin_headers()
    d = date.today() + timedelta(days=2)
    payload = {
        "service_type": "emergency",
        "date": d.isoformat(),
        "time": "23:45",  # outside working hours
        "customer_name": "TEST_Emergency",
        "customer_phone": "5095550000",
        "address": "999 Emergency Ln",
        "city": "Spokane",
    }
    r = requests.post(f"{API}/bookings", json=payload)
    assert r.status_code == 200, r.text
    bid = r.json()["id"]
    requests.delete(f"{API}/admin/bookings/{bid}", headers=h)
