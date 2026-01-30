//! Initialize Identity Instruction.
//!
//! This module handles the creation of the `IdentityAccount` Program Derived Address (PDA).
//! It is the entry point for any user wishing to interact with the MinKYC protocol.

use anchor_lang::prelude::*;
use crate::state::IdentityAccount;

/// Accounts validation struct for the `initialize_identity` instruction.
///
/// Defines the necessary accounts and constraints to securely create a new identity.
#[derive(Accounts)]
pub struct InitializeIdentity<'info> {
    /// The identity account to be initialized.
    ///
    /// # Constraints & Security
    /// - **init**: Instructs Anchor to create this account via a CPI to the System Program.
    /// - **payer**: The `authority` wallet pays the rent exemption lamports.
    /// - **space**: Allocates exactly `IdentityAccount::LEN` bytes.
    /// - **seeds**: `[b"identity", authority.key()]`. This PDA derivation enforces a strict
    ///   1-to-1 relationship between a wallet (`authority`) and an `IdentityAccount`.
    ///   It prevents a single wallet from creating multiple identities or spoofing another's identity.
    /// - **bump**: Stores the bump seed to ensure the address is a valid PDA.
    #[account(
        init,
        payer = authority,
        space = IdentityAccount::LEN,
        seeds = [b"identity", authority.key().as_ref()],
        bump
    )]
    pub identity: Account<'info, IdentityAccount>,

    /// The user wallet initiating the transaction.
    ///
    /// # Security
    /// - Must be a `Signer` to authorize the deduction of lamports for rent.
    /// - Acts as the `authority` binding for the new identity.
    #[account(mut)]
    pub authority: Signer<'info>,

    /// The Solana System Program.
    ///
    /// Required by the `init` constraint to perform the account creation.
    pub system_program: Program<'info, System>,
}

/// Handler for the `initialize_identity` instruction.
///
/// # Responsibility
/// Sets the initial state of the `IdentityAccount`.
///
/// # Logic
/// 1. Assigns the `authority` field to the signer's public key.
/// 2. Records the `created_at` timestamp for auditability.
/// 3. Initializes status flags (`verified`, `revoked`) to `false`.
/// 4. Initializes cryptographic fields (`commitment`, `nullifier`) to zero-arrays.
///
/// # Parameters
/// - `ctx`: The context containing the validated accounts.
///
/// # Return
/// - `Ok(())` on success.
/// - Returns an error if account creation fails (handled by Anchor).
pub fn process_initialize_identity(ctx: Context<InitializeIdentity>) -> Result<()> {
    // Mutable reference to the newly created identity account.
    let identity = &mut ctx.accounts.identity;
    
    // Bind the identity to the signer's wallet.
    // This establishes the ownership model used in `has_one` checks later.
    identity.authority = ctx.accounts.authority.key();
    
    // Capture the current on-chain timestamp.
    // Used for calculating identity age or expiration policies (if added later).
    identity.created_at = Clock::get()?.unix_timestamp;
    
    // Default state: Identity is fresh, not yet verified, and valid (not revoked).
    identity.verified = false;
    identity.revoked = false;
    
    // Initialize commitment and nullifier with zeros.
    // These act as placeholders until `register_commitment` and `verify_proof` are called.
    // Using [0; 32] is safe here as it represents an "empty" 32-byte hash.
    identity.commitment = [0; 32];
    identity.nullifier = [0; 32];
    
    msg!("Identity initialized for authority: {}", identity.authority);
    Ok(())
}
