# Roadmap: MinKYC Hyper-Scale Compliance

## Milestone 1: Productionize Universal Mobile ZK-KYC [COMPLETED]
- **Phase 1**: Robust Ingestion & Foundation [DONE]
- **Phase 2**: The Universal ZK-Engine [DONE]
- **Phase 3**: Solana Privacy Layer [DONE]
- **Phase 4**: Developer SDK & Compliance [DONE]

## Milestone 2: ZK Compression for Hyper-Scale

### Phase 1: Compression Foundation & Infrastructure [COMPLETED]
**Goal:** Lay the technical foundation for ZK Compression using Light Protocol V3.

**Plans:** 2 plans
- [x] MS2-01-01-PLAN.md — Infrastructure & Dependency Integration [DONE]
- [x] MS2-01-02-PLAN.md — On-Chain Compression Foundation & TDD [DONE]

**Requirements:**
- **P2.1.1 [Arch]**: Set up Light Protocol development environment (Photon RPC + `light-cli`). [DONE]
- **P2.1.2 [Backend]**: Refactor Anchor program to use `light-sdk` and initialize compressed state Merkle trees. [DONE]
- **P2.1.3 [Testing]**: Implement automated tests for basic compressed account creation. [DONE]

### Phase 2: Compressed Nullifier Logic
- **P2.2.1 [Backend]**: Implement address-based nullifiers derived from Poseidon hashes.
- **P2.2.2 [Backend]**: Upgrade `verify_proof` to check and spend compressed nullifiers.
- **P2.2.3 [ZK]**: Update Noir circuits to return Poseidon-compatible nullifiers for on-chain address derivation.

### Phase 3: Mobile & SDK Compression Bridge
- **P2.3.1 [Arch]**: Integrate `@lightprotocol/stateless.js` into the SDK and mobile app.
- **P2.3.2 [Mobile]**: Implement Merkle inclusion proof retrieval from Photon indexers.
- **P2.3.3 [SDK]**: Update `useMinKYC` hook to support compressed verification flows.

### Phase 4: Benchmarking & Finalization
- **P2.4.1 [Verification]**: Conduct hyper-scale benchmarking (simulate 1M nullifiers).
- **P2.4.2 [Verification]**: Verify SOL rent savings and Compute Unit optimization.
- **P2.4.3 [Verification]**: Final E2E "Ship & Show" of the compressed protocol at the Forma Residency.

## Future Milestones
- **Milestone 3**: Integration with Decentralized Identity (DID) standards and Verifiable Credentials (VCs).
