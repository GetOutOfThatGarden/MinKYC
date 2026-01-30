MinKYC – Privacy-Preserving Identity Verification on Solana

MinKYC is a privacy-first identity verification protocol on Solana that enables KYC compliance using minimal disclosure.
No passport images or personal data are stored on-chain — only cryptographic commitments and verification state.

⸻

Tech Stack
	•	Framework: Anchor (Solana program framework)
	•	Language: Rust (on-chain), TypeScript (tests & client)
	•	Client/Test Framework: Anchor TS, Mocha, Chai
	•	Zero-Knowledge (optional MVP): Noir (Aztec)
	•	Blockchain: Solana (devnet)
	•	RPC: Helius

⸻

Context & File References
	•	@programs/minkyc/src/lib.rs
Core Anchor program entrypoint.
	•	@programs/minkyc/src/state/identity.rs
Identity account struct and data model.
	•	@programs/minkyc/src/instructions/
Instruction handlers:
	•	initialize_identity
	•	register_commitment
	•	verify_proof
	•	revoke_identity
	•	@programs/minkyc/src/errors.rs
Custom program error codes.
	•	@tests/minkyc.ts
Test-driven development entrypoint.
	•	@zk/noir/identity.nr
Optional zero-knowledge circuit (can be stubbed).
	•	.cursorrules
Must remain active to enforce formatting, safety, and Rust conventions.

⸻

Goal & Requirements
	•	Implement a privacy-preserving KYC system on Solana.
	•	Do not store any personally identifiable information on-chain.
	•	Store only cryptographic commitments and nullifiers.
	•	Support selective disclosure via off-chain proofs.
	•	Follow strict test-driven development.
	•	All code must be open source.
	•	Program must deploy successfully to Solana devnet.
	•	Architecture must support future real ZK verification.

Functional Requirements
	•	One identity per wallet (PDA-based).
	•	Identity lifecycle:
	1.	Initialize identity
	2.	Register identity commitment
	3.	Verify proof (mocked for MVP)
	4.	Revoke identity
	•	Commitments become immutable once verified.
	•	Only the wallet authority may update identity state.
	•	Nullifiers must prevent replay attacks.

Constraints
	•	No passport images anywhere.
	•	No encrypted document blobs on-chain.
	•	No names, DOBs, passport numbers, or nationality stored.
	•	No invented SDKs or fictional Solana APIs.
	•	Anchor account constraints must be enforced.
	•	Minimal, readable implementations only.

⸻

Design Guidelines

Architecture
	•	Identity data is processed off-chain only.
	•	On-chain program acts as:
	•	commitment registry
	•	verification state machine
	•	ZK proof generation occurs off-chain.
	•	On-chain program verifies public inputs only.

On-Chain Account Model

#[account]
pub struct IdentityAccount {
    pub authority: Pubkey,
    pub commitment: [u8; 32],
    pub nullifier: [u8; 32],
    pub verified: bool,
    pub created_at: i64,
}

PDA Design

seeds = [
  "identity",
  authority_pubkey
]


⸻

Implementation Plan
	1.	Scaffold Anchor workspace named minkyc.
	2.	Define IdentityAccount struct and fixed account size.
	3.	Create custom program error codes.
	4.	Write failing tests in /tests/minkyc.ts.
	5.	Implement initialize_identity instruction.
	6.	Implement register_commitment instruction.
	7.	Enforce authority and immutability checks.
	8.	Implement mock verify_proof instruction.
	9.	Add nullifier replay protection.
	10.	Implement revoke_identity logic.
	11.	Ensure all tests pass locally.
	12.	Deploy program to Solana devnet.
	13.	Document architecture and privacy model in README.
	14.	Prepare 3-minute demo walkthrough.

⸻

Please review these instructions, summarize your understanding, and propose an implementation plan before writing any code.