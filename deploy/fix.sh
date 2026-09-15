#!/bin/bash
# ============================================================
# fix.sh — Update deploy (runs as cPanel user)
# Called from deploy.sh on subsequent deploys.
# ============================================================
set -e

CPANEL_USER="castellon"
PORT=8011

REPO="/home/${CPANEL_USER}/repo"
PROD="/opt/${CPANEL_USER}/backend"
PUBLIC_HTML="/home/${CPANEL_USER}/public_html"

echo ">>> [fix] Pulling latest from git..."
cd "$REPO"
git fetch --all
git reset --hard origin/main

# ---------- BACKEND ----------
echo ">>> [fix] Refreshing backend deps..."
source "$PROD/venv/bin/activate"
pip install --upgrade pip
pip install --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/ \
    -r "$REPO/deploy/requirements.prod.txt"
deactivate

cp "$REPO/backend/server.py" "$PROD/server.py"

# Copy any additional Python modules (notifications.py, etc.) — anything
# alongside server.py except tests, venv, __pycache__, and .env
for f in "$REPO"/backend/*.py; do
    [ -f "$f" ] || continue
    cp "$f" "$PROD/"
done

# ---------- FRONTEND ----------
if [ -d "$REPO/frontend/build" ]; then
    echo ">>> [fix] Copying frontend build..."
    find "$PUBLIC_HTML" -mindepth 1 -maxdepth 1 ! -name ".htaccess" ! -name ".well-known" -exec rm -rf {} +
    cp -r "$REPO/frontend/build/". "$PUBLIC_HTML/"
    cp "$REPO/deploy/htaccess" "$PUBLIC_HTML/.htaccess"
    find "$PUBLIC_HTML" -type d -exec chmod 755 {} \;
    find "$PUBLIC_HTML" -type f -exec chmod 644 {} \;
else
    echo "⚠️  frontend/build/ missing — skipping frontend update."
fi

# ---------- RESTART BACKEND ----------
echo ">>> [fix] Restarting backend on port $PORT..."
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
sleep 1

cd "$PROD"
nohup "$PROD/venv/bin/uvicorn" server:app \
    --host 127.0.0.1 --port "$PORT" \
    --app-dir "$PROD" \
    > "$PROD/backend.log" 2>&1 &

sleep 3
if curl -sf "http://127.0.0.1:${PORT}/api/" >/dev/null; then
    echo ">>> [fix] ✅ Backend restarted OK"
else
    echo ">>> [fix] ❌ Backend not responding — see $PROD/backend.log"
    tail -n 20 "$PROD/backend.log"
    exit 1
fi
