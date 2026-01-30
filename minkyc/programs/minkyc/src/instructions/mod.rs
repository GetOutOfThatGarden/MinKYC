//! Instructions module.
//!
//! This module aggregates all instruction handlers for the MinKYC program.
//! Each submodule corresponds to a distinct phase in the identity lifecycle,
//! enforcing separation of concerns and modularity.
//!
//! # Lifecycle Flow
//! 1. `initialize_identity`: User creates their identity PDA.
//! 2. `register_commitment`: User submits a commitment (hash of secrets).
//! 3. `verify_proof`: User provides a ZK proof to verify the commitment.
//! 4. `revoke_identity`: User permanently revokes their identity.

pub mod initialize_identity;
pub mod register_commitment;
pub mod verify_proof;
pub mod revoke_identity;

pub use initialize_identity::*;
pub use register_commitment::*;
pub use verify_proof::*;
pub use revoke_identity::*;
