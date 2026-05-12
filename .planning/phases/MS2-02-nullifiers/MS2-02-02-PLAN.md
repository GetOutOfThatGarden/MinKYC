---
phase: MS2-02
plan: 02
type: execute
wave: 1
depends_on: []
files_modified: [programs/minkyc/src/lib.rs]
autonomous: true
requirements: [P2.2.1]
must_haves:
  truths:
    - "CompressedNullifier is defined as a light_account"
    - "Poseidon-based address derivation is implemented for nullifiers"
  artifacts:
    - path: "programs/minkyc/src/lib.rs"
      provides: "Address derivation and light account definitions"
---

<objective>
Implement Poseidon-based address derivation and define the compressed nullifier account.

Purpose: Enable deterministic addressing for compressed nullifiers to ensure uniqueness across the Merkle tree.
Output: Program with Poseidon derivation and Light account definition.
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
</context>

<tasks>

<task type="auto">
  <name>Task 1: Define Compressed Nullifier Light Account</name>
  <files>programs/minkyc/src/lib.rs</files>
  <action>
    1. Update the `CompressedNullifier` struct in `lib.rs` to use the `#[light_account]` macro from `light_sdk`.
    2. Ensure it contains `owner: Pubkey`, `nullifier_hash: [u8; 32]`, and `timestamp: i64`.
    3. Ensure `light_sdk::LightAccount` is derived/implemented.
  </action>
  <verify>
    <automated>cargo check -p minkyc</automated>
  </verify>
  <done>CompressedNullifier is a valid light_account</done>
</task>

<task type="auto">
  <name>Task 2: Implement Poseidon Address Derivation Utility</name>
  <files>programs/minkyc/src/lib.rs</files>
  <action>
    1. Implement a helper function `derive_nullifier_address` that takes a `nullifier: [u8; 32]` and returns a `[u8; 32]`.
    2. Use `light_hasher::Poseidon` (version 5.0.0) to compute the hash.
    3. The address should be derived as `Poseidon(nullifier, program_id)`.
  </action>
  <verify>
    <automated>cargo check -p minkyc</automated>
  </verify>
  <done>Address derivation utility is implemented</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries
| Boundary | Description |
|----------|-------------|
| Program Logic | Internal address derivation |

## STRIDE Threat Register
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-MS2-02-02 | Tampering | Address Derivation | mitigate | Use Poseidon hash as specified by Light Protocol for compressed account addresses. |
</threat_model>

<verification>
Run `cargo check -p minkyc`.
</verification>

<success_criteria>
- `CompressedNullifier` struct is correctly annotated.
- `derive_nullifier_address` compiles and uses Poseidon.
</success_criteria>

<output>
After completion, create `.planning/phases/MS2-02-nullifiers/MS2-02-02-SUMMARY.md`
</output>
