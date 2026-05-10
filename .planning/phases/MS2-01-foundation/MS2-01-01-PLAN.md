---
phase: MS2-01
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [programs/minkyc/Cargo.toml]
autonomous: true
requirements: [P2.1.1, P2.1.2]
user_setup:
  - service: Light Protocol
    why: "Infrastructure for ZK Compression"
    dashboard_config:
      - task: "Install light-cli"
        location: "Terminal: cargo install light-cli"
      - task: "Configure Photon RPC"
        location: "Environment variables or Anchor.toml (using Helius or local light-test-validator)"

must_haves:
  truths:
    - "light-cli is installed and accessible via command line"
    - "programs/minkyc/Cargo.toml contains light-sdk and light-hasher dependencies"
  artifacts:
    - path: "programs/minkyc/Cargo.toml"
      provides: "Light Protocol crate dependencies"
  key_links:
    - from: "programs/minkyc/Cargo.toml"
      to: "crates.io"
      via: "cargo"
---

<objective>
Set up the Light Protocol development environment and integrate required dependencies into the Anchor program.

Purpose: Provide the necessary tools and libraries to implement ZK Compression in the MinKYC program.
Output: Configured dev environment and updated Cargo.toml.
</objective>

<execution_context>
@/Users/user2/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/user2/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/research/LIGHT_PROTOCOL_INTEGRATION.md
@programs/minkyc/Cargo.toml
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install Light Protocol CLI and verify environment</name>
  <files></files>
  <action>
    1. Check if `light-cli` is installed: `light --version`.
    2. If not installed, install it: `cargo install light-cli --version 0.1.6` (or latest stable).
    3. Verify `light test-validator` can be initialized (no need to keep it running).
  </action>
  <verify>
    <automated>light --version</automated>
  </verify>
  <done>light-cli is installed and responsive</done>
</task>

<task type="auto">
  <name>Task 2: Add Light Protocol dependencies to Anchor program</name>
  <files>programs/minkyc/Cargo.toml</files>
  <action>
    Add the following dependencies to `programs/minkyc/Cargo.toml`:
    - `light-sdk = "0.23.0"`
    - `light-hasher = "0.1.0"`
    
    Ensure they are added under `[dependencies]`.
  </action>
  <verify>
    <automated>cargo check -p minkyc</automated>
  </verify>
  <done>Cargo.toml updated and project compiles with new dependencies</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries
| Boundary | Description |
|----------|-------------|
| Developer -> Crates.io | External dependency injection point |

## STRIDE Threat Register
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-MS2-01-01 | Tampering | Cargo.toml | mitigate | Use specific versions and checksums (Cargo.lock) |
</threat_model>

<verification>
Run `cargo check -p minkyc` to ensure dependencies are resolved correctly.
</verification>

<success_criteria>
- `light --version` returns a valid version string.
- `programs/minkyc/Cargo.toml` includes `light-sdk` and `light-hasher`.
- Project builds without dependency errors.
</success_criteria>

<output>
After completion, create `.planning/phases/MS2-01-foundation/MS2-01-01-SUMMARY.md`
</output>
