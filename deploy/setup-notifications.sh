#!/bin/bash
# ============================================================
# setup-notifications.sh — Add email notification vars to prod .env
# and restart the backend. Idempotent (safe to run multiple times).
#
# Usage (as root):
#   bash /home/castellon/repo/deploy/setup-notifications.sh
# ============================================================
set -e

CPANEL_USER="castellon"
PORT=8011
PROD="/opt/${CPANEL_USER}/backend"
ENV_FILE="$PROD/.env"

[ "$EUID" -ne 0 ] && { echo "Run as root"; exit 1; }
[ ! -f "$ENV_FILE" ] && { echo "$ENV_FILE not found — run deploy.sh first"; exit 1; }

echo ">>> Ensuring notification variables in $ENV_FILE"

set_var() {
    local key="$1"
    local val="$2"
    if grep -q "^${key}=" "$ENV_FILE"; then
        sed -i "s|^${key}=.*|${key}=${val}|" "$ENV_FILE"
        echo "  updated: ${key}"
    else
        echo "${key}=${val}" >> "$ENV_FILE"
        echo "  added:   ${key}"
    fi
}

set_var NOTIFY_ENABLED "true"
set_var NOTIFY_EMAIL "pzsuave007@gmail.com"
set_var NOTIFY_FROM "no-reply@castellonsepticservices.com"
set_var SMTP_HOST "localhost"
set_var SMTP_PORT "25"

echo ""
echo ">>> Restarting backend on port $PORT..."
pkill -f "uvicorn.*:${PORT}" 2>/dev/null || true
sleep 1

su -s /bin/bash -l "$CPANEL_USER" -c "
    cd $PROD
    nohup $PROD/venv/bin/uvicorn server:app \
        --host 127.0.0.1 --port $PORT \
        --app-dir $PROD > $PROD/backend.log 2>&1 &
"

sleep 3
if curl -sf "http://127.0.0.1:${PORT}/api/" >/dev/null; then
    echo ""
    echo "Notification vars set and backend restarted"
    echo ""
    echo "Current config:"
    grep -E "^(NOTIFY|SMTP)" "$ENV_FILE" | sed 's/^/   /'
    echo ""
    echo "Next step — send a test email:"
    echo "   bash /home/castellon/repo/deploy/test-notify.sh"
else
    echo "Backend not responding — check $PROD/backend.log"
    tail -n 20 "$PROD/backend.log"
    exit 1
fi
