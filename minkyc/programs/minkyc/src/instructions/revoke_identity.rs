//! Revoke Identity Instruction.
//!
//! This module handles the permanent revocation of an identity.
//! Revocation is a critical lifecycle event, typically triggered by the user
//! (e.g., key compromise, privacy concerns) or a protocol-level decision.

use anchor_lang::prelude::*;
use crate::state::IdentityAccount;
use crate::errors::MinKycError;

/// Accounts validation struct for the `revoke_identity` instruction.
#[derive(Accounts)]
pub struct RevokeIdentity<'info> {
    /// The identity account to be revoked.
    ///
    /// # Constraints & Security
    /// - **mut**: State will be modified (flags updated).
    /// - **seeds**: Verifies the PDA derivation.
    /// - **has_one**: Only the identity owner can revoke their identity.
    ///   Error: `MinKycError::Unauthorized`.
    /// - **constraint (!revoked)**: Checks that the identity is not already revoked.
    ///   Why: Prevents redundant operations, though idempotency could also be a valid design choice.
    ///   Here, we enforce explicit state transitions.
    ///   Error: `MinKycError::IdentityRevoked`.
    #[account(
        mut,
        seeds = [b"identity", authority.key().as_ref()],
        bump,
        has_one = authority @ MinKycError::Unauthorized,
        constraint = !identity.revoked @ MinKycError::IdentityRevoked
    )]
    pub identity: Account<'info, IdentityAccount>,

    /// The user wallet authorizing the revocation.
    pub authority: Signer<'info>,
}

/// Handler for the `revoke_identity` instruction.
///
/// # Responsibility
/// Marks the identity as revoked and invalidates its verification status.
///
/// # Logic
/// 1. Sets `revoked` to `true`.
/// 2. Sets `verified` to `false`.
///
/// # Parameters
/// - `ctx`: The context containing the accounts.
///
/// # Security Implications
/// - **Irreversibility**: This operation is designed to be permanent. There is no `unrevoke` instruction.
/// - **Data Retention**: We do *not* zero out the `commitment` or `nullifier`.
///   Why: Retaining this data might be necessary for historical proofs or to prevent
///   re-registration attacks (if the nullifier were tracked globally).
///   However, strictly within this account, the `revoked` flag takes precedence in all checks.
pub fn process_revoke_identity(ctx: Context<RevokeIdentity>) -> Result<()> {
    let identity = &mut ctx.accounts.identity;
    
    // Mark as revoked. This flag acts as a kill-switch for the identity.
    identity.revoked = true;
    
    // Invalidate verification.
    // Even if a valid proof exists for the commitment, the identity is no longer trusted.
    identity.verified = false;
    
    // Note: We deliberately keep the existing `commitment` and `nullifier` data.
    // This serves as a tombstone record of what the identity was before revocation.
    
    msg!("Identity revoked.");
    Ok(())
}
