#!/bin/bash
# Export AgentWallet key for Anchor CLI usage
# Run: source ./export-agentwallet.sh

# AgentWallet Solana address: AmhTt5Cfk69MUi3q1ySwHn6mndUHJ1gD3Boi5ngWd2BS
# This script exports the necessary environment variables to use AgentWallet with Anchor

echo "To use AgentWallet with Anchor CLI:"
echo ""
echo "1. Export your AgentWallet secret key (you need to provide this):"
echo "   export ANCHOR_WALLET=/path/to/agentwallet-keypair.json"
echo ""
echo "2. Or use AgentWallet API directly through the CLI/Node.js"
echo ""
echo "AgentWallet Details:"
echo "  Username: renovaterelocate"
echo "  Solana Address: AmhTt5Cfk69MUi3q1ySwHn6mndUHJ1gD3Boi5ngWd2BS"
echo "  Devnet Balance: 10 SOL"
echo ""
echo "Note: AgentWallet uses server-side signing via API."
echo "For local CLI commands, you'll need to export the key from AgentWallet dashboard."
echo "Visit: https://agentwallet.mcpay.tech/u/renovaterelocate"
