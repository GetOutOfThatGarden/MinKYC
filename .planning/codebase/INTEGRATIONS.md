# External Integrations

**Analysis Date:** 2025-03-24

## APIs & External Services

**Blockchain:**
- Solana (Devnet) - Main ledger for identity commitments and proof receipts.
  - SDK/Client: `@solana/web3.js` / `@coral-xyz/anchor`
  - Connection: `https://api.devnet.solana.com`

**Zero-Knowledge Proofs:**
- Noir/Barretenberg - ZK-SNARK proving system.
  - Integration: `noir-js` and `backend_barretenberg` (client-side proving)
  - Current state: WASM-based proving simulated via SHA-256 in a `WebView` (`mobile/App/src/components/ZKProver.tsx`) due to bundling constraints.

## Data Storage

**Databases:**
- Solana On-chain Storage - PDAs (Program Derived Addresses) for identity commitments and proof receipts.
  - Implementation: Anchor `#[account]` macros in `programs/minkyc/src/lib.rs`

**File Storage:**
- Local filesystem only - CLI simulation uses JSON files (`user-wallet-2.json`, `test-users.json`) to persist state.

**Caching:**
- None - Direct blockchain and local storage interaction.

**Secure Storage:**
- `react-native-encrypted-storage` - Used in the mobile app to store sensitive salts and private keys.
  - File: `mobile/App/src/utils/secureStorage.ts`

## Authentication & Identity

**Auth Provider:**
- Custom (ePassport based)
  - Implementation: NFC scanning of ICAO 9303 compliant ePassports using BAC (Basic Access Control).
  - Libraries: `react-native-nfc-passport-reader`

## Monitoring & Observability

**Error Tracking:**
- None detected (Console logging only).

**Logs:**
- Standard output / Console logs - Extensive logging in CLI and Mobile app for debugging ZK and NFC flows.

## CI/CD & Deployment

**Hosting:**
- Website: Vite-based SPA (likely target for Vercel/Netlify/Hostinger).
- Program: Solana Devnet.

**CI Pipeline:**
- None detected in root (Standard npm scripts used).

## Environment Configuration

**Required env vars:**
- `AGENT_WALLET_SECRET_KEY` - Used by CLI simulation to sign transactions.
- `ANCHOR_WALLET` - Local path to provider wallet.
- `ANCHOR_PROVIDER_URL` - Optional override for Solana RPC.

**Secrets location:**
- `.env` files (ignored by git).
- Mobile: Secure Keychain/Keystore via `react-native-encrypted-storage`.

## Webhooks & Callbacks

**Incoming:**
- None - The system is primarily a requester/prover model.

**Outgoing:**
- Proof Receipt Submission - Mobile app sends proof receipts to a platform-defined webhook.
  - Implementation: `mobile/App/src/utils/receiptSender.ts`
  - Default mock: `https://mock.socialprofile.xyz/api/verify`

---

*Integration audit: 2025-03-24*
