#!/bin/bash
# Test the readings API - run with your wallet address while the dev server is up
# Usage: ./scripts/test-readings-api.sh 0xYourWalletAddress
# Or: ADDRESS=0xYourAddress ./scripts/test-readings-api.sh

ADDRESS="${1:-$ADDRESS}"
if [ -z "$ADDRESS" ]; then
  echo "Usage: $0 <wallet_address>"
  echo "Example: $0 0x1234567890abcdef1234567890abcdef12345678"
  exit 1
fi

BASE="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
echo "Testing readings API at $BASE"
echo "Address: $ADDRESS"
echo ""

echo "--- /api/readings?address=$ADDRESS ---"
curl -s "$BASE/api/readings?address=$ADDRESS" | jq . 2>/dev/null || curl -s "$BASE/api/readings?address=$ADDRESS"
echo ""
echo "--- /api/readings/debug?address=$ADDRESS ---"
curl -s "$BASE/api/readings/debug?address=$ADDRESS" | jq . 2>/dev/null || curl -s "$BASE/api/readings/debug?address=$ADDRESS"
