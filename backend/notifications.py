"""Owner email notifications for Castellon Septic Services.

Primary transport: /usr/sbin/sendmail -t -i (works out-of-the-box on cPanel/Exim
without requiring a real mailbox for the From: address).

Fallback: smtplib on localhost:25 (only used if the sendmail binary is missing).

Non-blocking: any failure is captured, logged, and returned in a diagnostic
dict — the caller never raises.
"""
import os
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

# Common sendmail binary locations on Linux/cPanel
SENDMAIL_PATHS = ["/usr/sbin/sendmail", "/usr/lib/sendmail", "/sbin/sendmail"]


def _enabled() -> bool:
    return os.environ.get("NOTIFY_ENABLED", "false").lower() in ("1", "true", "yes")


def _find_sendmail() -> Optional[str]:
    for p in SENDMAIL_PATHS:
        if os.path.exists(p) and os.access(p, os.X_OK):
            return p
    which = shutil.which("sendmail")
    return which


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
            return True, f"sendmail exit=0 stdout={proc.stdout.decode(errors='replace')[:200]}"
        return False, f"sendmail exit={proc.returncode} stderr={proc.stderr.decode(errors='replace')[:400]}"
    except FileNotFoundError:
        return False, f"sendmail binary not found at {sendmail_bin}"
    except subprocess.TimeoutExpired:
        return False, "sendmail timed out after 15s"
    except Exception as e:
        return False, f"sendmail exception: {e!r}"


def _send_via_smtplib(msg: EmailMessage) -> Tuple[bool, str]:
    """Send using smtplib. If SMTP_USER + SMTP_PASSWORD are set, use authenticated
    SMTP over STARTTLS (port 587) or SSL (port 465). Otherwise falls back to
    unauthenticated plain SMTP.
    """
    host = os.environ.get("SMTP_HOST", "localhost")
    port = int(os.environ.get("SMTP_PORT", "25"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASSWORD")
    use_ssl = os.environ.get("SMTP_USE_SSL", "false").lower() in ("1", "true", "yes")

    try:
        if use_ssl or port == 465:
            with smtplib.SMTP_SSL(host, port, timeout=15) as s:
                if user and password:
                    s.login(user, password)
                s.send_message(msg)
            return True, f"smtplib SSL ok host={host}:{port} auth={'yes' if user else 'no'}"
        else:
            with smtplib.SMTP(host, port, timeout=15) as s:
                s.ehlo()
                if user and password:
                    s.starttls()
                    s.ehlo()
                    s.login(user, password)
                s.send_message(msg)
            return True, f"smtplib ok host={host}:{port} auth={'yes' if user else 'no'}"
    except Exception as e:
        return False, f"smtplib failed host={host}:{port} err={e!r}"


def _send(subject: str, body: str) -> dict:
    """Send email. Returns diagnostic dict {ok, transport, detail}."""
    to_addr = os.environ.get("NOTIFY_EMAIL")
    from_addr = os.environ.get("NOTIFY_FROM", "no-reply@castellonsepticservices.com")

    if not _enabled():
        logger.info("[notify] disabled — skipping: %s", subject)
        return {"ok": False, "transport": None, "detail": "NOTIFY_ENABLED is false"}
    if not to_addr:
        logger.warning("[notify] NOTIFY_EMAIL not set — skipping: %s", subject)
        return {"ok": False, "transport": None, "detail": "NOTIFY_EMAIL not set"}

    msg = _build_message(subject, body, to_addr, from_addr)

    # If SMTP credentials are set, prefer authenticated SMTP (bulletproof).
    # Otherwise fall back to local sendmail, then to unauthenticated SMTP.
    if os.environ.get("SMTP_USER") and os.environ.get("SMTP_PASSWORD"):
        ok, detail = _send_via_smtplib(msg)
        if ok:
            logger.info("[notify] sent via authenticated SMTP -> %s (%s)", to_addr, subject)
            return {"ok": True, "transport": "smtplib (auth)", "detail": detail}
        logger.warning("[notify] authenticated SMTP failed: %s", detail)
        first_err = detail
    else:
        first_err = None

    # Try sendmail binary
    sendmail_bin = _find_sendmail()
    if sendmail_bin:
        ok, detail = _send_via_sendmail(msg, sendmail_bin)
        if ok:
            logger.info("[notify] sent via sendmail -> %s (%s)", to_addr, subject)
            return {"ok": True, "transport": f"sendmail ({sendmail_bin})", "detail": detail}
        logger.warning("[notify] sendmail failed: %s", detail)
        sendmail_err = detail
    else:
        sendmail_err = "no sendmail binary found"
        logger.warning("[notify] %s", sendmail_err)

    # Last resort: unauthenticated smtplib (only if we didn't already try authenticated)
    if not first_err:
        ok, detail = _send_via_smtplib(msg)
        if ok:
            logger.info("[notify] sent via smtplib -> %s (%s)", to_addr, subject)
            return {"ok": True, "transport": "smtplib", "detail": detail}
        first_err = detail

    logger.error("[notify] all transports failed: smtp_auth=%s | sendmail=%s", first_err, sendmail_err)
    return {"ok": False, "transport": None, "detail": f"smtp_auth={first_err} | sendmail={sendmail_err}"}


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
        "notify_from": os.environ.get("NOTIFY_FROM", "no-reply@castellonsepticservices.com"),
        "smtp_host": os.environ.get("SMTP_HOST", "localhost"),
        "smtp_port": os.environ.get("SMTP_PORT", "25"),
        "sendmail_binary": _find_sendmail(),
    }
