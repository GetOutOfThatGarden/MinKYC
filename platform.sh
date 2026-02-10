#!/bin/bash
# platform.sh — Platform-side KYC verification
# Simulates a platform verifying a user's identity

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "═══════════════════════════════════════════════════════════════"
echo "  🏢  MinKYC Platform CLI — KYC Verification"
echo "═══════════════════════════════════════════════════════════════"
echo ""

show_help() {
    echo "Usage: ./platform.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  verify       Request and verify KYC in one step"
    echo "  help         Show this help message"
    echo ""
    echo "Options for verify:"
    echo "  --over-18          Require user to be over 18 years old"
    echo "  --eu-resident      Require EU residency"
    echo "  --identity <pda>   Target specific identity PDA (skips prompt)"
    echo ""
    echo "Example:"
    echo "  ./platform.sh verify --over-18"
    echo ""
}

prompt_for_pda() {
    echo ""
    echo "─────────────────────────────────────────────────────────────"
    read -p "🏢 Welcome Platform! Please enter the user's ID code (PDA): " PDA_INPUT
    echo "─────────────────────────────────────────────────────────────"
    echo ""
    
    if [ -z "$PDA_INPUT" ]; then
        echo "❌ Error: PDA is required"
        exit 1
    fi
    
    TARGET_IDENTITY="$PDA_INPUT"
}

case "${1:-}" in
    verify)
        shift
        
        # Parse options
        OVER_18=false
        EU_RESIDENT=false
        TARGET_IDENTITY=""
        
        while [[ $# -gt 0 ]]; do
            case "$1" in
                --over-18)
                    OVER_18=true
                    shift
                    ;;
                --eu-resident)
                    EU_RESIDENT=true
                    shift
                    ;;
                --identity)
                    if [[ -n "$2" && ! "$2" =~ ^-- ]]; then
                        TARGET_IDENTITY="$2"
                        shift 2
                    else
                        echo "❌ Error: --identity requires a PDA argument"
                        exit 1
                    fi
                    ;;
                *)
                    echo "❌ Unknown option: $1"
                    show_help
                    exit 1
                    ;;
            esac
        done
        
        # Prompt for PDA if not provided
        if [ -z "$TARGET_IDENTITY" ]; then
            prompt_for_pda
        fi
        
        # Build requirements
        REQS='{}'
        if [ "$OVER_18" = true ]; then
            REQS=$(echo "$REQS" | jq '.over18 = true')
        fi
        if [ "$EU_RESIDENT" = true ]; then
            REQS=$(echo "$REQS" | jq '.euResident = true')
        fi
        
        # Create request JSON
        echo "{
  \"requirements\": $REQS,
  \"targetIdentity\": \"$TARGET_IDENTITY\",
  \"timestamp\": $(date +%s)000
}" > request.json
        
        echo "📋 KYC Request Created:"
        echo "   Target Identity: $TARGET_IDENTITY"
        echo "   Requirements:"
        [ "$OVER_18" = true ] && echo "     ✓ Over 18"
        [ "$EU_RESIDENT" = true ] && echo "     ✓ EU Resident"
        echo ""
        
        # Submit verification
        echo "✅ Submitting verification proof to Solana..."
        echo ""
        
        npx tsx cli/src/index.ts prove
        
        echo ""
        echo "🎉 KYC verification complete!"
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
