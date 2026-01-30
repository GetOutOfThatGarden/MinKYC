//! Register Commitment Instruction.
//!
//! This module allows a user to register a cryptographic commitment to their identity.
//! The commitment typically represents `Hash(secret + info)`, allowing the user to later
//! prove properties about their identity without revealing the underlying data.

use anchor_lang::prelude::*;
use crate::state::IdentityAccount;
use crate::errors::MinKycError;

/// Accounts validation struct for the `register_commitment` instruction.
#[derive(Accounts)]
pub struct RegisterCommitment<'info> {
    /// The user's identity account.
    ///
    /// # Constraints & Security
    /// - **mut**: State will be modified (commitment updated).
    /// - **seeds**: Verifies this is the correct PDA for the signer.
    /// - **has_one**: Ensures `identity.authority` matches the `authority` signer.
    ///   Mitigation: Prevents unauthorized users from overwriting another's commitment.
    /// - **constraint (!verified)**: The commitment cannot be changed once the identity is verified.
    ///   Why: Changing the commitment after verification would invalidate the proof that verified it.
    ///   Error: `MinKycError::IdentityImmutable`.
    /// - **constraint (!revoked)**: Revoked identities cannot be modified.
    ///   Why: A revoked identity is permanently disabled.
    ///   Error: `MinKycError::IdentityRevoked`.
    #[account(
        mut,
        seeds = [b"identity", authority.key().as_ref()],
        bump,
        has_one = authority @ MinKycError::Unauthorized,
        constraint = !identity.verified @ MinKycError::IdentityImmutable,
        constraint = !identity.revoked @ MinKycError::IdentityRevoked
    )]
    pub identity: Account<'info, IdentityAccount>,

    /// The user wallet.
    ///
    /// Must be a signer to authorize the state change.
    pub authority: Signer<'info>,
}

/// Handler for the `register_commitment` instruction.
///
/// # Responsibility
/// Updates the `commitment` field in the `IdentityAccount`.
///
/// # Logic
/// 1. Validates that the identity is editable (not verified, not revoked) via constraints.
/// 2. Overwrites the existing `commitment` with the new 32-byte array.
///
/// # Parameters
/// - `ctx`: The context containing the validated accounts.
/// - `commitment`: A 32-byte array representing the cryptographic commitment (e.g., SHA256/Poseidon hash).
///
/// # Threat Model & Mitigations
/// - **Threat**: Malicious overwrites.
///   **Mitigation**: `has_one = authority` constraint ensures only the owner can write.
/// - **Threat**: Changing commitment after verification (Front-running/Bait-and-switch).
///   **Mitigation**: `!identity.verified` constraint locks the commitment upon verification.
pub fn process_register_commitment(ctx: Context<RegisterCommitment>, commitment: [u8; 32]) -> Result<()> {
    let identity = &mut ctx.accounts.identity;
    
    // Note: We do not validate the content of the commitment (e.g., non-zero) here.
    // An empty commitment is technically valid but likely useless for verification.
    // The validation burden is on the `verify_proof` stage or client-side generation.
    
    // Update the commitment in state.
    identity.commitment = commitment;
    
    msg!("Commitment registered: {:?}", commitment);
    Ok(())
}
