#!/bin/bash
# ============================================================
# install_server.sh — First-time install (runs as cPanel user)
# Called from deploy.sh via `su -s /bin/bash -l USER`
# ============================================================
set -e

CPANEL_USER="castellon"
PORT=8011
DOMAIN="castellonsepticservices.com"

REPO="/home/${CPANEL_USER}/repo"
PROD="/opt/${CPANEL_USER}/backend"
PUBLIC_HTML="/home/${CPANEL_USER}/public_html"

echo ">>> [install_server] Building backend virtualenv..."

# ---------- BACKEND ----------
python3 -m venv "$PROD/venv"
source "$PROD/venv/bin/activate"
pip install --upgrade pip
pip install --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/ \
    -r "$REPO/deploy/requirements.prod.txt"
deactivate

# Copy backend code (server.py etc.) into PROD
cp "$REPO/backend/server.py" "$PROD/server.py"

echo ">>> [install_server] Backend installed at $PROD"

# ---------- FRONTEND ----------
# We do NOT run `yarn build` on server (low RAM crashes) — the build was
# produced in Emergent and lives in /repo/frontend/build/. Copy it into
# public_html, cleaning old asset hashes first.
if [ ! -d "$REPO/frontend/build" ]; then
    echo "❌ frontend/build not found in repo. Run 'yarn build' in Emergent and re-commit."
    exit 1
fi

mkdir -p "$PUBLIC_HTML"
# Wipe old asset hashes but preserve .htaccess if we placed it ourselves
find "$PUBLIC_HTML" -mindepth 1 -maxdepth 1 ! -name ".htaccess" ! -name ".well-known" -exec rm -rf {} +
cp -r "$REPO/frontend/build/". "$PUBLIC_HTML/"

# Install .htaccess (Apache proxy + SPA fallback)
cp "$REPO/deploy/htaccess" "$PUBLIC_HTML/.htaccess"

# Permissions Apache-friendly
find "$PUBLIC_HTML" -type d -exec chmod 755 {} \;
find "$PUBLIC_HTML" -type f -exec chmod 644 {} \;

echo ">>> [install_server] Frontend copied to $PUBLIC_HTML"

# ---------- START BACKEND ----------
# Kill any old uvicorn on our port
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
sleep 1

cd "$PROD"
nohup "$PROD/venv/bin/uvicorn" server:app \
    --host 127.0.0.1 --port "$PORT" \
    --app-dir "$PROD" \
    > "$PROD/backend.log" 2>&1 &

sleep 3
if curl -sf "http://127.0.0.1:${PORT}/api/" >/dev/null; then
    echo ">>> [install_server] ✅ Backend up on port $PORT"
else
    echo ">>> [install_server] ⚠️  Backend not yet responding — see backend.log"
    tail -n 20 "$PROD/backend.log"
fi
