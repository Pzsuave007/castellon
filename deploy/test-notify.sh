#!/bin/bash
# ============================================================
# test-notify.sh — Send a test email via the admin API and show
# the full diagnostic response.
#
# Usage:
#   bash /home/castellon/repo/deploy/test-notify.sh
# ============================================================
set -e

DOMAIN="castellonsepticservices.com"
ADMIN_EMAIL="admin@${DOMAIN}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Castellon2026!}"

echo ">>> Logging in as $ADMIN_EMAIL..."
TOKEN=$(curl -s -X POST "https://${DOMAIN}/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}" \
    | python3 -c "import sys,json;print(json.load(sys.stdin).get('token',''))")

if [ -z "$TOKEN" ]; then
    echo "Login failed — check admin password"
    exit 1
fi

echo ">>> Sending test email..."
echo ""
curl -s -X POST "https://${DOMAIN}/api/admin/notify/test" \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

echo ""
echo ">>> If result.ok = true, check pzsuave007@gmail.com (inbox AND spam) within 1-2 minutes"
