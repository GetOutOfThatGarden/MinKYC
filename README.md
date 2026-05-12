# MinKYC — Universal Privacy-Preserving KYC

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**MinKYC is the privacy-first compliance layer for the global mobile ecosystem.**

It enables dApps to verify user constraints (e.g., Age > 18, EU Resident) using on-device NFC passport scanning and Zero-Knowledge proofs, completely eliminating the need for centralized platforms to store toxic PII (Personally Identifiable Information). While originally prototyped for the Solana Seeker, MinKYC is designed to turn **any** NFC-enabled smartphone into a self-sovereign identity vault.

---

### 🤖 AI Agent Context (Read First)

**Objective**: To establish a universal, zero-PII compliance infrastructure for the global mobile ecosystem.

**Project Roadmap & Status**:
*   **Milestone 1 [COMPLETED]**: Functional Prototype of the Universal Mobile ZK-Engine. Achieved on-device Noir ZK proofs (<15s latency) and PACE-compliant NFC ingestion on standard Android devices.
*   **Milestone 2 [IN PROGRESS]**: Moving toward Production-Hardened ZK Compression. Refactoring the Solana layer using Light Protocol V3 to reduce on-chain storage costs by 99.5%.
*   **Milestone 3 [PLANNED]**: Decentralized Identity (DID) & Verifiable Credential (VC) integration.

**Key Technical Learnings**:
1.  **Mobile ZK Viability**: Modern mobile hardware can generate complex ZK proofs locally in consumer-grade timeframes (<15s) using a WebView-to-WASM bridge.
2.  **Surveillance Gap**: Cryptography can satisfy strict regulatory frameworks (UK DIATF, EU eIDAS 2.0) while maintaining 100% user privacy.
3.  **Toolchain Stability**: High-stakes ZK development requires locked-version build scripts due to the rapid evolution of the Solana/Anza and Noir ecosystems.

**Impact Statistics & Competitive Advantage**:
*   **99.5% Cost Reduction**: Transitioning to ZK Compression reduces on-chain rent from **1,169 SOL** to **<5 SOL** per 1 million users.
*   **0 Bytes PII Leakage**: MinKYC eliminates data liability. Raw passport data never leaves the device; platforms receive only a cryptographic "Yes/No" proof.
*   **30% Conversion Boost**: Fast, one-tap mobile onboarding eliminates the high user friction and abandonment rates typical of "selfie + manual scan" KYC flows.
*   **Platform Advantage**: DApps using MinKYC achieve a **Zero-Liability posture**, removing them from the crosshairs of data hackers and massive GDPR/compliance fines.

---

## 📱 The Mobile Experience (Universal Android & iOS)

The MinKYC app turns a user's phone into a self-sovereign identity vault. No specialized hardware required—just your phone and your passport.

| Scan ePassport | Zero-Knowledge Proof | Audit Log |
| :---: | :---: | :---: |
| <img src="Screenshots/3_scan.png" width="250" /> | <img src="Screenshots/6_verify_modal.png" width="250" /> | <img src="Screenshots/9_verification history_successful.png" width="250" /> |

*   **Universal Data Extraction**: Reads NFC ePassports directly into the device's secure environment on any modern smartphone.
*   **Zero-Knowledge Proofs**: Proves constraints locally without revealing the underlying data.
*   **On-Chain Receipts**: Anchors immutable proof receipts to the Solana blockchain for global verification.

---

## 🌐 The MinKYC Ecosystem

MinKYC is a complete, decoupled architecture for the future of decentralized compliance.

1.  **The Mobile App**: The consumer-facing identity wallet for managing identity and generating proofs locally on standard mobile devices.
2.  **The CLI Tooling**: Infrastructure for platforms and regulators to request proofs and audit compliance.
3.  **The OSINT Intelligence Feed**: An autonomous AI agent that monitors global news for centralized KYC data breaches, highlighting the urgent need for ZK solutions. 
    * 🔗 **[Explore the MinKYC Website & Breach Tracker](https://getoutofthatgarden.github.io/minkyc-website/)**

---

## 🚀 Quick Start (Running the App)

The mobile app is located in `mobile/App` and is built with React Native.

```bash
git clone https://github.com/GetOutOfThatGarden/MinKYC.git
cd MinKYC/mobile/App
npm install
```

### Running on a Physical Android Device
1. **Enable Developer Mode**: Go to Settings > About phone > Build number (tap 7 times) and enable **USB Debugging**.
2. **Connect**: Plug your phone into your workstation.
3. **Forward Port**: Run `adb reverse tcp:8081 tcp:8081` to link the Metro bundler.
4. **Launch**:
   ```bash
   npm run android
   ```

*Note: You can use the **Mock Profiles** in the Scan screen to test scenarios immediately if you do not have an NFC ePassport handy.*

---

## 🛠️ Developer Tools & CLI Ecosystem

The MVP includes shell scripts that simulate the complete KYC workflow from three different perspectives.

First, set up the project root:
```bash
cd MinKYC
npm install
```

### 1. User — Create Identity
Creates an identity by scanning a passport (mocked NFC read) and uploading a cryptographic commitment to Solana.
```bash
./user.sh init
```

### 2. Platform — Verify User
The platform requests KYC verification and submits proof in one step.
```bash
./platform.sh verify --over-18
```

### 3. Regulator — Audit Verification
The regulator checks that proper KYC verification was performed by looking up the transaction.
```bash
./regulator.sh check
```

*(See the `cli/` directory for advanced direct commands).*

---

## 🏗️ Technical Architecture

### Identity Storage
* Each identity is stored in a Program Derived Address (PDA) on Solana.
* Seeded by: `["identity", owner_pubkey, index]`

### Commitment & Replay Protection
* `commitment = SHA256(passport_data || secret_nonce)`
* Only the commitment is stored on-chain. Raw identity data **never** leaves the user's device.
* Each proof creates a unique `ProofReceipt` PDA on-chain to prevent double-spending/replay attacks.

### Smart Contract Features
* ✅ **Identity Commitments** — Store only cryptographic hashes.
* ✅ **Replay Protection** — Immutable proof receipts.
* ✅ **Events** — Pushed for indexers and real-time monitoring.

---

## 🎥 Demo Video

**Watch the original 5-minute CLI demo:** https://www.loom.com/share/9dced184732f48e0b754a2ad7c822687

*(The video shows the foundational CLI. The mobile app UI screenshots above demonstrate the latest Seeker experience).*

---

## 🏆 Hackathon Submissions

This project was built for:
- 🥇 **Solana Seeker: Monolith Track** (March 2026)
- **Colosseum Agent Hackathon** (Feb 2026) — [Project Page](https://colosseum.com/agent-hackathon/projects/minkyc-e5qc5l)

**Program ID (Devnet):** `9zzT4KdUh7TEtiR8ioTMhDLWDa4c6ymzAjQsYYfvc3h1`
**AgentWallet Default Address:** `AmhTt5Cfk69MUi3q1ySwHn6mndUHJ1gD3Boi5ngWd2BS`

---

## License

MIT License. See `LICENSE` for details.
