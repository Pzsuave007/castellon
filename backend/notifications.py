"""Owner email notifications for Castellon Septic Services.

Primary transport: Resend API (transactional email service — reliable delivery).
Fallbacks: local sendmail binary, then unauthenticated smtplib (only if
RESEND_API_KEY is not set).

Non-blocking: any failure is captured, logged, and returned in a diagnostic
dict — the caller never raises.
"""
import os
import asyncio
import shutil
import smtplib
import subprocess
import logging
from email.message import EmailMessage
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

SERVICE_LABELS = {
    "residential": "Residential Septic Pumping",
    "commercial": "Commercial Septic Pumping",
    "grease_trap": "Restaurant Grease Trap Cleaning",
    "emergency": "Emergency Pump-Out",
}

SENDMAIL_PATHS = ["/usr/sbin/sendmail", "/usr/lib/sendmail", "/sbin/sendmail"]


def _enabled() -> bool:
    return os.environ.get("NOTIFY_ENABLED", "false").lower() in ("1", "true", "yes")


# ---------- Resend transport (primary) ----------

def _send_via_resend(subject: str, body: str, to_addr: str, from_addr: str) -> Tuple[bool, str]:
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        return False, "RESEND_API_KEY not set"
    try:
        import resend
        resend.api_key = api_key
        html_body = "<pre style=\"font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;line-height:1.5;color:#1a1a1a;\">" \
                    + body.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;") \
                    + "</pre>"
        params = {
            "from": from_addr,
            "to": [to_addr],
            "subject": subject,
            "text": body,
            "html": html_body,
        }
        result = resend.Emails.send(params)
        email_id = result.get("id") if isinstance(result, dict) else str(result)
        return True, f"resend ok id={email_id}"
    except Exception as e:
        return False, f"resend failed err={e!r}"


# ---------- Sendmail transport (fallback) ----------

def _find_sendmail() -> Optional[str]:
    for p in SENDMAIL_PATHS:
        if os.path.exists(p) and os.access(p, os.X_OK):
            return p
    return shutil.which("sendmail")


def _build_message(subject: str, body: str, to_addr: str, from_addr: str) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"Castellon Septic Services <{from_addr}>"
    msg["To"] = to_addr
    msg["Reply-To"] = from_addr
    msg.set_content(body)
    return msg


def _send_via_sendmail(msg: EmailMessage, sendmail_bin: str) -> Tuple[bool, str]:
    try:
        proc = subprocess.run(
            [sendmail_bin, "-t", "-i", "-f", msg["From"].split("<")[-1].rstrip(">")],
            input=msg.as_bytes(),
            capture_output=True,
            timeout=15,
        )
        if proc.returncode == 0:
            return True, "sendmail exit=0"
        return False, f"sendmail exit={proc.returncode} stderr={proc.stderr.decode(errors='replace')[:400]}"
    except Exception as e:
        return False, f"sendmail exception: {e!r}"


# ---------- Public API ----------

def _send(subject: str, body: str) -> dict:
    """Send email. Returns diagnostic dict {ok, transport, detail}."""
    to_addr = os.environ.get("NOTIFY_EMAIL")
    from_addr = os.environ.get("NOTIFY_FROM", "onboarding@resend.dev")

    if not _enabled():
        logger.info("[notify] disabled — skipping: %s", subject)
        return {"ok": False, "transport": None, "detail": "NOTIFY_ENABLED is false"}
    if not to_addr:
        logger.warning("[notify] NOTIFY_EMAIL not set — skipping: %s", subject)
        return {"ok": False, "transport": None, "detail": "NOTIFY_EMAIL not set"}

    # 1) Try Resend first (bulletproof, no DNS drama)
    if os.environ.get("RESEND_API_KEY"):
        ok, detail = _send_via_resend(subject, body, to_addr, from_addr)
        if ok:
            logger.info("[notify] sent via Resend -> %s (%s)", to_addr, subject)
            return {"ok": True, "transport": "resend", "detail": detail}
        logger.warning("[notify] Resend failed, trying sendmail: %s", detail)
        resend_err = detail
    else:
        resend_err = "RESEND_API_KEY not set"

    # 2) Fallback to local sendmail binary
    msg = _build_message(subject, body, to_addr, from_addr)
    sendmail_bin = _find_sendmail()
    if sendmail_bin:
        ok, detail = _send_via_sendmail(msg, sendmail_bin)
        if ok:
            logger.info("[notify] sent via sendmail -> %s (%s)", to_addr, subject)
            return {"ok": True, "transport": f"sendmail ({sendmail_bin})", "detail": detail}
        sendmail_err = detail
    else:
        sendmail_err = "no sendmail binary found"

    logger.error("[notify] all transports failed: resend=%s | sendmail=%s", resend_err, sendmail_err)
    return {"ok": False, "transport": None, "detail": f"resend={resend_err} | sendmail={sendmail_err}"}


def notify_new_booking(b: dict) -> dict:
    label = SERVICE_LABELS.get(b.get("service_type"), b.get("service_type", "Service"))
    emergency = b.get("service_type") == "emergency"
    prefix = "EMERGENCY BOOKING" if emergency else "New Booking"
    subject = f"[{prefix}] {label} - {b.get('customer_name')} - {b.get('city')}"
    lines = [
        f"A new {'EMERGENCY ' if emergency else ''}booking was just submitted on castellonsepticservices.com.",
        "",
        f"Service:   {label}",
        f"Date:      {b.get('date')}",
        f"Time:      {b.get('time')}",
        "",
        f"Name:      {b.get('customer_name')}",
        f"Phone:     {b.get('customer_phone')}",
        f"Email:     {b.get('customer_email') or '(not provided)'}",
        f"Address:   {b.get('address')}",
        f"City:      {b.get('city')}",
    ]
    if b.get("notes"):
        lines += ["", "Notes:", b["notes"]]
    lines += ["", "-----", "Admin dashboard:", "https://castellonsepticservices.com/admin"]
    return _send(subject, "\n".join(lines))


def notify_new_quote(q: dict) -> dict:
    label = SERVICE_LABELS.get(q.get("service_type"), q.get("service_type") or "General Inquiry")
    subject = f"[New Quote Request] {q.get('name')} - {q.get('city') or 'Location TBD'}"
    lines = [
        "A new quote request was just submitted on castellonsepticservices.com.",
        "",
        f"Service:   {label}",
        f"Name:      {q.get('name')}",
        f"Phone:     {q.get('phone')}",
        f"Email:     {q.get('email') or '(not provided)'}",
        f"Address:   {q.get('address') or '(not provided)'}",
        f"City:      {q.get('city') or '(not provided)'}",
        "",
        "Message:",
        q.get("message") or "(no message)",
        "",
        "-----",
        "Admin dashboard:",
        "https://castellonsepticservices.com/admin",
    ]
    return _send(subject, "\n".join(lines))


def notify_test() -> dict:
    subject = "[Test] Castellon Septic Services notification system"
    body = (
        "This is a test email from your Castellon Septic Services website.\n\n"
        "If you can read this, notifications are working correctly.\n\n"
        "You will receive an email like this whenever a customer books a service or requests a quote.\n"
    )
    return _send(subject, body)


def diagnostics() -> dict:
    """Return a snapshot of the notification config for debugging."""
    return {
        "enabled": _enabled(),
        "notify_email": os.environ.get("NOTIFY_EMAIL"),
        "notify_from": os.environ.get("NOTIFY_FROM", "onboarding@resend.dev"),
        "resend_configured": bool(os.environ.get("RESEND_API_KEY")),
        "sendmail_binary": _find_sendmail(),
    }
