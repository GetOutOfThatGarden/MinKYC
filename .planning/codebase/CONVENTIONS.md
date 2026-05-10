# Coding Conventions

**Analysis Date:** 2025-05-14

## Naming Patterns

**Files:**
- TypeScript/React: camelCase for utilities and hooks (`age.ts`, `useNFC.ts`). PascalCase for components (`HomeScreen.tsx`, `AppText.tsx`).
- Test Files: `*.test.ts` or `*.test.tsx` located in `__tests__` directories.
- Solana Programs: snake_case for Rust files (`lib.rs`).

**Functions:**
- camelCase for all TypeScript functions (`calculateAge`, `checkCondition`, `getProvider`).
- snake_case for Rust/Anchor functions (`initialize`, `verify_proof`).

**Variables:**
- camelCase for TypeScript variables and state (`loading`, `userName`, `identityPda`).
- snake_case for Rust variables (`identity`, `proof_hash`).

**Types:**
- PascalCase for TypeScript interfaces and types (`VerificationRequest`, `ActionButtonProps`).
- PascalCase for Rust structs and enums (`Identity`, `ProofReceipt`, `ErrorCode`).

## Code Style

**Formatting:**
- Prettier: Used across the project. Configured to run via `npm run lint:fix` from the root.
- Settings: Uses standard Prettier defaults (documented in `package.json` scripts).

**Linting:**
- ESLint: Used in `mobile/App` and `website`.
- Mobile rules: Extends `@react-native`, but disables some strict rules like `react-native/no-inline-styles` and `prettier/prettier` (likely delegating to the separate prettier pass).

## Import Organization

**Order:**
1. React and React Native core modules.
2. External libraries (e.g., `@solana/web3.js`, `lucide-react-native`).
3. Project-specific components.
4. Hooks, utilities, types, and constants.

**Path Aliases:**
- Relative paths are predominantly used (e.g., `../../App`, `../utils/secureStorage`).

## Error Handling

**Patterns:**
- **TypeScript (CLI/Mobile):** Try-catch blocks are standard, often wrapping high-level actions with UI-specific error reporting (e.g., `spinner.fail` in CLI or console logging in mobile).
- **Rust (Anchor):** Uses `error_code` enums and the `err!` macro for custom program errors (`ErrorCode::IdentityRevoked`).

## Logging

**Framework:** 
- CLI: Uses `ora` for spinners and `chalk` for colored terminal output.
- Mobile: Standard `console.log` and `console.error`.
- Solana: `msg!` macro for program logs visible in the explorer.

## Comments

**When to Comment:**
- File headers often include a description of the module's purpose.
- JSDoc-style comments are used for utility functions and complex command logic.

**JSDoc/TSDoc:**
- Used for exported utility functions and interfaces to provide context for parameters and behavior.

## Function Design

**Size:** Functions are generally small and focused (e.g., `calculateAge`, `formatAddress`).
**Parameters:** Usually passed as individual arguments for utilities, and as Props objects for React components.
**Return Values:** Consistent use of TypeScript types for return values.

## Module Design

**Exports:** 
- Named exports are preferred for utilities and types.
- Default exports are used for main Screen components in the mobile app.

**Barrel Files:** 
- Not widely used; imports usually point directly to files.

---

*Convention analysis: 2025-05-14*
