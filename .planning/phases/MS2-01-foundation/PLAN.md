# Phase 1: Compression Foundation & Infrastructure (Milestone 2)

## Objective
Establish the technical foundation for ZK Compression in MinKYC using Light Protocol V3.

## Strategy
We will transition the MinKYC infrastructure from standard Solana accounts to a compressed state model. This begins with setting up the Light Protocol development environment (`light-cli`, Photon RPC) and refactoring our Anchor program to integrate the `light-sdk`. We will then implement the initial Merkle Tree architecture to hold our compressed nullifiers, verifying the foundation with automated tests.

## Cluster Wave Execution

### Wave 1: Infrastructure & Dependencies
- **[A] Architecture (MS2-01-01)**: Install Light Protocol tooling and configure dependencies in `Cargo.toml`.

### Wave 2: Compressed State Architecture
- **[B] Backend (MS2-01-02)**: Refactor Anchor program to initialize Merkle Trees and define `CompressedNullifier` accounts.

### Wave 3: Testing & Validation
- **[T] Testing (MS2-01-02)**: Implement TDD suites using `light-test-utils` for compressed state transitions.

## Progress Tracking
- [x] MS2-01-01: Light Protocol Environment & Dependencies
- [x] MS2-01-02: Merkle Tree Init & Compressed Account Definitions

## Success Criteria
- [x] `light-cli` is configured and able to connect to a local/testnet Photon RPC.
- [x] Anchor program successfully compiles with `light-sdk` integration.
- [x] Automated tests verify successful initialization of a compressed state Merkle tree.
