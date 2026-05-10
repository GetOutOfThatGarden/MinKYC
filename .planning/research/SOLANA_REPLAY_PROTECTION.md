# Research: ZK-Proof Replay Protection on Solana

**Project:** MinKYC
**Domain:** Privacy-Preserving Compliance
**Researched:** 2024-05-23
**Overall confidence:** HIGH

## Executive Summary

Replay protection is critical for Zero-Knowledge (ZK) applications to prevent users from reusing a single proof to claim multiple benefits or perform unauthorized duplicate actions. MinKYC currently employs a **Proof Receipt PDA** strategy (`["proof_receipt", identity_pda, proof_hash]`).

While this effectively prevents replaying the *exact same proof*, it has significant **privacy leaks** (linking verifications to public identity PDAs) and **scalability limitations** (high rent costs). This research recommends transitioning to a **Nullifier-based** strategy with **Proof Binding** and **ZK Compression** for production-grade security and privacy.

---

## Analysis of Current Strategy

### Current Pattern
- **PDA:** `seeds = [b"proof_receipt", identity_pda, proof_hash]`
- **Logic:** The Solana program attempts to initialize this PDA. If it already exists, the transaction fails with `ProofAlreadyUsed`.

### Evaluation
| Factor | Status | Notes |
|--------|--------|-------|
| **Replay Protection** | Partial | Prevents reusing the same `proof_hash`. Does NOT prevent a user from generating a *new* proof for the same underlying identity to bypass application-level limits (e.g., one-time registration). |
| **Privacy** | LOW | **Critical Leak:** By using `identity_pda` as a seed for the receipt, every verification is publicly linked to the user's Identity PDA. If the Identity PDA is derived from the `owner_pubkey`, the anonymity of the ZK proof is nullified. |
| **Front-running** | LOW | An attacker can intercept a valid proof from the mempool and submit it first. Since the proof isn't bound to the transaction signer (`msg.sender`), the attacker "steals" the verification. |
| **Scalability** | LOW | Creating a standard account (~165 bytes) for every verification costs ~0.0016 SOL in rent. For 1M verifications, this costs 1,600 SOL (~$240k). |

---

## Best Practice: The Nullifier Pattern

The industry standard for ZK replay protection is the **Nullifier**. A nullifier is a unique identifier derived deterministically from a user's secret, ensuring that a specific action can only be performed once per "context" without revealing the user's identity.

### 1. Circuit Implementation (Noir)
The circuit must generate and output a `nullifier`.

```rust
// Recommended Circuit Logic
fn main(
    private_secret: Field,      // User's private salt/key
    context_id: pub Field,      // Unique context (e.g., hash(verifier_pubkey, nonce))
    caller_pubkey: pub Field,   // The wallet address submitting the tx
    // ... other inputs
) -> pub Field {                // Returns the nullifier
    
    // 1. Bind the proof to the transaction signer (Prevents front-running)
    // The verifier program will check if this matches the signer
    
    // 2. Generate the nullifier
    let nullifier = std::hash::poseidon::bn254::hash_2([private_secret, context_id]);
    
    nullifier
}
```

### 2. On-Chain Implementation (Anchor)
The receipt PDA should be derived from the **nullifier**, not the identity.

```rust
#[derive(Accounts)]
#[instruction(nullifier: [u8; 32])]
pub struct VerifyProof<'info> {
    #[account(
        init,
        payer = verifier,
        space = 8 + 1, // Minimal space needed
        seeds = [b"nullifier", nullifier.as_ref()],
        bump
    )]
    pub nullifier_record: Account<'info, NullifierRecord>,
    // ...
}
```

---

## Scalability: ZK Compression

To handle high volumes of verifications (e.g., millions of KYC checks), storing nullifiers in individual accounts is prohibitively expensive.

### Recommendation: Light Protocol / ZK Compression
Instead of creating a new Solana account for every nullifier:
1.  **State:** Store nullifiers in a Merkle Tree.
2.  **On-chain:** Only store the **Merkle Root** in the program's state.
3.  **Verification:** The user provides the nullifier + a Merkle proof that it hasn't been "spent" (nullified) in the tree yet.
4.  **Cost:** Reduces storage costs by ~99%.

---

## Security Recommendation: Proof Binding

To prevent **Front-running Replay** (where an attacker copies your proof from the mempool), you must bind the proof to the transaction signer.

1.  **Inside Circuit:** Add `signer_pubkey` as a public input.
2.  **On-chain:** The Solana program must verify that `ctx.accounts.signer.key() == public_inputs.signer_pubkey`.

---

## Implications for Roadmap

Based on these findings, the following phases are recommended for the MinKYC roadmap:

1.  **Phase 1: Nullifier Integration (High Priority)**
    - Update Noir circuits to calculate Poseidon-based nullifiers.
    - Update Anchor program to use `nullifier` as the receipt seed.
    - **Outcome:** Fixes the privacy leak and enables proper one-time verification.

2.  **Phase 2: Proof Binding (High Priority)**
    - Add `caller_pubkey` to circuit inputs.
    - Add validation logic in `verify_proof` instruction.
    - **Outcome:** Prevents proof theft/front-running.

3.  **Phase 3: ZK Compression (Medium Priority)**
    - Integrate Light Protocol for nullifier storage.
    - **Outcome:** Makes the system commercially viable at scale.

## Sources

- [Solana Documentation: ZK Support](https://docs.solana.com/developing/runtime-facilities/zk-token-proof)
- [Noir Documentation: Standard Library Hashes](https://noir-lang.org/docs/standard_library/hashes)
- [Light Protocol: ZK Compression for Nullifiers](https://www.lightprotocol.com/)
- [Helius: Guide to ZK Compression on Solana](https://www.helius.dev/blog/zk-compression-on-solana)
