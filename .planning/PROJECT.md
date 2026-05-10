# Project: MinKYC

## Vision
To become the universal, privacy-first compliance layer for the global mobile ecosystem, enabling anyone with an NFC-enabled smartphone and a passport to prove identity constraints without revealing sensitive personal data.

## Objectives
- **Universal Mobile ZK-KYC**: Productionize a high-performance ZK-proof engine that runs locally on any modern Android device.
- **Privacy First**: Eliminate the need for centralized storage of PII (Personally Identifiable Information).
- **Interoperability**: Provide a seamless on-chain verification layer for the Solana ecosystem.

## Stakeholders
- **Users**: Individuals who own their identity and generate ZK-proofs locally.
- **Platforms**: dApps and services that require KYC verification.
- **Regulators**: Entities that need cryptographically verifiable proof that compliance was performed.

## Tech Stack
- **Solana**: Anchor framework for on-chain state and verification.
- **Noir**: Zero-Knowledge circuit language for identity constraints.
- **React Native (Expo)**: Cross-platform mobile framework for the universal identity vault.
- **TypeScript**: Shared language for CLI, Website, and Mobile.
- **Rust**: Language for Solana smart contracts.

## Workflow Preferences
- **Architecture**: Universal Mobile ZK-KYC focus.
- **Mobile**: Transitioning to Expo (Development/Prototype focus).
- **TDD**: Mandatory Test-Driven Development strategy.
- **Safety**: No secrets in repo, mandatory audit before commits.
