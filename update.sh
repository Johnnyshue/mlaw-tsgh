#!/usr/bin/env bash
# 一鍵更新醫療法律知識庫
set -e
cd "$(dirname "$0")"

VENV="$HOME/.clinical-tools/venv"
[ -d "$VENV" ] && source "$VENV/bin/activate"

case "${1:-all}" in
  laws|all)
    echo "=== 重新爬法條 ==="
    python scripts/fetch_laws.py
    ;;
esac

case "${1:-all}" in
  cases|all)
    if [ -f scripts/fetch_cases.py ]; then
      echo "=== 重新整理案例 ==="
      python scripts/fetch_cases.py
    fi
    ;;
esac

echo "=== 完成。本機預覽：python3 -m http.server 8766 ==="
