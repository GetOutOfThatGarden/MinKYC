# Development Log

## 2026-02-02

### Features & Updates
- **Mock Data Engine**: Implemented `cli/src/utils/mockData.ts` to generate ICAO Doc 9303 compliant mock passport data (Data Group 1 fields only, unique per identity).
- **CLI Enhancements**: 
  - Updated `init` command to generate fresh unique passport data for every new identity.
  - Implemented "Identity Reset" flow: `init` now detects existing on-chain identities and automatically closes/resets them before creating a new one.
- **Smart Contract Upgrade**:
  - Added `close` instruction to `minkyc` program to enable account data cleanup and rent reclamation.
  - Redeployed program to Devnet with new Program ID: `DqULmbVsScRQGDtjUJEdptTjLkcPiH1rNCZRVUQc2hDL`.
