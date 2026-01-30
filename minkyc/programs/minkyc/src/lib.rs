#![allow(deprecated)]
use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod errors;

use instructions::*;

declare_id!("9wFAzCP1SEDA6zz6TMnyCwmDfLN5mu7343CzE4vPHM6J");

#[program]
pub mod minkyc {
    use super::*;

    pub fn initialize_identity(ctx: Context<InitializeIdentity>) -> Result<()> {
        instructions::initialize_identity::process_initialize_identity(ctx)
    }

    pub fn register_commitment(ctx: Context<RegisterCommitment>, commitment: [u8; 32]) -> Result<()> {
        instructions::register_commitment::process_register_commitment(ctx, commitment)
    }

    pub fn verify_proof(ctx: Context<VerifyProof>, nullifier: [u8; 32], proof: Vec<u8>) -> Result<()> {
        instructions::verify_proof::process_verify_proof(ctx, nullifier, proof)
    }

    pub fn revoke_identity(ctx: Context<RevokeIdentity>) -> Result<()> {
        instructions::revoke_identity::process_revoke_identity(ctx)
    }
}
