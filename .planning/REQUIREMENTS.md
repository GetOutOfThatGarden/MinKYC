# Requirements: Milestone 2 — Hyper-Scale ZK Compression

## Goal
Implement ZK Compression for MinKYC using Light Protocol V3 to reduce on-chain storage costs by >99%, enabling hyper-scale KYC verification on Solana.

## Core Pillars

### 1. Compressed Nullifier Storage
- **Address-based Nullifiers**: Derive Compressed PDA addresses from the `nullifier_hash` using Poseidon hashing.
- **Light System Program Integration**: Utilize the `LightSystemProgram` to manage state transitions and enforce nullifier uniqueness.
- **Rent Reduction**: Target a storage cost of <0.5 SOL per 1 million nullifiers.

### 2. High-Performance Client Integration
- **Photon RPC Integration**: Update the mobile app and SDK to retrieve Merkle inclusion proofs via Photon.
- **Stateless JS SDK**: Integrate `@lightprotocol/stateless.js` for managing compressed state transitions on the client side.
- **Proof Retrieval**: Target <2s for Merkle proof retrieval from the indexer.

### 3. Anchor Program Refactoring
- **Light SDK Integration**: Refactor the `minkyc` program using `light-sdk` and `#[light_account]` macros.
- **Validity Proof Verification**: Implement on-chain verification of ZK-SNARK validity proofs for compressed state updates.
- **Backward Compatibility**: Maintain the ability to verify Milestone 1 (standard PDA) identities during the transition period.

### 4. Infrastructure & Testing
- **Photon Indexer Deployment**: Set up a development environment using a Photon-enabled RPC (Helius).
- **Compression Benchmarking**: Quantify SOL savings and Compute Unit (CU) usage compared to standard PDAs.
- **Light Test Utils**: Implement automated tests using `light-test-utils` and the `light-cli` local validator.

## Non-Functional Requirements
- **Scalability**: Support up to 10 million KYC nullifiers per Merkle tree.
- **Security**: Zero-knowledge validity proofs must be verified for every state transition.
- **Latency**: End-to-end verification (Proof retrieval + Submission) should not exceed 10 seconds.
