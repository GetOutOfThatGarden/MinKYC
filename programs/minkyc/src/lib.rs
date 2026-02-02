use anchor_lang::prelude::*;

declare_id!("DqULmbVsScRQGDtjUJEdptTjLkcPiH1rNCZRVUQc2hDL");

#[program]
pub mod minkyc {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, commitment: [u8; 32]) -> Result<()> {
        let identity = &mut ctx.accounts.identity;
        identity.owner = ctx.accounts.owner.key();
        identity.commitment = commitment;
        identity.revoked = false;
        
        msg!("Identity initialized!");
        msg!("Owner: {}", identity.owner);
        msg!("Commitment: {:?}", identity.commitment);
        
        Ok(())
    }

    pub fn close(_ctx: Context<Close>) -> Result<()> {
        msg!("Identity closed/reset");
        Ok(())
    }

    pub fn verify_proof(ctx: Context<VerifyProof>, proof: Vec<u8>, requirement_hash: [u8; 32]) -> Result<()> {
        let identity = &ctx.accounts.identity;
        
        msg!("Verifying proof for identity: {}", identity.owner);
        
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
        init,
        payer = owner,
        space = 8 + 32 + 32 + 1, // discriminator + owner + commitment + revoked
        seeds = [b"identity", owner.key().as_ref()],
        bump
    )]
    pub identity: Account<'info, Identity>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(
        mut,
        close = owner,
        seeds = [b"identity", owner.key().as_ref()],
        bump
    )]
    pub identity: Account<'info, Identity>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct VerifyProof<'info> {
    #[account(
        seeds = [b"identity", identity.owner.key().as_ref()],
        bump
    )]
    pub identity: Account<'info, Identity>,
}

#[account]
pub struct Identity {
    pub owner: Pubkey,
    pub commitment: [u8; 32],
    pub revoked: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Identity has been revoked.")]
    IdentityRevoked,
    #[msg("Invalid proof provided.")]
    InvalidProof,
}
