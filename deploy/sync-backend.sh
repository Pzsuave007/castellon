#!/bin/bash
# ============================================================
# sync-backend.sh — Copy ALL backend .py files from repo to prod
# and restart. Use this after adding new backend modules.
#
# Usage (as root):
#   bash /home/castellon/repo/deploy/sync-backend.sh
# ============================================================
set -e

CPANEL_USER="castellon"
PORT=8011
REPO="/home/${CPANEL_USER}/repo"
PROD="/opt/${CPANEL_USER}/backend"

[ "$EUID" -ne 0 ] && { echo "Run as root"; exit 1; }

echo ">>> Syncing backend .py files from repo to prod..."
for f in "$REPO"/backend/*.py; do
    [ -f "$f" ] || continue
    cp "$f" "$PROD/"
    echo "   copied: $(basename $f)"
done

chown -R "$CPANEL_USER:$CPANEL_USER" "$PROD"/*.py

echo ""
echo ">>> Restarting backend on port $PORT..."
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
sleep 1

su -s /bin/bash "$CPANEL_USER" -c "
    cd $PROD
    nohup $PROD/venv/bin/uvicorn server:app \
        --host 127.0.0.1 --port $PORT \
        --app-dir $PROD > $PROD/backend.log 2>&1 &
" 2>/dev/null || setsid -f runuser -u "$CPANEL_USER" -- "$PROD/venv/bin/uvicorn" server:app --host 127.0.0.1 --port "$PORT" --app-dir "$PROD" > "$PROD/backend.log" 2>&1 < /dev/null

sleep 3
if curl -sf "http://127.0.0.1:${PORT}/api/" >/dev/null; then
    echo ""
    echo "Backend synced and restarted OK"
    echo ""
    echo "Files in $PROD/:"
    ls -la "$PROD"/*.py 2>/dev/null | awk '{print "   " $NF}'
else
    echo "Backend not responding — see $PROD/backend.log:"
    tail -n 30 "$PROD/backend.log"
    exit 1
fi
