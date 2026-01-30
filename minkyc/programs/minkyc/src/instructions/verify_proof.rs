//! Verify Proof Instruction.
//!
//! This module handles the Zero-Knowledge Proof (ZKP) verification step.
//! In the MVP, this is a mocked verification that accepts a nullifier and marks the identity as verified.
//! In a production ZK system, this would invoke a verifier (e.g., Groth16/Plonk) to check the proof against the commitment.

use anchor_lang::prelude::*;
use crate::state::IdentityAccount;
use crate::errors::MinKycError;

/// Accounts validation struct for the `verify_proof` instruction.
#[derive(Accounts)]
pub struct VerifyProof<'info> {
    /// The identity account to be verified.
    ///
    /// # Constraints & Security
    /// - **mut**: State will be modified (verified flag, nullifier).
    /// - **seeds**: PDA verification.
    /// - **has_one**: Only the owner can submit the proof for their identity.
    /// - **constraint (!verified)**: Prevents re-verification of an already verified identity.
    ///   Why: Prevents overwriting the nullifier or resetting state unexpectedly.
    ///   Error: `MinKycError::IdentityAlreadyExists` (semantically "Identity already verified").
    /// - **constraint (!revoked)**: Revoked identities cannot be verified.
    ///   Error: `MinKycError::IdentityRevoked`.
    #[account(
        mut,
        seeds = [b"identity", authority.key().as_ref()],
        bump,
        has_one = authority @ MinKycError::Unauthorized,
        constraint = !identity.verified @ MinKycError::IdentityAlreadyExists,
        constraint = !identity.revoked @ MinKycError::IdentityRevoked
    )]
    pub identity: Account<'info, IdentityAccount>,

    /// The user wallet submitting the proof.
    pub authority: Signer<'info>,
}

/// Handler for the `verify_proof` instruction.
///
/// # Responsibility
/// Verifies the provided ZK proof (mocked) and updates the identity status.
///
/// # Logic
/// 1. (Mock) Validates the proof. Currently acts as a pass-through.
/// 2. Stores the `nullifier` to prevent replay attacks (in a full system, this would be checked against a global nullifier set).
/// 3. Sets `verified` to `true`.
///
/// # Parameters
/// - `ctx`: The context containing the accounts.
/// - `nullifier`: A 32-byte unique identifier derived from the secret and action.
///   Used to prevent the same secret from being used multiple times for the same action.
/// - `_proof`: The cryptographic proof bytes.
///   Prefix `_` indicates it is currently unused (mock implementation).
///
/// # Threat Model & Mitigations
/// - **Threat**: Replay Attacks (Double Spending/Verification).
///   **Mitigation**: The `nullifier` is stored. In a production system with global uniqueness checks,
///   this prevents reusing the same credentials to create multiple identities.
///   Here, checking `!identity.verified` prevents re-verifying *this specific* identity.
/// - **Threat**: Fake Proofs.
///   **Mitigation**: (Future) Cryptographic verification of `_proof` against `identity.commitment`.
pub fn process_verify_proof(ctx: Context<VerifyProof>, nullifier: [u8; 32], _proof: Vec<u8>) -> Result<()> {
    let identity = &mut ctx.accounts.identity;
    
    // -----------------------------------------------------------------------
    // MOCK VERIFICATION LOGIC
    // -----------------------------------------------------------------------
    // In a real implementation, we would:
    // 1. Load the Verifying Key (VK).
    // 2. Deserialise the `_proof`.
    // 3. Verify `proof(secret, nullifier)` matches `commitment` (stored in `identity.commitment`).
    //
    // For MVP, we assume off-chain validation or trust the input for demonstration.
    // -----------------------------------------------------------------------
    
    // Store the nullifier.
    // The nullifier is the public output of the ZK circuit that ensures uniqueness.
    // By storing it, we bind this verification instance to this specific nullifier.
    identity.nullifier = nullifier;
    
    // Mark the identity as verified.
    // This unlocks access to any protocol features requiring a verified MinKYC identity.
    identity.verified = true;
    
    msg!("Proof verified (Mock). Nullifier: {:?}", nullifier);
    Ok(())
}
