#!/bin/bash
# ============================================================
# setup-autostart.sh — Add @reboot crontab entry (runs as user)
# ============================================================
set -e

CPANEL_USER="castellon"
PORT=8011
PROD="/opt/${CPANEL_USER}/backend"

RESTART="/home/${CPANEL_USER}/restart.sh"

cat > "$RESTART" <<EOF
#!/bin/bash
lsof -ti:${PORT} 2>/dev/null | xargs -r kill -9 2>/dev/null || true
sleep 1
cd ${PROD}
nohup ${PROD}/venv/bin/uvicorn server:app \\
    --host 127.0.0.1 --port ${PORT} \\
    --app-dir ${PROD} \\
    > ${PROD}/backend.log 2>&1 &
EOF
chmod +x "$RESTART"

# Add @reboot cron only if not present
CRONLINE="@reboot bash $RESTART"
( crontab -l 2>/dev/null | grep -Fxv "$CRONLINE" ; echo "$CRONLINE" ) | crontab -

echo ">>> [autostart] Registered @reboot → $RESTART"
