# Requirements: MinKYC Universal Mobile ZK-KYC

## Goal
To productionize a universal, privacy-first KYC infrastructure that enables on-device identity verification using NFC passports and ZK-proofs, specifically optimized for the global Android ecosystem and Solana.

## Core Pillars

### 1. Robust NFC Ingestion
- **MRZ OCR Scanning**: Implement high-reliability OCR scanning of the Machine Readable Zone (MRZ) to extract BAC/PACE keys automatically.
- **ICAO 9303 Compliance**: Support BAC and PACE protocols for accessing the ePassport chip.
- **Universal Android Support**: Ensure compatibility across a wide range of NFC-enabled Android devices using `@2060.io/react-native-eid-reader`.

### 2. High-Performance Mobile ZK
- **Noir Integration**: Transition from SHA-256 mock fallbacks to production-ready Noir ZK-proofs.
- **WASM Optimization**: Optimize the Noir/Barretenberg WASM bridge for mobile performance (target <10s for proof generation on mid-range devices).
- **Circuit Library**: Implement standard circuits for Age Verification (Over 18), Nationality check, and Residency.

### 3. Privacy & Security (Unlinkability)
- **Nullifiers**: Implement deterministic nullifiers to prevent re-verification while maintaining user anonymity.
- **Proof Binding**: Bind proofs to the transaction caller's pubkey on-chain to prevent mempool proof theft.
- **Data Minimization**: Ensure zero PII (Personally Identifiable Information) leaves the device or is stored on-chain.

### 4. Solana Protocol Integration
- **Anchor Program Upgrade**: Refactor the Anchor program to support Nullifier-based verification and event indexing.
- **Scalability**: Evaluate and implement ZK Compression for low-cost nullifier storage.
- **SDK for Developers**: Provide a clean TypeScript SDK for dApp developers to request and verify proofs.

## Non-Functional Requirements
- **Performance**: Proof generation must not crash the app or exceed 30 seconds.
- **Reliability**: NFC scan success rate target > 95% on compatible hardware.
- **Security**: Mandatory cryptographic audit of Noir circuits and Anchor program.
- **Compliance**: Align with UK DIATF and EU eIDAS 2.0 selective disclosure standards.
