---
phase: MS2-01
plan: 02
type: execute
wave: 2
depends_on: [MS2-01-01]
files_modified: [programs/minkyc/src/lib.rs, tests/compression.ts]
autonomous: true
requirements: [P2.1.2, P2.1.3]
must_haves:
  truths:
    - "Merkle tree for compressed nullifiers can be initialized via RPC"
    - "CompressedNullifier account structure is defined and compatible with light-sdk"
    - "Tests confirm successful creation of a compressed account"
  artifacts:
    - path: "programs/minkyc/src/lib.rs"
      provides: "Compressed state instructions and account definitions"
    - path: "tests/compression.ts"
      provides: "Validation for compression infrastructure"
  key_links:
    - from: "programs/minkyc/src/lib.rs"
      to: "Light System Program"
      via: "CPI"
---

<objective>
Refactor the Anchor program to support ZK Compression and implement initial tests to verify the infrastructure.

Purpose: Enable hyper-scale nullifier storage by moving from on-chain PDAs to compressed accounts.
Output: Refactored program with Merkle tree initialization and basic compression tests.
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
@.planning/phases/MS2-01-foundation/MS2-01-01-SUMMARY.md
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Define CompressedNullifier and Merkle Tree Initialization</name>
  <files>programs/minkyc/src/lib.rs</files>
  <behavior>
    - The program must export a `CompressedNullifier` struct with `#[light_account]`.
    - The `CompressedNullifier` must contain: `owner: Pubkey`, `nullifier_hash: [u8; 32]`.
    - The program must provide an `initialize_merkle_tree` instruction that calls the Light System Program to create a new Merkle tree account.
  </behavior>
  <action>
    1. Import `light_sdk` modules in `lib.rs`.
    2. Define `CompressedNullifier` struct.
    3. Implement `initialize_merkle_tree` instruction and the associated `InitializeMerkleTree` accounts struct.
    4. Reference `RESEARCH.md` for the exact CPI pattern required by Light Protocol V3.
  </action>
  <verify>
    <automated>cargo check -p minkyc</automated>
  </verify>
  <done>Program defines compressed state and compiles successfully</done>
</task>

<task type="auto">
  <name>Task 2: Implement Compression Infrastructure Tests</name>
  <files>tests/compression.ts</files>
  <action>
    1. Create `tests/compression.ts` using `@lightprotocol/stateless.js` and `@lightprotocol/zk-compression-cli`.
    2. Implement a test case for `initialize_merkle_tree`.
    3. Implement a test case that creates a dummy `CompressedNullifier` account.
    4. Use `light-test-utils` or similar to mock/connect to a local Photon instance.
  </action>
  <verify>
    <automated>anchor test tests/compression.ts</automated>
  </verify>
  <done>Tests pass, confirming Merkle tree init and compressed account creation</done>
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
| T-MS2-01-02 | Elevation of Privilege | initialize_merkle_tree | mitigate | Restrict tree initialization to a specific admin or the program's upgrade authority. |
| T-MS2-01-03 | Tampering | Merkle Tree | mitigate | Light Protocol enforces state consistency via ZK proofs; ensure CPI only uses authorized Light System Program ID. |
</threat_model>

<verification>
Run `anchor test tests/compression.ts` to ensure the compression infrastructure is fully functional.
</verification>

<success_criteria>
- `initialize_merkle_tree` successfully creates a Merkle tree on-chain (verified by test).
- `CompressedNullifier` accounts can be "initialized" in the compressed state.
- Test suite passes in a local environment with Photon.
</success_criteria>

<output>
After completion, create `.planning/phases/MS2-01-foundation/MS2-01-02-SUMMARY.md`
</output>
