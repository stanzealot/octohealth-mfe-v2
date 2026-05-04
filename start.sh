#!/bin/bash
# OctoHealth MFE v2 — start all 3 servers
# Usage: ./start.sh

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "🚀  Starting OctoHealth MFE v2 servers..."
echo ""

# Kill anything on our ports first
echo "⏹   Stopping old processes on ports 3000, 3001, 3005..."
lsof -ti:3000,3001,3005 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Build remotes if dist is missing
for pkg in shared-ui remote-crm; do
  if [ ! -d "$ROOT/packages/$pkg/dist" ]; then
    echo "🔨  Building $pkg (first run)..."
    cd "$ROOT/packages/$pkg" && pnpm build
  fi
done

# Start preview servers (remotes serve pre-built dist)
echo "▶   Starting shared-ui   → http://localhost:3005"
cd "$ROOT/packages/shared-ui" && pnpm preview > /tmp/shared-ui-v2.log 2>&1 &

echo "▶   Starting remote-crm  → http://localhost:3001"
cd "$ROOT/packages/remote-crm" && pnpm preview > /tmp/remote-crm-v2.log 2>&1 &

# Give remotes a moment to start before shell tries to connect
sleep 2

# Start shell in dev mode (hot-reload)
echo "▶   Starting shell       → http://localhost:3000"
cd "$ROOT/packages/shell" && pnpm dev &

echo ""
echo "✅  All servers started!"
echo ""
echo "   App:        http://localhost:3000"
echo "   shared-ui:  http://localhost:3005"
echo "   remote-crm: http://localhost:3001"
echo ""
echo "   Logs: /tmp/shared-ui-v2.log | /tmp/remote-crm-v2.log"
echo ""
echo "   Press Ctrl+C to stop the shell dev server."
echo "   To stop ALL servers: kill \$(lsof -ti:3000,3001,3005)"
echo ""
echo "   ⚠️  After changing shared-ui or remote-crm code:"
echo "   cd packages/shared-ui && pnpm build && pnpm preview"
echo "   cd packages/remote-crm && pnpm build && pnpm preview"
echo ""

# Wait so Ctrl+C cleanly stops shell
wait
