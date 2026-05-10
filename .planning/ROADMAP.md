# Roadmap: MinKYC Universal Mobile ZK-KYC

## Milestone 1: Productionize Universal Mobile ZK-KYC

### Phase 1: Robust Ingestion & Foundation
**Goal:** Transition to a universal Expo app with high-reliability MRZ OCR and NFC scanning foundation.

**Plans:** 4 plans
- [ ] 01-01-PLAN.md — Universal Expo & NFC Foundation
- [ ] 01-02-PLAN.md — MRZ OCR Scanning Implementation
- [ ] 01-03-PLAN.md — High-Reliability NFC Ingestion
- [ ] 01-04-PLAN.md — Testing & Quality Assurance

**Requirements:**
- **P1.1 [Arch]**: Initialize Expo project with Development Builds and custom Config Plugins for NFC.
- **P1.2 [Mobile]**: Implement MRZ OCR scanning using `react-native-vision-camera`.
- **P1.3 [Mobile]**: Integrate `@2060.io/react-native-eid-reader` for high-reliability NFC passport reading.
- **P1.4 [Testing]**: Create automated E2E tests for the scanning flow using mock profiles.

### Phase 2: The Universal ZK-Engine
- **P2.1 [ZK]**: Port existing Noir circuits to the latest version and optimize for mobile WASM.
- **P2.2 [Mobile]**: Solve the WASM bundling bottleneck in React Native/Expo.
- **P2.3 [ZK]**: Implement "Nullifier" logic in the Noir circuits for unlinkable verification.
- **P2.4 [Testing]**: Benchmark proof generation latency across different Android device tiers.

### Phase 3: Solana Privacy Layer
- **P3.1 [Backend]**: Upgrade Anchor program to support Nullifier-based verification and Proof Binding.
- **P3.2 [Backend]**: Implement on-chain CSCA (Country Signing Certificate Authority) certificate registry (MVP).
- **P3.3 [Testing]**: Integrate on-chain verification tests into the CI/CD pipeline.

### Phase 4: Developer SDK & Compliance
- **P4.1 [Arch]**: Build a unified TypeScript SDK for dApp integration.
- **P4.2 [Frontend]**: Update the MinKYC website with a developer dashboard and SDK documentation.
- **P4.3 [Verification]**: Conduct a self-audit against UK DIATF and EU eIDAS 2.0 standards.
- **P4.4 [Verification]**: Final E2E "Ship & Show" demo on a standard Android phone.

## Future Milestones
- **Milestone 2**: ZK Compression for hyper-scale compliance.
- **Milestone 3**: Integration with Decentralized Identity (DID) standards and Verifiable Credentials (VCs).
