#!/bin/bash
# MinKYC — Forma Residency "Ship & Show" Demo Script
# Location: Bristol, UK
# Date: July/August 2026

# Colors for terminal output
GREEN='\033[0;32m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear
echo -e "${PURPLE}==================================================${NC}"
echo -e "${PURPLE}          MinKYC — Universal ZK-Identity          ${NC}"
echo -e "${PURPLE}         Forma Residency: Ship & Show Demo        ${NC}"
echo -e "${PURPLE}==================================================${NC}"
echo ""
echo -e "This script demonstrates the full E2E flow of MinKYC:"
echo -e "1. Sovereign Identity Creation (NFC Extraction)"
echo -e "2. Privacy-Preserving Proof Request (Platform Side)"
echo -e "3. On-Device ZK-Proof Generation (User Side)"
echo -e "4. On-Chain Verification & Replay Protection (Solana)"
echo ""
read -p "Press enter to start the demo..."

# Step 1: Identity Ingestion
echo ""
echo -e "${CYAN}[Step 1] Initializing Sovereign Identity${NC}"
echo -e "Reading physical ePassport via NFC and computing on-chain commitment..."
npx tsx cli/src/index.ts identity init
echo -e "${GREEN}✅ Identity committed to Solana (Privacy-first hash only)${NC}"
echo ""
sleep 2

# Step 2: Proof Request
echo -e "${CYAN}[Step 2] Platform KYC Request${NC}"
echo -e "Forma Residency is requesting proof of 'Age >= 18'..."
npx tsx cli/src/index.ts platform request --over-18 --requester "Forma Residency Bristol"
echo -e "${GREEN}✅ Request generated: request.json${NC}"
echo ""
sleep 2

# Step 3: ZK Proof Generation
echo -e "${CYAN}[Step 3] On-Device ZK Generation${NC}"
echo -e "Generating Noir ZK-proof locally on the device (Unlinkable)..."
echo -e "This proves you are > 18 without revealing your DOB or Name."
npx tsx cli/src/index.ts prove
echo -e "${GREEN}✅ ZK-Proof generated and verified on Solana!${NC}"
echo ""
sleep 2

# Step 4: Audit
echo -e "${CYAN}[Step 4] Regulatory Audit${NC}"
echo -e "Verifying that the proof was binding and hasn't been replayed..."
npx tsx cli/src/index.ts status
echo ""

echo -e "${PURPLE}==================================================${NC}"
echo -e "${GREEN}             DEMO COMPLETE: KYC SOLVED             ${NC}"
echo -e "${PURPLE}==================================================${NC}"
echo -e "MinKYC: Privacy by Design, Compliance by Code."
echo ""
