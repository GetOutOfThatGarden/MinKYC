# MinKYC Mobile App

React Native mobile app for MinKYC — Privacy-Preserving KYC on Solana.

## 🚀 Current State (March 2026)

The mobile app is functional for MVP demonstrations, featuring:
- **Identity Creation**: Deriving on-chain commitments from passport data.
- **ZK Proof Simulation**: A realistic UX for generating proofs locally.
- **Secure Encrypted Storage**: Identity data is encrypted at rest on the device.
- **Dual-Mode Scanning**: Supports both real NFC ePassport detection and mock profile selection.

## 🛠 Features

- **Secure Identity Storage**: Uses `react-native-encrypted-storage` to keep passport data in the device's secure enclave.
- **NFC Passport Scanning**: Infrastructure ready for ICAO 9303 compliant ePassports via `react-native-nfc-manager` and `@didit-sdk/react-native-nfc-passport-reader`.
- **Proof Generation**: Client-side proof simulation using SHA-256 inside a WebView (`ZKProver.tsx`). This allows for a full end-to-end UX without immediate WASM-related infrastructure hurdles in the prototype.
- **Solana Integration**: Connects to Solana Devnet to create Identity PDAs and submit verification proofs.

## 📂 Project Structure

```
mobile/App/
├── src/
│   ├── components/     # ZKProver (WebView-based simulation)
│   ├── screens/        # Scan, Identity, Verify, Wallet screens
│   ├── utils/          # secureStorage.ts, solana.ts, crypto.ts
│   ├── hooks/          # useNFC.ts, useWallet.tsx
│   └── constants/      # mockProfiles.ts (5 test identities)
├── android/            # Permission & NFC configuration
└── ios/                # iOS-specific code
```

## 🔐 Security Principles

1. **Local Only**: Raw passport data (surname, names, DoB, etc.) **never** leaves the device unencrypted.
2. **On-Chain Commitments**: Only a cryptographic hash (commitment) is stored on Solana.
3. **Selective Disclosure**: Proofs only reveal the result of a condition (e.g., "User is 18+") without exposing the underlying data.

## 🚦 Getting Started

### Prerequisites
- Node.js v18+
- Android Studio / Xcode
- Physical device (recommended for NFC) or Emulator (supports Mock Profiles)

### Setup
```bash
cd mobile/App
npm install

# Android
npx react-native run-android

# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

## 🧪 Testing with Mock Profiles

Since NFC scanning requires a physical device and a real ePassport, the app includes **5 Mock Profiles** (Irish, USA, UK, etc.) in the `Scan` screen. These allow you to:
1. Select a profile to "simulate" a scan.
2. Create an on-chain identity for that profile.
3. Generate a proof and verify it on Solana Devnet.

## 📜 License
MIT
