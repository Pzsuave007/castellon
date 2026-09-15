#!/bin/bash
# ============================================================
# reset-admin.sh — Reset admin password on production (cPanel)
# Usage (as root):
#   bash /home/castellon/repo/deploy/reset-admin.sh 'NewPassword123!'
# Or with default fallback:
#   bash /home/castellon/repo/deploy/reset-admin.sh
# ============================================================
set -e

CPANEL_USER="castellon"
PORT=8011
PROD="/opt/${CPANEL_USER}/backend"
NEW_PASS="${1:-Catellon2026!}"

[ "$EUID" -ne 0 ] && { echo "Run as root"; exit 1; }
[ ! -f "$PROD/.env" ] && { echo "$PROD/.env not found — run deploy.sh first"; exit 1; }

echo ">>> Setting ADMIN_PASSWORD in $PROD/.env"
# Escape special chars for sed (& / \)
ESCAPED=$(printf '%s\n' "$NEW_PASS" | sed 's/[&/\]/\\&/g')
if grep -q '^ADMIN_PASSWORD=' "$PROD/.env"; then
    sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=${ESCAPED}|" "$PROD/.env"
else
    echo "ADMIN_PASSWORD=${NEW_PASS}" >> "$PROD/.env"
fi

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
    echo "Admin password reset OK"
    echo "   Email:    $(grep '^ADMIN_EMAIL=' "$PROD/.env" | cut -d= -f2)"
    echo "   Password: $NEW_PASS"
    echo ""
    echo "Login at: https://castellonsepticservices.com/admin/login"
else
    echo "Backend not responding — check $PROD/backend.log"
    tail -n 20 "$PROD/backend.log"
    exit 1
fi
