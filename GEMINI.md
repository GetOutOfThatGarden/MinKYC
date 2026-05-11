# MinKYC — Privacy-Preserving KYC on Solana

MinKYC is a privacy-first compliance layer built for the Solana ecosystem (specifically optimized for the Solana Seeker). it enables dApps to verify user constraints (e.g., Age > 18, Nationality) using on-device NFC passport scanning and Zero-Knowledge (ZK) proofs, eliminating the need to store toxic Personally Identifiable Information (PII) on centralized servers.

## 🏗 Project Architecture

The project is organized into several decoupled components:

- **Solana Program (`/programs/minkyc`)**: An Anchor-based smart contract that stores identity commitments (hashes) and proof receipts to provide replay protection.
- **Noir Circuits (`/circuits`)**: Zero-Knowledge circuits written in Noir that define the logic for proving identity constraints without revealing raw data.
- **Mobile App (`/mobile/App`)**: A React Native (Expo/Bare) application for the Solana Seeker that handles NFC ePassport scanning and local ZK proof generation.
- **CLI Tooling (`/cli`)**: A TypeScript-based CLI for simulating the full lifecycle: Identity creation (User), Verification request (Platform), and Compliance auditing (Regulator).
- **Website (`/website`)**: A Vite/React frontend showcasing an OSINT Intelligence Feed and breach tracker.

## 🚀 Key Commands

### Root Project (CLI & Anchor)
- **Install Dependencies**: `npm install`
- **Build Solana Program**: `anchor build`
- **Deploy to Devnet**: `anchor deploy`
- **Run CLI Simulation**:
    - User (Init): `./user.sh init`
    - Platform (Request): `./platform.sh verify --over-18`
    - Regulator (Check): `./regulator.sh check`

### Mobile App (`/mobile/App`)
- **Install Dependencies**: `npm install`
- **Start Metro Bundler**: `npm start`
- **Run on Android**: `npm run android`
- **Run on iOS**: `npm run ios`
- **Run Tests**: `npm test`

### Website (`/website`)
- **Install Dependencies**: `npm install`
- **Development Mode**: `npm run dev`
- **Build**: `npm run build`

## 🛠 Development Conventions

### Identity & Privacy
- **Commitments**: Only SHA-256 hashes of passport data + secret salts are stored on-chain.
- **Replay Protection**: Every verification creates a `ProofReceipt` PDA on Solana seeded by the proof hash, ensuring a single proof cannot be reused.
- **PDAs**: 
    - Identity: `["identity", owner_pubkey, index]`
    - Counter: `["identity_counter", owner_pubkey]`
    - Receipt: `["proof_receipt", identity_pda, proof_hash]`

### Testing (TDD)
- All new features should be accompanied by tests.
- **Anchor Tests**: Located in `/tests/minkyc.ts`. Run with `anchor test`.
- **Mobile Tests**: Located in `/mobile/App/src/**/__tests__`. Run with `npm test` in the mobile directory.
- **CLI Tests**: Mocked data and fixtures are found in `/cli/src/fixtures`.

### Coding Standards
- **TypeScript**: Used for CLI, Mobile, and Website.
- **Rust**: Used for Solana Programs.
- **Noir**: Used for ZK Circuits.
- **Formatting**: Use `npm run lint:fix` from the root to format the codebase using Prettier.

## 📂 Directory Map (Highlights)

- `/programs/minkyc/src/lib.rs`: Main Solana program logic.
- `/circuits/src/main.nr`: Main ZK circuit logic.
- `/mobile/App/src/components/ZKProver.tsx`: WebView-based ZK proof engine for mobile.
- `/mobile/App/src/hooks/useNFC.ts`: NFC passport reading logic.
- `/cli/src/commands/`: CLI command implementations for the simulation.
- `/cli/src/utils/crypto.ts`: Cryptographic primitives for the CLI.

## ⚠️ Important Notes
- The current mobile ZK engine in `ZKProver.tsx` uses a SHA-256 fallback for proof generation in the MVP demo due to WASM bundling complexities in React Native.
- Ensure your Solana CLI is configured to `devnet` for the CLI simulation scripts to work correctly.

---

## 🔐 Secrets & Configuration
Environment variables (.env) are **NOT** stored in Git. They are securely backed up in the **Apple Keychain**.

### To Restore Secrets:
If the `.env` file is missing, run:
```bash
python3 ~/Developer/env-keychain.py pull
```
Refer to [~/Developer/SECRETS.md](../SECRETS.md) for full security protocols.
