# Codebase Structure

**Analysis Date:** 2025-05-14

## Directory Layout

```
MinKYC/
├── circuits/           # Noir Zero-Knowledge circuits
│   ├── src/            # Circuit source code (.nr)
│   └── target/         # Compiled circuit artifacts
├── cli/                # TypeScript CLI simulation tool
│   ├── src/            # CLI source code
│   └── src/commands/   # Command implementations (init, prove, etc.)
├── mobile/             # React Native mobile application
│   └── App/            # Main mobile codebase
│       ├── android/    # Android-specific native code
│       ├── ios/        # iOS-specific native code
│       └── src/        # React Native TypeScript source
├── programs/           # Solana smart contracts (Anchor)
│   └── minkyc/         # Main KYC program
│       └── src/        # Rust source code
├── tests/              # Anchor integration tests
└── website/            # React/Vite informational frontend
```

## Directory Purposes

**circuits/:**
- Purpose: Definitions for ZK verification logic.
- Contains: Noir files and build configurations.
- Key files: `circuits/src/main.nr`

**cli/:**
- Purpose: Simulation tools for identity creation and verification.
- Contains: TypeScript CLI and cryptographic utilities.
- Key files: `cli/src/index.ts`, `cli/src/commands/init.ts`

**mobile/App/src/:**
- Purpose: Mobile app UI and core logic.
- Contains: Components, hooks, and navigation screens.
- Key files: `mobile/App/src/components/ZKProver.tsx`, `mobile/App/src/hooks/useNFC.ts`

**programs/minkyc/src/:**
- Purpose: On-chain logic and state definitions.
- Contains: Anchor program written in Rust.
- Key files: `programs/minkyc/src/lib.rs`

**website/src/:**
- Purpose: Informational frontend and breach tracker.
- Contains: Vite/React application.
- Key files: `website/src/main.tsx`

## Key File Locations

**Entry Points:**
- `programs/minkyc/src/lib.rs`: Solana program entry.
- `mobile/App/index.js`: Mobile app entry.
- `cli/src/index.ts`: CLI entry.
- `website/src/main.tsx`: Website entry.

**Configuration:**
- `Anchor.toml`: Solana program and deployment config.
- `circuits/Nargo.toml`: Noir circuit configuration.
- `mobile/App/package.json`: Mobile app dependencies and scripts.

**Core Logic:**
- `circuits/src/main.nr`: ZK proof logic.
- `mobile/App/src/components/ZKProver.tsx`: ZK proof generation engine.
- `mobile/App/src/hooks/useNFC.ts`: NFC passport reading.

**Testing:**
- `tests/minkyc.ts`: Anchor program integration tests.
- `mobile/App/src/**/__tests__/`: Mobile component and utility tests.

## Naming Conventions

**Files:**
- TypeScript/React: PascalCase for components (`ZKProver.tsx`), camelCase for hooks and utils (`useNFC.ts`).
- Rust: snake_case for modules and files (`lib.rs`).
- Noir: snake_case for files (`main.nr`).

**Directories:**
- Kebab-case or snake_case depending on the project layer (e.g., `mobile/App/src/hooks` vs `programs/minkyc`).

## Where to Add New Code

**New ZK Constraint:**
- Implementation: `circuits/src/main.nr`
- Verification logic: `programs/minkyc/src/lib.rs` (if new commitment structure is needed).

**New Mobile Screen:**
- Implementation: `mobile/App/src/screens/`
- Navigation: `mobile/App/src/screens/HomeScreen.tsx` (usually where navigation is defined).

**New CLI Command:**
- Implementation: `cli/src/commands/`
- Registration: `cli/src/index.ts`

**New Anchor Test:**
- Test file: `tests/minkyc.ts`

## Special Directories

**.planning/:**
- Purpose: Contains codebase maps and implementation plans.
- Generated: No (Created by GSD).
- Committed: Yes.

**circuits/target/:**
- Purpose: Compiled circuit data and proof keys.
- Generated: Yes (by `nargo compile`).
- Committed: No (usually gitignored).

---

*Structure analysis: 2025-05-14*
