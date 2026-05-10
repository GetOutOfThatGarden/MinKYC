# Codebase Concerns

**Analysis Date:** 2025-01-24

## Tech Debt

**Mocked ZK Proof Generation (Mobile):**
- Issue: The mobile app uses a SHA-256 fallback for "proof" generation instead of actual Noir ZK proofs due to WASM bundling complexities in React Native.
- Files: `mobile/App/src/components/ZKProver.tsx`
- Impact: No actual zero-knowledge properties are enforced in the demo. The proof is just a deterministic hash.
- Fix approach: Properly bundle Barretenberg and Noir WASM binaries as local assets and use the real Noir execution engine.

**Mocked ZK Verification (Solana):**
- Issue: The `verify_proof` function in the Solana program only checks if the proof hash is non-zero; it does not perform cryptographic verification of a ZK proof.
- Files: `programs/minkyc/src/lib.rs`
- Impact: The system is insecure; any non-zero 32-byte value is accepted as a valid proof.
- Fix approach: Integrate a Noir/Barretenberg verifier (e.g., via a generated Solidity/Rust verifier or a common ZK verifier program) into the Anchor program.

**Weak Commitment Hashing:**
- Issue: The mobile app uses a non-cryptographic 32-bit additive hash for computing identity commitments.
- Files: `mobile/App/src/utils/secureStorage.ts`
- Impact: Extremely vulnerable to collisions and brute-force attacks. Identity binding can be easily broken.
- Fix approach: Implement a robust cryptographic hash like SHA-256 or Poseidon that matches the Noir circuit's commitment logic.

**Inconsistent Identity PDA Derivation:**
- Issue: The mobile app's PDA derivation for "identity" does not match the Solana program's requirements (missing the `index` seed).
- Files: `mobile/App/src/utils/solana.ts`, `programs/minkyc/src/lib.rs`
- Impact: The mobile app cannot correctly locate identity accounts on-chain.
- Fix approach: Sync the PDA derivation logic in `solana.ts` with the Anchor seeds in `lib.rs`, including fetching the `IdentityCounter` to get the correct index.

**Missing Blockchain Interaction in Mobile:**
- Issue: The mobile app generates "receipts" locally but never submits them to the Solana blockchain.
- Files: `mobile/App/src/components/VerificationExecutor.tsx`, `mobile/App/src/utils/receiptGenerator.ts`
- Impact: Verification events are not recorded on-chain, and replay protection (via `ProofReceipt` PDAs) is not utilized.
- Fix approach: Implement a `verify` transaction in the mobile app using `@solana/web3.js` or `@coral-xyz/anchor`.

## Security Considerations

**PII Exposure (Toxic PII):**
- Area: Passport Data Storage
- Risk: Storing full passport data (names, DOB, nationality) in `EncryptedStorage` makes the device a high-value target for PII theft if the app or device is compromised.
- Files: `mobile/App/src/utils/secureStorage.ts`
- Current mitigation: Uses `react-native-encrypted-storage` which utilizes Keychain (iOS) and Keystore (Android).
- Recommendations: Minimize stored PII. Only store the minimum necessary fields and ensure salts/secrets are generated using a cryptographically secure RNG.

**Weak ZK Circuit Logic:**
- Area: Noir Circuits
- Risk: The circuit uses a simple sum for commitments (`dob + name_hash + secret`) and returns booleans rather than asserting conditions.
- Files: `circuits/src/main.nr`
- Current mitigation: None (Prototype logic only).
- Recommendations: Use a cryptographic hash (Poseidon) for commitments and use `assert()` in Noir to ensure the proof is invalid if constraints are not met.

## Performance Bottlenecks

**On-chain Receipt Rent:**
- Problem: Every verification creates a new `ProofReceipt` PDA (approx 150 bytes).
- Files: `programs/minkyc/src/lib.rs`
- Cause: Replay protection strategy requires unique accounts per proof hash.
- Improvement path: Consider using a more efficient replay protection mechanism, or have the platform/verifier pay for the rent and allow users to reclaim it after a certain period.

## Fragile Areas

**NFC Reading State Management:**
- Files: `mobile/App/src/hooks/useNFC.ts`
- Why fragile: Conflicts between `NfcManager` and specialized `NfcPassportReader` require manual stopping/starting of services, which can lead to race conditions or "NFC stuck" states.
- Safe modification: Ensure robust cleanup in `useEffect` and handle "already running" errors gracefully.

## Test Coverage Gaps

**Solana Program Integration Tests:**
- What's not tested: Complex scenarios like identity revocation, multiple identities per owner, and edge cases in replay protection.
- Files: `tests/minkyc.ts`
- Risk: Critical logic bugs in the identity management layer could go unnoticed.
- Priority: High

**End-to-End Mobile Flow:**
- What's not tested: The full integration from NFC scan -> Local ZK proof -> On-chain verification.
- Files: N/A (Missing automated E2E tests)
- Risk: Regressions in the complex interaction between mobile hardware, WASM, and blockchain.
- Priority: Medium

---

*Concerns audit: 2025-01-24*
