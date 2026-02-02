# Development Log

## 2026-02-02 (Update 2)

### Features & Updates
- **Multiple Identity Support**:
  - Refactored `minkyc` smart contract to support multiple identities per authority using an on-chain `IdentityCounter`.
  - Updated PDA derivation to include an incrementing index (seeds: `["identity", owner, index]`).
  - Updated CLI (`init`, `status`, `prove`) to handle indexed identities and metadata tracking in `passport.json`.
- **CLI & UX Enhancements**:
  - Added comprehensive comment headers to all CLI command files (`init.ts`, `prove.ts`, `request.ts`, `status.ts`) explaining purpose and usage.
  - Upgraded `prove` command output to display a "Regulatory-Grade Receipt" with:
    - Transaction Signature.
    - Clickable Solana Explorer Link (Devnet).
    - Clear "VERIFIED" status and Identity PDA.
    - Contextual explanation of the on-chain verification.
- **Documentation**:
  - Overhauled `README.md` with detailed project overview, MVP scope, installation guide, and usage flow.

## 2026-02-02

### Features & Updates
- **Mock Data Engine**: Implemented `cli/src/utils/mockData.ts` to generate ICAO Doc 9303 compliant mock passport data (Data Group 1 fields only, unique per identity).
- **CLI Enhancements**: 
  - Updated `init` command to generate fresh unique passport data for every new identity.
  - Implemented "Identity Reset" flow: `init` now detects existing on-chain identities and automatically closes/resets them before creating a new one.
- **Smart Contract Upgrade**:
  - Added `close` instruction to `minkyc` program to enable account data cleanup and rent reclamation.
  - Redeployed program to Devnet with new Program ID: `DqULmbVsScRQGDtjUJEdptTjLkcPiH1rNCZRVUQc2hDL`.
