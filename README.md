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
* Identity data is mocked
* Zero-Knowledge proofs are mocked
* The CLI simulates both user and platform interactions

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

## CLI Demo Flow (Development Interface)

The CLI (`minkyc`) demonstrates the full identity lifecycle end-to-end.

### 1. Initialize Identity

Creates a local identity using mocked passport data, derives a cryptographic commitment, and stores it in a Solana PDA.

```bash
npx tsx cli/src/index.ts identity init
```

---

### 2. Check Identity Status

Fetches and displays the on-chain identity state.

```bash
npx tsx cli/src/index.ts identity status
```

---

### 3. Platform KYC Request

Simulates a third-party platform requesting verification (for example, “Must be over 18”).

```bash
npx tsx cli/src/index.ts platform request --over-18
```

---

### 4. Prove & Verify

Generates a local proof (mocked) and submits a verification transaction on-chain.

```bash
npx tsx cli/src/index.ts prove
```

Alias:

```bash
npx tsx cli/src/index.ts verify
```

The resulting Solana transaction signature serves as an immutable on-chain receipt that verification occurred.

---

## Project Structure

```
programs/minkyc/      # Anchor smart contract (Rust)
  └─ lib.rs           # Identity initialization and proof verification

cli/                  # TypeScript CLI (development & demo)
  ├─ commands/        # init, status, request, prove
  ├─ utils/           # crypto helpers & Solana connections
  └─ fixtures/        # mocked passport data
```

---

## Technical Overview

### Identity Storage
* Each identity is stored in a Program Derived Address (PDA)
* Seeded by: `["identity", owner_pubkey]`

### Commitment
* `commitment = SHA256(passport_data || secret_nonce)`
* Only the commitment is stored on-chain
* Raw identity data never leaves the user’s device

### Proof (MVP)
* Requirements are evaluated locally
* Smart contract verifies commitment consistency
* ZK logic is mocked for simplicity

### Zero-Knowledge Roadmap
* Replace mocked proofs with real ZK circuits (Noir)
* Proof generation entirely client-side
* On-chain verification without revealing attributes

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
* Privacy-preserving
* Minimal by default
* Verifiable on-chain
* Safer for both users and platforms

This CLI MVP proves the core concept today, while laying the foundation for production-ready identity verification tomorrow.
