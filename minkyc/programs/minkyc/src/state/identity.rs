use anchor_lang::prelude::*;

#[account]
pub struct IdentityAccount {
    pub authority: Pubkey,
    pub commitment: [u8; 32],
    pub nullifier: [u8; 32],
    pub verified: bool,
    pub revoked: bool, // Added revoked field
    pub created_at: i64,
}

impl IdentityAccount {
    // Discriminator (8) + Pubkey (32) + Commitment (32) + Nullifier (32) + Verified (1) + Revoked (1) + CreatedAt (8)
    pub const LEN: usize = 8 + 32 + 32 + 32 + 1 + 1 + 8;
}
