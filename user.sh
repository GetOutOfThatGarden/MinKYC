#!/bin/bash
# user.sh — User-side identity creation and management
# Simulates the user creating their identity and uploading commitment to blockchain

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "═══════════════════════════════════════════════════════════════"
echo "  🪪  MinKYC User CLI — Identity Creation"
echo "═══════════════════════════════════════════════════════════════"
echo ""

show_help() {
    echo "Usage: ./user.sh [command]"
    echo ""
    echo "Commands:"
    echo "  init         Create a new identity (mock NFC passport scan)"
    echo "  status       Check your on-chain identity status"
    echo "  help         Show this help message"
    echo ""
}

case "${1:-}" in
    init)
        echo "📱 Scanning passport (mock NFC)..."
        echo ""
        npx tsx cli/src/index.ts identity init
        echo ""
        echo "✅ Identity created and commitment uploaded to Solana!"
        ;;
    status)
        echo "🔍 Checking identity status..."
        echo ""
        npx tsx cli/src/index.ts identity status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown command: ${1:-}"
        echo ""
        show_help
        exit 1
        ;;
esac
