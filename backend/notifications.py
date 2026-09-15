"""Owner email notifications via local sendmail (cPanel Exim).

Non-blocking: any failure is logged, never raised to the caller.
Recipient / sender / enable-flag come from env so they're easy to change.
"""
import os
import smtplib
import logging
from email.message import EmailMessage
from typing import Optional

logger = logging.getLogger(__name__)

SERVICE_LABELS = {
    "residential": "Residential Septic Pumping",
    "commercial": "Commercial Septic Pumping",
    "grease_trap": "Restaurant Grease Trap Cleaning",
    "emergency": "Emergency Pump-Out",
}


def _enabled() -> bool:
    return os.environ.get("NOTIFY_ENABLED", "false").lower() in ("1", "true", "yes")


def _send(subject: str, body: str) -> bool:
    """Send a plain-text email via localhost SMTP (Exim on cPanel).

    Returns True on success, False on failure. Never raises.
    """
    if not _enabled():
        logger.info("[notify] disabled — skipping: %s", subject)
        return False

    to_addr = os.environ.get("NOTIFY_EMAIL")
    from_addr = os.environ.get("NOTIFY_FROM", "no-reply@castellonsepticservices.com")
    host = os.environ.get("SMTP_HOST", "localhost")
    port = int(os.environ.get("SMTP_PORT", "25"))

    if not to_addr:
        logger.warning("[notify] NOTIFY_EMAIL not set — skipping: %s", subject)
        return False

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"Castellon Septic Services <{from_addr}>"
    msg["To"] = to_addr
    msg["Reply-To"] = from_addr
    msg.set_content(body)

    try:
        with smtplib.SMTP(host, port, timeout=10) as s:
            s.send_message(msg)
        logger.info("[notify] sent -> %s (%s)", to_addr, subject)
        return True
    except Exception as e:
        logger.error("[notify] send failed (%s): %s", subject, e)
        return False


def notify_new_booking(b: dict) -> bool:
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
    lines += [
        "",
        "-----",
        "View in admin dashboard:",
        "https://castellonsepticservices.com/admin",
    ]
    return _send(subject, "\n".join(lines))


def notify_new_quote(q: dict) -> bool:
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
        "View in admin dashboard:",
        "https://castellonsepticservices.com/admin",
    ]
    return _send(subject, "\n".join(lines))


def notify_test(custom_message: Optional[str] = None) -> bool:
    """Manual test trigger used by the /api/admin/notify/test endpoint."""
    subject = "[Test] Castellon Septic Services notification system"
    body = (
        "This is a test email from your Castellon Septic Services website.\n\n"
        "If you can read this, notifications are working correctly.\n\n"
        f"Custom message: {custom_message}" if custom_message else
        "This is a test email from your Castellon Septic Services website.\n\n"
        "If you can read this, notifications are working correctly.\n"
    )
    return _send(subject, body)
