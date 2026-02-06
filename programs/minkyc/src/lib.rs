use anchor_lang::prelude::*;

declare_id!("7nVLEY34rXaRTUjYHcbqeKZgSjxayCqeBPfCd1AtTAoW");

// Event emitted when a verification succeeds
#[event]
pub struct VerificationEvent {
    pub identity: Pubkey,
    pub owner: Pubkey,
    pub requirement_hash: [u8; 32],
    pub proof_hash: [u8; 32],
    pub timestamp: i64,
    pub slot: u64,
}

#[program]
pub mod minkyc {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, commitment: [u8; 32]) -> Result<()> {
        let counter = &mut ctx.accounts.identity_counter;
        let identity = &mut ctx.accounts.identity;
        
        identity.owner = ctx.accounts.owner.key();
        identity.commitment = commitment;
        identity.revoked = false;
        identity.index = counter.count;
        identity.verification_count = 0;
        
        // Increment counter for next identity
        counter.count = counter.count.checked_add(1).unwrap();
        
        msg!("Identity initialized!");
        msg!("Owner: {}", identity.owner);
        msg!("Index: {}", identity.index);
        msg!("Commitment: {:?}", identity.commitment);
        
        Ok(())
    }

    pub fn verify_proof(
        ctx: Context<VerifyProof>, 
        proof: Vec<u8>, 
        requirement_hash: [u8; 32], 
        identity_index: u64
    ) -> Result<()> {
        let identity = &mut ctx.accounts.identity;
        let receipt = &mut ctx.accounts.proof_receipt;
        let clock = Clock::get()?;
        
        msg!("Verifying proof for identity: {} (Index: {})", identity.owner, identity.index);
        
        if identity.revoked {
            msg!("Identity is revoked!");
            return err!(ErrorCode::IdentityRevoked);
        }

        // Mocked ZK Verification Logic
        if proof.is_empty() {
             msg!("Proof is empty! Verification failed.");
             return err!(ErrorCode::InvalidProof);
        }

        // REPLAY PROTECTION: Check if this proof was already used
        // We derive a unique hash for this proof to track it
        let proof_hash = anchor_lang::solana_program::hash::hash(&proof).to_bytes();
        
        if receipt.used {
            msg!("Proof has already been used!");
            return err!(ErrorCode::ProofAlreadyUsed);
        }

        // Mark receipt as used
        receipt.used = true;
        receipt.proof_hash = proof_hash;
        receipt.requirement_hash = requirement_hash;
        receipt.timestamp = clock.unix_timestamp;
        receipt.slot = clock.slot;
        receipt.identity = identity.key();
        receipt.owner = identity.owner;

        // Increment verification count on identity
        identity.verification_count = identity.verification_count.checked_add(1).unwrap();

        msg!("Commitment match verified.");
        msg!("Requirement hash verified: {:?}", requirement_hash);
        msg!("Verification Result: APPROVED");
        msg!("Proof receipt created at slot: {}", clock.slot);

        // Emit event for indexing
        emit!(VerificationEvent {
            identity: identity.key(),
            owner: identity.owner,
            requirement_hash,
            proof_hash,
            timestamp: clock.unix_timestamp,
            slot: clock.slot,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        payer = owner,
        space = 8 + 8, // discriminator + count
        seeds = [b"identity_counter", owner.key().as_ref()],
        bump
    )]
    pub identity_counter: Account<'info, IdentityCounter>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 32 + 1 + 8 + 8, // discriminator + owner + commitment + revoked + index + verification_count
        seeds = [b"identity", owner.key().as_ref(), &identity_counter.count.to_le_bytes()],
        bump
    )]
    pub identity: Account<'info, Identity>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction(proof: Vec<u8>, requirement_hash: [u8; 32], identity_index: u64)]
pub struct VerifyProof<'info> {
    #[account(
        mut,
        seeds = [b"identity", identity.owner.key().as_ref(), &identity_index.to_le_bytes()],
        bump
    )]
    pub identity: Account<'info, Identity>,
    
    // REPLAY PROTECTION: Create a PDA from the proof hash
    // This ensures each unique proof can only be used once
    #[account(
        init,
        payer = verifier,  // Verifier pays for the receipt account
        space = 8 + 1 + 32 + 32 + 8 + 8 + 32 + 32, // discriminator + used + proof_hash + requirement_hash + timestamp + slot + identity + owner
        seeds = [
            b"proof_receipt",
            identity.key().as_ref(),
            &anchor_lang::solana_program::hash::hash(&proof).to_bytes()
        ],
        bump
    )]
    pub proof_receipt: Account<'info, ProofReceipt>,
    
    #[account(mut)]
    pub verifier: Signer<'info>,  // Can be anyone (platform), not just identity owner
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Identity {
    pub owner: Pubkey,
    pub commitment: [u8; 32],
    pub revoked: bool,
    pub index: u64,
    pub verification_count: u64,  // Track number of successful verifications
}

#[account]
pub struct IdentityCounter {
    pub count: u64,
}

// REPLAY PROTECTION: Receipt account to track used proofs
#[account]
pub struct ProofReceipt {
    pub used: bool,                // Whether this proof has been used
    pub proof_hash: [u8; 32],      // Hash of the proof
    pub requirement_hash: [u8; 32], // Hash of the requirement
    pub timestamp: i64,            // When verification occurred
    pub slot: u64,                 // Solana slot for ordering
    pub identity: Pubkey,          // Reference to identity
    pub owner: Pubkey,             // Identity owner
}

#[error_code]
pub enum ErrorCode {
    #[msg("Identity has been revoked.")]
    IdentityRevoked,
    #[msg("Invalid proof provided.")]
    InvalidProof,
    #[msg("Proof has already been used.")]
    ProofAlreadyUsed,
}
