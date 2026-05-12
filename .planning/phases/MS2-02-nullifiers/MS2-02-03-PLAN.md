---
phase: MS2-02
plan: 03
type: execute
wave: 2
depends_on: [MS2-02-01, MS2-02-02]
files_modified: [programs/minkyc/src/lib.rs, tests/compression.ts]
autonomous: false
requirements: [P2.2.2]
must_haves:
  truths:
    - "verify_proof instruction checks for nullifier existence in compressed state"
    - "verify_proof instruction creates a compressed nullifier account upon successful verification"
    - "Double-spend attempts with the same nullifier are rejected"
  artifacts:
    - path: "programs/minkyc/src/lib.rs"
      provides: "Upgraded verify_proof with compression support"
    - path: "tests/compression.ts"
      provides: "TDD suite for compressed nullifiers"
  key_links:
    - from: "programs/minkyc/src/lib.rs"
      to: "Light System Program"
      via: "CPI for nullifier creation"
---

<objective>
Upgrade the verify_proof instruction to enforce nullifier uniqueness using ZK Compression.

Purpose: Prevent replay attacks at hyper-scale by "spending" nullifiers in the compressed state.
Output: Upgraded program and TDD test suite.
</objective>

<execution_context>
@/Users/user2/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/user2/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/research/LIGHT_PROTOCOL_INTEGRATION.md
@programs/minkyc/src/lib.rs
@.planning/phases/MS2-02-nullifiers/MS2-02-01-SUMMARY.md
@.planning/phases/MS2-02-nullifiers/MS2-02-02-SUMMARY.md
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Refactor verify_proof to use Light Protocol CPI</name>
  <files>programs/minkyc/src/lib.rs</files>
  <behavior>
    - The `verify_proof` instruction must accept `ValidityProof` and `PackedAddressTreeInfo` from the Light SDK.
    - It must derive the nullifier address on-chain using the Poseidon utility from Plan 02.
    - It must perform a CPI to the `LightSystemProgram` to initialize the `CompressedNullifier` account.
    - If the account already exists at the derived address, the transaction must fail (enforced by Light Protocol).
  </behavior>
  <action>
    1. Update the `VerifyProof` accounts struct to include `LightSystemProgram` and required Merkle tree accounts.
    2. Modify the `verify_proof` function signature to accept compression-related arguments (proof, address_tree_info).
    3. Remove the old standard PDA-based `nullifier_receipt` from the accounts struct.
    4. Implement the CPI call to `light_sdk::cpi::v1::initialize` to create the compressed nullifier.
  </action>
  <verify>
    <automated>cargo check -p minkyc</automated>
  </verify>
  <done>verify_proof refactored for compression and compiles</done>
</task>

<task type="auto">
  <name>Task 2: Implement TDD Tests for Compressed Nullifiers</name>
  <files>tests/compression.ts</files>
  <action>
    1. Create (or update) `tests/compression.ts` using `@lightprotocol/stateless.js`.
    2. Implement a test that simulates a full verification flow:
       - Generate mock proof and nullifier.
       - Call `verify_proof` once; expect success.
       - Call `verify_proof` again with the same nullifier; expect failure with an "already in use" error from the Light System Program.
    3. Ensure the test connects to a local Photon RPC (part of the Light CLI environment).
  </action>
  <verify>
    <automated>anchor test tests/compression.ts</automated>
  </verify>
  <done>TDD tests pass, confirming nullifier uniqueness in compressed state</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Compressed nullifier logic with replay protection.</what-built>
  <how-to-verify>
    1. Run `anchor test tests/compression.ts`.
    2. Verify that the second call to `verify_proof` with the same nullifier fails as expected.
    3. Check logs to ensure the Light System Program is being called for compressed account creation.
  </how-to-verify>
  <resume-signal>approved</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries
| Boundary | Description |
|----------|-------------|
| Program -> Light System Program | CPI boundary for state transitions |

## STRIDE Threat Register
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-MS2-02-03 | Spoofing | Validity Proof | mitigate | Light Protocol verifies ZK proofs of state transitions; the Anchor program checks the proof against the on-chain root. |
| T-MS2-02-04 | Repudiation | Nullifier Receipt | mitigate | Each verification is recorded as a compressed account; uniqueness is enforced at the protocol level. |
</threat_model>

<verification>
Run `anchor test tests/compression.ts`.
</verification>

<success_criteria>
- Proof verification logic successfully transitions to compressed state.
- Nullifiers are unique and enforced by the Light System Program.
- Test suite passes.
</success_criteria>

<output>
After completion, create `.planning/phases/MS2-02-nullifiers/MS2-02-03-SUMMARY.md`
</output>
