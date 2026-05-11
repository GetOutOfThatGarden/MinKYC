# Research: Light Protocol (V3) Integration for MinKYC

**Project:** MinKYC
**Focus:** Compressed Accounts for Nullifier Storage
**Date:** 2024-05-24
**Confidence:** HIGH

## Overview

Light Protocol (V3) introduces **ZK Compression** to Solana, allowing developers to store account state as "calldata" on the ledger rather than in expensive on-chain account space. For MinKYC, this enables massive scalability for storing **Nullifiers** and **Identity Commitments** at near-zero cost (~200x reduction compared to standard accounts).

### Key Benefits for MinKYC
1. **Cost Efficiency:** Storing 1M+ identity nullifiers on-chain as standard PDAs would cost thousands of SOL. With ZK Compression, it costs virtually nothing.
2. **Privacy:** Compressed state is stored in Merkle trees. While the data is public on the ledger, the "active" state is represented by a 32-byte hash (State Root) on-chain.
3. **Composability:** Compressed accounts can be interacted with via Cross-Program Invocation (CPI) from any Anchor program.

---

## Required Crates & Tools

| Crate | Purpose | Version (Approx) |
|-------|---------|------------------|
| `light-sdk` | Main SDK for Anchor integration (macros, traits, CPI). | `0.23.0` |
| `light-hasher` | Poseidon hashing for ZK-friendly addresses and trees. | `0.1.0` |
| `light-utils` | Low-level shared utilities (re-exported by `light-sdk`). | `0.1.0` |
| `light-macros` | Procedural macros for `#[light_account]`. | `0.1.0` |

### Infrastructure
- **Photon RPC:** A specialized RPC node (e.g., provided by Helius) that indexes compressed state and generates the `ValidityProof` required for transactions.
- **Light CLI:** For local testing (`light test-validator`).

---

## Program Architecture

### 1. Defining a Compressed Nullifier Account
A compressed account in Light Protocol behaves like an Anchor `Account` but uses the `LightAccount` trait.

```rust
use anchor_lang::prelude::*;
use light_sdk::account::LightAccount;
use light_sdk::light_account;

#[light_account]
#[derive(Default, Debug)]
pub struct NullifierAccount {
    pub owner: Pubkey,
    pub nullifier_hash: [u8; 32],
    pub created_at: i64,
}
```

### 2. Instruction Structure
Instructions interacting with compressed accounts must accept a `ValidityProof` and metadata about the Merkle trees.

```rust
use anchor_lang::prelude::*;
use light_sdk::{
    account::LightAccount,
    cpi::v1::LightSystemProgramCpi,
    verify_proof,
    instruction::PackedAddressTreeInfo,
    ValidityProof,
};

#[derive(Accounts)]
pub struct MarkNullifierUsed<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: Light System Program
    pub light_system_program: Program<'info, LightSystemProgramCpi>,
    // Other accounts...
}

pub fn process_nullifier(
    ctx: Context<MarkNullifierUsed>,
    proof: ValidityProof,
    address_tree_info: PackedAddressTreeInfo,
    nullifier_hash: [u8; 32],
) -> Result<()> {
    // 1. Derive deterministic address for the nullifier
    // 2. Perform CPI to Light System Program to "initialize" the compressed account
    // 3. If the address already exists in the tree, the creation will fail
    Ok(())
}
```

---

## Implementing Nullifiers with Compressed Accounts

### Strategy: Address-based Nullifiers
The most efficient way to implement uniqueness in MinKYC using Light Protocol is to use the **Nullifier Hash** as the seed for a **Compressed PDA**.

1. **Derivation:** `Address = Poseidon(Nullifier_Hash, Program_ID)`.
2. **Uniqueness:** Light Protocol enforces address uniqueness within the address tree.
3. **Check:**
   - **Off-chain:** Query Photon RPC for the address. If it returns data, the nullifier is "spent".
   - **On-chain:** Attempt to create the account. The `LightSystemProgram` will reject creation if the address is already occupied.

### UTXO Update Model
When a compressed account is updated, its old state is **nullified** (added to a bloom filter/nullifier set) and a new leaf is appended to the Merkle tree. This built-in nullification prevents replay attacks at the protocol level.

---

## Proof Verification

### Validity Proofs
Every transaction involving a compressed account must include a `ValidityProof`. This proof is generated off-chain by the Photon RPC and verifies:
1. The input compressed accounts exist in the current Merkle tree.
2. The provided state matches the on-chain root.

### State Roots
The Anchor program verifies the proof against the **State Root** stored in the `LightSystemProgram`. This ensures that even if the actual data is off-chain, the transition is cryptographically sound.

---

## Pitfalls & Considerations

| Pitfall | Impact | Mitigation |
|---------|--------|------------|
| **RPC Dependency** | standard RPCs won't work. | Must use Photon-enabled providers (Helius, Triton). |
| **Proof Latency** | Generating ZK proofs takes time. | Photon RPCs pre-compute most parts, but client-side proof fetching adds 100-500ms. |
| **Tree Fullness** | Merkle trees have finite capacity (e.g., depth 26). | Monitor tree capacity; Light Protocol supports multiple trees. |
| **CPI Limits** | Compressed state operations use significant CU. | Optimize instruction data; use `compute_units` heap increase if needed. |

## Sources

- [ZK Compression Official Docs](https://www.zkcompression.com)
- [Light Protocol GitHub](https://github.com/Lightprotocol/light-protocol)
- [light-sdk on Crates.io](https://crates.io/crates/light-sdk)
- [Helius ZK Compression Guide](https://www.helius.dev/blog/zk-compression-on-solana)
