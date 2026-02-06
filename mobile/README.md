# MinKYC Mobile App

React Native mobile app for MinKYC — Privacy-Preserving KYC on Solana.

## Features

- **Secure Identity Storage**: Identity data stored in device secure enclave
- **NFC Passport Scanning**: Read ICAO 9303 compliant ePassports (iOS/Android)
- **Proof Generation**: Client-side ZK proof generation
- **Solana Integration**: Connect to Phantom/Solflare wallets

## Project Structure

```
mobile/
├── App/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # App screens
│   │   ├── utils/          # Crypto, Solana helpers
│   │   ├── hooks/          # Custom React hooks
│   │   └── services/       # NFC, Wallet, Storage services
│   ├── android/            # Android-specific code
│   └── ios/                # iOS-specific code
└── README.md
```

## Prerequisites

- React Native 0.72+
- Solana Mobile Stack SDK (for Saga/dApp Store)
- NFC capabilities (for passport scanning)

## Setup

```bash
cd mobile/App
npm install
# or
yarn install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## NFC Passport Scanning

The app uses the following libraries for NFC passport reading:
- **iOS**: `CoreNFC` framework
- **Android**: `android.nfc` package

Supported passport chips following ICAO 9303 standards.

## Security

- Private keys stored in iOS Keychain / Android Keystore
- Identity data encrypted at rest
- No sensitive data transmitted to servers

## Hackathon Notes

This is a scaffold for the Solana Mobile Hackathon. Key integration points:

1. **Wallet Adapter**: Connect to Phantom/Solflare Mobile
2. **NFC Module**: Read passport data from chip
3. **ZK Proof**: Generate proofs locally (replace mock with Noir circuits)
4. **Transaction**: Submit verification to Solana Devnet/Mainnet

## License
MIT
