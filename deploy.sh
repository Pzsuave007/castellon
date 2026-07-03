#!/bin/bash
# ============================================================
# Castellon Septic Services — Deploy Script
# Follows /deploy/NEXT_PROJECT_GUIDE.md (based on La Campeona)
# Runs as root. Detects first-install vs update automatically.
# ============================================================
set -e

# ============ AJUSTA ESTAS 4 VARIABLES ============
REPO_URL="https://github.com/catellon/castellon.git"
CPANEL_USER="castellon"
PORT=8011
DOMAIN="castellonsepticservices.com"
# ===================================================

REPO="/home/${CPANEL_USER}/repo"
PROD="/opt/${CPANEL_USER}/backend"

[ "$EUID" -ne 0 ] && { echo "❌ Run as root"; exit 1; }

echo ">>> Castellon Septic — deploy for ${CPANEL_USER} on port ${PORT}"

# Trust every git dir (fix "dubious ownership")
git config --global --add safe.directory '*' 2>/dev/null || true

as_user() { su -s /bin/bash -l "$CPANEL_USER" -c "$1"; }

# ------------------------------------------------------------
# FIRST-TIME INSTALL vs UPDATE
# ------------------------------------------------------------
if [ ! -d "$PROD/venv" ]; then
    echo ">>> FIRST-TIME INSTALL"

    # Clone repo if missing
    if [ ! -d "$REPO/.git" ]; then
        rm -rf "$REPO"
        git clone "$REPO_URL" "$REPO"
    fi

    chown -R "$CPANEL_USER:$CPANEL_USER" "$REPO"
    chmod 711 "/home/$CPANEL_USER"

    mkdir -p "$PROD"
    chown -R "$CPANEL_USER:$CPANEL_USER" "/opt/$CPANEL_USER"

    # Seed .env from template (only if missing)
    if [ ! -f "$PROD/.env" ]; then
        cp "$REPO/deploy/backend.env.production.example" "$PROD/.env"
        sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$(openssl rand -hex 64)|" "$PROD/.env"
        chown "$CPANEL_USER:$CPANEL_USER" "$PROD/.env"
        chmod 600 "$PROD/.env"
        echo ">>> .env seeded — remember to set ADMIN_PASSWORD & SUPER_ADMIN_PASSWORD in ${PROD}/.env"
    fi

    as_user "bash $REPO/deploy/install_server.sh"
    as_user "bash $REPO/deploy/setup-autostart.sh"
else
    echo ">>> UPDATE"
    chown -R "$CPANEL_USER:$CPANEL_USER" "$REPO"
    as_user "bash $REPO/deploy/fix.sh"
fi

# ------------------------------------------------------------
# Health check
# ------------------------------------------------------------
sleep 2
if curl -sf "http://localhost:$PORT/api/" >/dev/null; then
    echo "  ✅ Backend OK on port $PORT"
else
    echo "  ❌ Backend not responding on port $PORT:"
    tail -n 20 "$PROD/backend.log" 2>/dev/null || true
    exit 1
fi

echo ""
echo "🎉 Deploy done → https://$DOMAIN"
echo "   Admin login → https://$DOMAIN/admin/login"
