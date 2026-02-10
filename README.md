# MinKYC — Privacy-Preserving KYC on Solana

MinKYC is a minimal, privacy-preserving KYC protocol built on Solana.

It demonstrates how platforms can verify that users meet regulatory requirements (for example, age or residency checks) without collecting or storing personal identity data. Instead of uploading documents, users provide cryptographic proof that requirements are satisfied.

This repository contains a CLI-based MVP used for development and hackathon demonstration purposes only. In a production setting, MinKYC is designed to be used via mobile apps for users and dedicated desktop or cloud tools for platforms.

---

## Why MinKYC?

Traditional KYC forces platforms to:
* Collect highly sensitive identity data
* Store it long-term
* Secure it against breaches
* Carry ongoing regulatory and reputational liability

In practice, platforms rarely need raw identity data. They only need assurance that a user satisfies specific constraints.

MinKYC minimizes risk by:
* Keeping identity data local to the user
* Storing only cryptographic commitments on-chain
* Using on-chain verification transactions as compliance receipts

---

## MVP Scope (Important)

This MVP is intentionally simplified for rapid prototyping and hackathon submission:
* Identity data is mocked (Irish passports by default for EU/GDPR compliance testing)
* Zero-Knowledge proofs are mocked
* The CLI simulates user, platform, and regulator interactions

However, the architecture is designed to support:
* Real NFC passport reads (ICAO 9303)
* Real ZK circuits (for example, Noir)
* Secure mobile key storage
* Production-grade platform integrations

---

## Prerequisites

* Node.js v18+
* Rust & Cargo
* Solana CLI
* Anchor CLI

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Build the Anchor program:

```bash
anchor build
```

---

## Wallet Setup

MinKYC supports multiple wallet options:

### Option 1: AgentWallet (Recommended for Hackathon)

MinKYC is configured to work with [AgentWallet](https://agentwallet.mcpay.tech) for seamless hackathon participation.

**AgentWallet for MinKYC:**
- Username: `renovaterelocate`
- Solana Address: `AmhTt5Cfk69MUi3q1ySwHn6mndUHJ1gD3Boi5ngWd2BS`
- Network: Devnet (10 SOL funded)

**To use with CLI:**
```bash
# Set environment variable for AgentWallet secret key
export AGENT_WALLET_SECRET_KEY=<your-base64-secret-key>

# Then run CLI commands
npx tsx cli/src/index.ts identity init
```

Or set a local keypair file:
```bash
export ANCHOR_WALLET=~/.config/solana/id.json
```

### Option 2: Local Solana Wallet

```bash
solana config set --url devnet
solana-keygen new -o ~/.config/solana/id.json
solana airdrop 2
```

---

## Setup & Deployment (Devnet)

Configure the Solana CLI:

```bash
solana config set --url devnet
```

Fund your wallet:

```bash
solana airdrop 2
```

Deploy the program:

```bash
solana program deploy target/deploy/minkyc.so --url devnet
```

> **Note:** Deployment typically requires approximately 1.6 SOL on Devnet.

---

## Quick Demo Flow

MinKYC provides three shell scripts that simulate the complete KYC workflow from three perspectives:

### 1. User — Create Identity

The user creates their identity by scanning their passport (mocked NFC read) and uploading a cryptographic commitment to Solana.

```bash
./user.sh init
```

**What happens:**
- Generates mock Irish passport data
- Creates cryptographic commitment
- Stores commitment on-chain in a Program Derived Address (PDA)
- Displays the Identity PDA (needed by platform)

---

### 2. Platform — Verify User

The platform requests KYC verification and submits proof in one step.

```bash
./platform.sh verify --over-18
```

**What happens:**
- Prompts for user's Identity PDA
- Creates KYC requirements (e.g., "over 18")
- Generates proof from user's local passport data
- Submits verification to Solana blockchain
- Displays transaction receipt

---

### 3. Regulator — Audit Verification

The regulator checks that proper KYC verification was performed by looking up the transaction.

```bash
./regulator.sh check
```

**What happens:**
- Prompts for transaction signature
- Confirms transaction on Solana blockchain
- Displays verification receipt details
- Links to Solana Explorer for full audit trail

---

## Full Demo Example

```bash
# Terminal 1: User creates identity
./user.sh init
# Output: Identity PDA: 7K7yRj2hjngPME8KN3YmJ2y6irTPPNhwJWBsgWmAi11p

# Terminal 2: Platform verifies user
./platform.sh verify --over-18
# Enter PDA: 7K7yRj2hjngPME8KN3YmJ2y6irTPPNhwJWBsgWmAi11p
# Output: Transaction Signature: xxx...

# Terminal 3: Regulator audits
./regulator.sh check
# Enter tx signature: xxx...
# Output: Verification receipt confirmed
```

---

## Advanced CLI Commands

For development and debugging, you can also use the underlying CLI directly:

```bash
# Initialize identity
npx tsx cli/src/index.ts identity init

# Check identity status
npx tsx cli/src/index.ts identity status

# Create platform request
npx tsx cli/src/index.ts platform request --over-18

# Submit proof
npx tsx cli/src/index.ts prove
```

---

## Project Structure

```
programs/minkyc/      # Anchor smart contract (Rust)
  └─ lib.rs           # Identity initialization and proof verification

cli/                  # TypeScript CLI (development & demo)
  ├─ commands/        # init, status, request, prove
  ├─ utils/           # crypto helpers & Solana connections
  └─ fixtures/        # mocked passport data

user.sh               # User-side identity creation script
platform.sh           # Platform verification script
regulator.sh          # Regulator audit script
```

---

## Technical Overview

### Identity Storage
* Each identity is stored in a Program Derived Address (PDA)
* Seeded by: `["identity", owner_pubkey, index]`

### Commitment
* `commitment = SHA256(passport_data || secret_nonce)`
* Only the commitment is stored on-chain
* Raw identity data never leaves the user's device

### Replay Protection
* Each proof creates a unique `ProofReceipt` PDA on-chain
* Proof receipts prevent the same proof from being reused
* Enables regulatory audit trails

### Events
* `VerificationEvent` emitted on successful verification
* Contains identity reference, timestamps, and proof hashes
* Platforms can subscribe for real-time tracking

### Proof (MVP)
* Requirements are evaluated locally
* Smart contract verifies commitment consistency
* ZK logic is mocked for simplicity

### Zero-Knowledge Roadmap
* Replace mocked proofs with real ZK circuits (Noir)
* Proof generation entirely client-side
* On-chain verification without revealing attributes

---

## Smart Contract Features

- ✅ **Identity Commitments** — Store only cryptographic hashes, not raw data
- ✅ **Replay Protection** — ProofReceipt PDAs prevent double-spending
- ✅ **Events** — On-chain events for indexing and monitoring
- ✅ **Verification Count** — Track how many times an identity was verified
- ✅ **Multi-verifier Support** — Any platform can verify, not just the owner

---

## Roadmap

* Mobile app for users (secure local storage, NFC passport scanning)
* Desktop or cloud tooling for platforms
* Real Zero-Knowledge proofs using Noir
* Fine-grained selective disclosure (age, residency, sanctions checks)
* Cross-platform integrations beyond Solana

---

## Summary

MinKYC demonstrates how KYC can be:
* **Privacy-preserving** — No raw identity data on-chain
* **Minimal by default** — Only store what's necessary
* **Verifiable on-chain** — Immutable compliance receipts
* **Regulator-friendly** — Full audit trail without exposing data
* **Safer for everyone** — Reduced breach risk for platforms

This CLI MVP proves the core concept today, while laying the foundation for production-ready identity verification tomorrow.

---

## Hackathon Submissions

This project was built for:
- **Colosseum Agent Hackathon** (Feb 2026)
- **Superteam Earn Open Innovation Track** (Mar 2026)

**Program ID (Devnet):** `9zzT4KdUh7TEtiR8ioTMhDLWDa4c6ymzAjQsYYfvc3h1`
