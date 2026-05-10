# Roadmap: MinKYC Universal Mobile ZK-KYC

## Milestone 1: Productionize Universal Mobile ZK-KYC

### Phase 1: Robust Ingestion & Foundation
**Goal:** Transition to a universal Expo app with high-reliability MRZ OCR and NFC scanning foundation.

**Plans:** 4 plans
- [x] 01-01-PLAN.md — Universal Expo & NFC Foundation
- [x] 01-02-PLAN.md — MRZ OCR Scanning Implementation
- [x] 01-03-PLAN.md — High-Reliability NFC Ingestion
- [x] 01-04-PLAN.md — Testing & Quality Assurance

### Phase 1: Robust Ingestion & Foundation [COMPLETED]
- **P1.1 [Arch]**: Initialize Expo project with Development Builds and custom Config Plugins for NFC. [DONE]
- **P1.2 [Mobile]**: Implement MRZ OCR scanning using `react-native-vision-camera`. [DONE]
- **P1.3 [Mobile]**: Integrate `@2060.io/react-native-eid-reader` for high-reliability NFC passport reading. [DONE]
- **P1.4 [Testing]**: Create automated E2E tests for the scanning flow using mock profiles. [DONE]

### Phase 2: The Universal ZK-Engine
**Goal:** Transition from mock SHA-256 proofs to real Noir ZK-proofs running on-device in the universal Expo app.

**Plans:** 3 plans
- [x] 02-01-PLAN.md — Circuit Porting & Nullifier Logic
- [x] 02-02-PLAN.md — WASM Bundling & Prover Implementation
- [x] 02-03-PLAN.md — Performance Benchmarking

### Phase 2: The Universal ZK-Engine [COMPLETED]
- **P2.1 [ZK]**: Port existing Noir circuits to the latest version and optimize for mobile WASM. [DONE]
- **P2.2 [Mobile]**: Solve the WASM bundling bottleneck in React Native/Expo. [DONE]
- **P2.3 [ZK]**: Implement "Nullifier" logic in the Noir circuits for unlinkable verification. [DONE]
- **P2.4 [Testing]**: Benchmark proof generation latency across different Android device tiers. [DONE]

### Phase 3: Solana Privacy Layer
**Goal:** Upgrade the Anchor program to support Nullifier-based verification and Proof Binding.

**Plans:** 3 plans
- [x] 03-01-PLAN.md — Anchor Privacy Upgrades
- [x] 03-02-PLAN.md — Mobile Verification Bridge
- [x] 03-03-PLAN.md — Security & Replay Tests

### Phase 3: Solana Privacy Layer [COMPLETED]
- **P3.1 [Backend]**: Upgrade Anchor program to support Nullifier-based verification and Proof Binding. [DONE]
- **P3.2 [Backend]**: Implement on-chain CSCA (Country Signing Certificate Authority) certificate registry (MVP). [DONE]
- **P3.3 [Testing]**: Integrate on-chain verification tests into the CI/CD pipeline. [DONE]

### Phase 4: Developer SDK & Compliance
**Goal:** Build a unified TypeScript SDK for dApp integration and conduct a regulatory compliance self-audit.

**Plans:** 3 plans
- [ ] 04-01-PLAN.md — @minkyc/sdk Foundation & Core
- [ ] 04-02-PLAN.md — React Integration & Dev Dashboard
- [ ] 04-03-PLAN.md — Compliance Audit & Final Demo

### Phase 4: Developer SDK & Compliance [IN PROGRESS]
- **P4.1 [Arch]**: Build a unified TypeScript SDK for dApp integration.
- **P4.2 [Frontend]**: Update the MinKYC website with a developer dashboard and SDK documentation.
- **P4.3 [Verification]**: Conduct a self-audit against UK DIATF and EU eIDAS 2.0 standards.
- **P4.4 [Verification]**: Final E2E "Ship & Show" demo on a standard Android phone.

## Future Milestones
- **Milestone 2**: ZK Compression for hyper-scale compliance.
- **Milestone 3**: Integration with Decentralized Identity (DID) standards and Verifiable Credentials (VCs).
