#!/bin/bash
# setup-build-tools.sh — Install Rust, Solana CLI, and Anchor

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  🔧 Installing MinKYC Build Tools"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 1. Install Rust
echo "⏳ Installing Rust..."
if ! command -v rustc &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
    echo "✅ Rust installed: $(rustc --version)"
else
    echo "✅ Rust already installed: $(rustc --version)"
fi

# 2. Install Solana CLI
echo ""
echo "⏳ Installing Solana CLI..."
if ! command -v solana &> /dev/null; then
    sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    echo "✅ Solana CLI installed: $(solana --version)"
else
    echo "✅ Solana CLI already installed: $(solana --version)"
fi

# 3. Install Anchor
echo ""
echo "⏳ Installing Anchor..."
if ! command -v anchor &> /dev/null; then
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
    echo "✅ Anchor installed: $(anchor --version)"
else
    echo "✅ Anchor already installed: $(anchor --version)"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ All build tools installed!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Now run: anchor build"
echo ""
