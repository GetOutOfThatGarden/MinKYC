# MinKYC - Privacy-Preserving Identity Verification on Solana

MinKYC is a privacy-first identity verification protocol on Solana that enables KYC compliance using minimal disclosure. No passport images or personal data are stored on-chain — only cryptographic commitments and verification state.

## Tech Stack

- **Framework**: Anchor (Solana program framework)
- **Language**: Rust (on-chain), TypeScript (tests & client)
- **Client/Test Framework**: Anchor TS, Mocha, Chai
- **Blockchain**: Solana (devnet)

## Architecture

### On-Chain State

The `IdentityAccount` stores the verification state of a user.

```rust
pub struct IdentityAccount {
    pub authority: Pubkey,
    pub commitment: [u8; 32],
    pub nullifier: [u8; 32],
    pub verified: bool,
    pub revoked: bool,
    pub created_at: i64,
}
```

### Identity Lifecycle

1.  **Initialize**: User creates an `IdentityAccount` (PDA).
2.  **Register Commitment**: User registers a commitment (e.g., hash of their identity details + secret).
3.  **Verify Proof**: User submits a ZK proof (mocked in MVP) that they satisfy KYC requirements. The proof includes a nullifier to prevent replay attacks.
4.  **Revoke**: User can revoke their identity, invalidating the verification status.

## Development

### Prerequisites

- Rust
- Solana CLI
- Anchor
- Yarn

### Build

```bash
anchor build
```

### Test

```bash
anchor test
```

## Privacy Model

- **Off-chain**: Identity verification and proof generation.
- **On-chain**: Verification of the proof and storage of the commitment/nullifier.
- **Commitment**: Hides the actual identity data.
- **Nullifier**: Prevents the same identity from being used multiple times (if enforced globally) or prevents replay of the same proof.

## License

Open Source.
