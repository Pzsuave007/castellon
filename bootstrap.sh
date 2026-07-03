#!/bin/bash
# ============================================================
# Castellon Septic — Fresh Server Bootstrap
# Run ONCE on a brand-new AlmaLinux/cPanel server (as root).
# Usage:
#   curl -sSL https://raw.githubusercontent.com/Pzsuave007/castellon-septic/main/bootstrap.sh | bash
# ============================================================
set -e

REPO_URL="https://github.com/catellon/castellon.git"
CPANEL_USER="castellon"
REPO="/home/${CPANEL_USER}/repo"

[ "$EUID" -ne 0 ] && { echo "❌ Run as root"; exit 1; }

echo ">>> Bootstrapping Castellon on fresh server..."

# Fix git ownership globally (once per server)
git config --global --add safe.directory '*'

# Verify cPanel user exists
if ! id "$CPANEL_USER" >/dev/null 2>&1; then
    echo "❌ cPanel user '${CPANEL_USER}' does not exist. Create the cPanel account first."
    exit 1
fi

# Ensure MongoDB is running (installed via MongoDB Compass CE 7 repo on AlmaLinux)
if ! systemctl is-active --quiet mongod; then
    echo ">>> Installing MongoDB CE 7 (AlmaLinux) ..."
    cat > /etc/yum.repos.d/mongodb-org-7.0.repo <<EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
EOF
    dnf install -y mongodb-org
    systemctl enable --now mongod
fi

# Clone repo (as root — then chown to user in deploy.sh)
if [ ! -d "$REPO/.git" ]; then
    rm -rf "$REPO"
    git clone "$REPO_URL" "$REPO"
fi

chown -R "$CPANEL_USER:$CPANEL_USER" "$REPO"

# Kick off deploy.sh — it detects first-install and does everything
bash "$REPO/deploy.sh"
