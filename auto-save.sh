#!/bin/bash
# Auto-save: watches for file changes, commits, and pushes to GitHub
# Usage: bash auto-save.sh

WATCH_DIR="/Users/ankurchauhanok/Desktop/volunteer-platform"
cd "$WATCH_DIR" || exit 1

echo "🔄 Auto-save watching for changes in $WATCH_DIR"
echo "   Press Ctrl+C to stop"

fswatch -o "$WATCH_DIR" --exclude ".git" --exclude "node_modules" --exclude ".next" | while read -r _; do
  sleep 2
  if git status --porcelain | grep -q .; then
    git add -A
    git commit -m "Auto-save: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main 2>/dev/null
    echo "  ✓ Auto-saved and pushed $(date '+%H:%M:%S')"
  fi
done
