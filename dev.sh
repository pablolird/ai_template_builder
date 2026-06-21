#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BE_DIR="$SCRIPT_DIR/back-end"
SESSION="term"

# ── Start Postgres ────────────────────────────────────────────────────────────
echo "Starting Postgres..."
docker compose \
  -f "$BE_DIR/docker-compose.yml" \
  -f "$BE_DIR/docker-compose.qa.yml" \
  --env-file "$BE_DIR/.env" \
  up -d postgres

echo "Waiting for Postgres to be healthy..."
until docker compose \
  -f "$BE_DIR/docker-compose.yml" \
  -f "$BE_DIR/docker-compose.qa.yml" \
  --env-file "$BE_DIR/.env" \
  ps postgres 2>/dev/null | grep -q "healthy"; do
  sleep 1
done
echo "Postgres ready."

# ── Launch tmux ───────────────────────────────────────────────────────────────
tmux kill-session -t "$SESSION" 2>/dev/null || true

tmux new-session -d -s "$SESSION" -n dev \
  -x "$(tput cols)" -y "$(tput lines)"

# Left pane: backend
tmux send-keys -t "$SESSION" "cd '$BE_DIR' && pnpm dev" Enter

# Right pane: frontend
tmux split-window -h -t "$SESSION"
tmux send-keys -t "$SESSION" "cd '$SCRIPT_DIR/front-end' && pnpm dev" Enter

tmux select-layout -t "$SESSION" even-horizontal
tmux select-pane -t "$SESSION":0.0

tmux attach-session -t "$SESSION"
