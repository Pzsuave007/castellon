#!/bin/bash
# ============================================================
# setup-notifications.sh — Configure Resend email notifications
# in the prod backend .env and restart. Idempotent.
#
# Usage (as root):
#   RESEND_API_KEY='re_xxx' bash /home/castellon/repo/deploy/setup-notifications.sh
# ============================================================
set -e

CPANEL_USER="castellon"
PORT=8011
PROD="/opt/${CPANEL_USER}/backend"
ENV_FILE="$PROD/.env"

[ "$EUID" -ne 0 ] && { echo "Run as root"; exit 1; }
[ ! -f "$ENV_FILE" ] && { echo "$ENV_FILE not found — run deploy.sh first"; exit 1; }
[ -z "$RESEND_API_KEY" ] && { echo "Please export RESEND_API_KEY before running"; echo "  RESEND_API_KEY='re_xxx' bash $0"; exit 1; }

NOTIFY_EMAIL="${NOTIFY_EMAIL:-pzsuave007@gmail.com}"
NOTIFY_FROM="${NOTIFY_FROM:-no-reply@castellonsepticservices.com}"

echo ">>> Setting notification vars in $ENV_FILE"

# Wipe old SMTP / NOTIFY vars, then re-add clean set
sed -i '/^SMTP_/d; /^NOTIFY_/d; /^RESEND_API_KEY=/d' "$ENV_FILE"
{
    echo "NOTIFY_ENABLED=true"
    echo "NOTIFY_EMAIL=$NOTIFY_EMAIL"
    echo "NOTIFY_FROM=$NOTIFY_FROM"
    echo "RESEND_API_KEY=$RESEND_API_KEY"
} >> "$ENV_FILE"

echo ">>> Installing resend Python package..."
runuser -u "$CPANEL_USER" -- "$PROD/venv/bin/pip" install resend >/dev/null 2>&1 || \
    su -s /bin/bash -c "$PROD/venv/bin/pip install resend >/dev/null 2>&1" "$CPANEL_USER" || {
    echo "pip install failed — check $PROD/venv"
    exit 1
}

echo ">>> Restarting backend on port $PORT..."
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
sleep 2

# Try setsid + runuser first (works even when the user has no shell — cPanel default)
setsid -f runuser -u "$CPANEL_USER" -- "$PROD/venv/bin/uvicorn" server:app \
    --host 127.0.0.1 --port "$PORT" --app-dir "$PROD" \
    >> "$PROD/backend.log" 2>&1 < /dev/null || \
sudo -u "$CPANEL_USER" bash -c "
    cd $PROD
    nohup $PROD/venv/bin/uvicorn server:app \
        --host 127.0.0.1 --port $PORT \
        --app-dir $PROD >> $PROD/backend.log 2>&1 &
    disown
"

sleep 3
if curl -sf "http://127.0.0.1:${PORT}/api/" >/dev/null; then
    echo ""
    echo "Notifications configured and backend restarted"
    echo ""
    echo "Config:"
    grep -E "^(NOTIFY|RESEND_API_KEY)" "$ENV_FILE" | sed 's/RESEND_API_KEY=.*/RESEND_API_KEY=re_***HIDDEN***/' | sed 's/^/   /'
    echo ""
    echo "Test it:"
    echo "   bash /home/castellon/repo/deploy/test-notify.sh"
else
    echo "Backend not responding — check $PROD/backend.log"
    tail -n 30 "$PROD/backend.log"
    exit 1
fi
