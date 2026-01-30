use anchor_lang::prelude::*;

#[error_code]
pub enum MinKycError {
    #[msg("Identity already exists")]
    IdentityAlreadyExists,
    #[msg("Commitment already registered")]
    CommitmentAlreadyRegistered,
    #[msg("Invalid Proof")]
    InvalidProof,
    #[msg("Identity Revoked")]
    IdentityRevoked,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Identity is immutable once verified")]
    IdentityImmutable,
}
