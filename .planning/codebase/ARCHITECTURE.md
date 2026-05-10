# Architecture

**Analysis Date:** 2025-05-14

## Pattern Overview

**Overall:** Hybrid On-chain/Off-chain Privacy-First Architecture

**Key Characteristics:**
- **Zero-Knowledge Privacy:** User identity constraints (e.g., Age > 18) are verified locally on the device without revealing raw PII (Personally Identifiable Information).
- **On-chain Commitment Verification:** Solana programs store non-PII identity commitments (hashes) to bind ZK proofs to a specific, unique identity.
- **Replay Protection:** Every verification creates a unique `ProofReceipt` PDA (Program Derived Address) seeded by the proof hash, preventing the same proof from being used twice.

## Layers

**ZK Circuit Layer:**
- Purpose: Defines the logic for proving identity constraints without revealing data.
- Location: `circuits/`
- Contains: Noir source code (`src/main.nr`) and circuit configuration (`Nargo.toml`).
- Depends on: Noir framework.
- Used by: Mobile app and CLI for proof generation.

**Blockchain Layer:**
- Purpose: Provides an immutable anchor for identity commitments and proof receipts.
- Location: `programs/minkyc/`
- Contains: Anchor/Rust program logic (`src/lib.rs`).
- Depends on: Solana/Anchor framework.
- Used by: Mobile app and CLI for on-chain verification.

**Client Layer (Mobile):**
- Purpose: Handles NFC passport scanning, local secure storage, and local ZK proof generation.
- Location: `mobile/App/`
- Contains: React Native components, NFC hooks, and ZK engine.
- Depends on: `react-native-nfc-manager`, `solana/web3.js`, and Noir WASM backends.
- Used by: End users.

**Simulation/CLI Layer:**
- Purpose: Simulates the interactions between Users, Platforms, and Regulators.
- Location: `cli/`
- Contains: TypeScript commands and cryptographic utilities.
- Depends on: `commander`, `anchor`, and local crypto helpers.
- Used by: Developers for testing and demoing the flow.

## Data Flow

**Verification Flow:**

1. **Identity Initialization:** User scans passport via NFC; mobile app generates a commitment (SHA-256 hash) and stores it on-chain in an `Identity` PDA (`programs/minkyc/src/lib.rs`).
2. **Proof Generation:** A platform requests verification (e.g., "Over 18"). Mobile app runs Noir circuit (`circuits/src/main.nr`) locally with private passport data and the on-chain commitment as inputs.
3. **On-chain Submission:** Mobile app sends the generated ZK proof and the proof hash to the Solana program.
4. **Verification & Receipt:** Solana program verifies the proof hash hasn't been used, creates a `ProofReceipt` PDA for replay protection, and increments the verification count on the `Identity` PDA (`programs/minkyc/src/lib.rs`).

**State Management:**
- **On-chain State:** Managed via Solana PDAs (`Identity`, `IdentityCounter`, `ProofReceipt`).
- **Off-chain State:** User's private passport data and secret salts are stored in encrypted local storage on the mobile device (`mobile/App/src/utils/secureStorage.ts`).

## Key Abstractions

**Identity PDA:**
- Purpose: Represents a unique user identity on-chain without storing PII.
- Examples: `programs/minkyc/src/lib.rs` (struct `Identity`).
- Pattern: Program Derived Address (PDA) seeded by owner pubkey and index.

**Proof Receipt:**
- Purpose: Provides replay protection and auditability for verifications.
- Examples: `programs/minkyc/src/lib.rs` (struct `ProofReceipt`).
- Pattern: PDA seeded by the identity address and proof hash.

**ZK Prover:**
- Purpose: Abstracted interface for running Noir circuits.
- Examples: `mobile/App/src/components/ZKProver.tsx`.
- Pattern: WebView-based WASM execution (with SHA-256 fallback for demo).

## Entry Points

**Solana Program:**
- Location: `programs/minkyc/src/lib.rs`
- Triggers: Transaction instructions (`initialize`, `verify_proof`).
- Responsibilities: State management, replay protection, and event emission.

**Mobile Application:**
- Location: `mobile/App/App.tsx`
- Triggers: User interaction.
- Responsibilities: NFC scanning, UI/UX, and coordinating proof generation/submission.

**CLI Tool:**
- Location: `cli/src/index.ts`
- Triggers: Shell commands.
- Responsibilities: Simulation of the full KYC lifecycle.

## Error Handling

**Strategy:** Multi-layer validation from Circuit to Smart Contract.

**Patterns:**
- **Circuit Constraints:** Noir asserts for age and name matching.
- **Anchor Error Codes:** Custom errors in `programs/minkyc/src/lib.rs` (e.g., `IdentityRevoked`, `ProofAlreadyUsed`).

## Cross-Cutting Concerns

**Logging:** Anchor `msg!` macros for on-chain audit logs; console logging for CLI/Mobile.
**Validation:** ZK proof verification (logic in circuits) and SHA-256 commitment matching.
**Authentication:** Solana wallet signing for all on-chain transactions.

---

*Architecture analysis: 2025-05-14*
