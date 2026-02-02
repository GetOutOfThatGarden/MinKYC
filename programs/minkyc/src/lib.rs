use anchor_lang::prelude::*;

declare_id!("7nVLEY34rXaRTUjYHcbqeKZgSjxayCqeBPfCd1AtTAoW");

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
        
        // Increment counter for next identity
        counter.count = counter.count.checked_add(1).unwrap();
        
        msg!("Identity initialized!");
        msg!("Owner: {}", identity.owner);
        msg!("Index: {}", identity.index);
        msg!("Commitment: {:?}", identity.commitment);
        
        Ok(())
    }

    // Close functionality is temporarily removed to simplify multiple identity management
    // pub fn close(_ctx: Context<Close>) -> Result<()> {
    //     msg!("Identity closed/reset");
    //     Ok(())
    // }

    pub fn verify_proof(ctx: Context<VerifyProof>, proof: Vec<u8>, requirement_hash: [u8; 32], _identity_index: u64) -> Result<()> {
        let identity = &ctx.accounts.identity;
        
        msg!("Verifying proof for identity: {} (Index: {})", identity.owner, identity.index);
        
        if identity.revoked {
            msg!("Identity is revoked!");
            return err!(ErrorCode::IdentityRevoked);
        }

        // Mocked ZK Verification Logic
        // In a real system, we would verify the ZK proof against the commitment and requirement.
        // For this MVP, we will simulate verification.
        // Let's assume the proof is valid if it's not empty.
        
        if proof.is_empty() {
             msg!("Proof is empty! Verification failed.");
             return err!(ErrorCode::InvalidProof);
        }

        // Simulate checking commitment
        msg!("Commitment match verified.");
        
        // Simulate checking requirement (e.g. over-18)
        msg!("Requirement hash verified: {:?}", requirement_hash);

        msg!("Verification Result: APPROVED");

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
        space = 8 + 32 + 32 + 1 + 8, // discriminator + owner + commitment + revoked + index
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
        seeds = [b"identity", identity.owner.key().as_ref(), &identity_index.to_le_bytes()],
        bump
    )]
    pub identity: Account<'info, Identity>,
}

#[account]
pub struct Identity {
    pub owner: Pubkey,
    pub commitment: [u8; 32],
    pub revoked: bool,
    pub index: u64,
}

#[account]
pub struct IdentityCounter {
    pub count: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Identity has been revoked.")]
    IdentityRevoked,
    #[msg("Invalid proof provided.")]
    InvalidProof,
}
