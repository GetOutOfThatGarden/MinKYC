# Technology Stack

**Analysis Date:** 2025-03-24

## Languages

**Primary:**
- TypeScript 5.7+ - CLI, Mobile App (React Native), Website (Vite/React)
- Rust (Edition 2021) - Solana Smart Program (`/programs/minkyc`)

**Secondary:**
- Noir (>=0.31.0) - ZK Circuits (`/circuits`)
- HTML/CSS - Website and Mobile WebView

## Runtime

**Environment:**
- Node.js (>=16) - Development environment, CLI, and Website build
- React Native (0.72.6) - Mobile execution environment

**Package Manager:**
- npm - Multi-workspace management (root, mobile, website)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 18/19 - UI framework for Mobile and Website
- React Native 0.72.6 - Cross-platform mobile development
- Anchor 0.31.1 - Solana program development framework
- Vite 7.3 - Website build tool and dev server

**Testing:**
- Mocha/Chai - Anchor program tests (`/tests/minkyc.ts`)
- Jest - Mobile app unit and component tests (`/mobile/App/src/**/__tests__`)
- React Testing Library - Mobile component testing

**Build/Dev:**
- Anchor CLI - Solana program compilation and deployment
- Nargo - Noir circuit compilation and testing
- Metro - React Native bundler
- Tailwind CSS 4.2 - Website styling

## Key Dependencies

**Critical:**
- `@solana/web3.js` (^1.98.4) - Solana blockchain interaction
- `@coral-xyz/anchor` (^0.31.1) - Anchor client for Solana
- `react-native-nfc-manager` (^3.14.8) - Low-level NFC interaction
- `react-native-nfc-passport-reader` (^0.2.5) - ePassport specific reading and BAC authentication
- `@noir-lang/noir_js` (^1.0.0-beta.19) - Noir ZK proof interaction (client-side)

**Infrastructure:**
- `react-native-webview` (^13.6.2) - Used as a fallback execution environment for ZK proof generation
- `react-native-encrypted-storage` (^4.0.3) - Secure storage for user secrets and keys
- `commander` / `ora` / `chalk` - CLI simulation tooling

## Configuration

**Environment:**
- `.env` files (referenced in `dotenv`)
- `AGENT_WALLET_SECRET_KEY` - Base64 encoded Solana secret key for CLI operations
- `ANCHOR_WALLET` - Path to local Solana wallet JSON

**Build:**
- `Anchor.toml` - Solana program configuration
- `tsconfig.json` - TypeScript configuration (multiple instances)
- `Nargo.toml` - Noir circuit configuration
- `package.json` - Dependency management for root, mobile, and website

## Platform Requirements

**Development:**
- Solana CLI Tools
- Anchor CLI
- Noir (Nargo) CLI
- Node.js & npm
- Android SDK / Xcode for mobile development

**Production:**
- Solana Devnet/Mainnet
- Android (optimized for Solana Seeker) / iOS

---

*Stack analysis: 2025-03-24*
