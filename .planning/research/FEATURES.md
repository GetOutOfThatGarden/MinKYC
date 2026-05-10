# Feature Landscape

**Domain:** Privacy-Preserving Identity (ZK-KYC)
**Researched:** 2024-05-23

## Table Stakes

Features users and regulators expect. Missing = product feels incomplete or non-compliant.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| NFC Passport Scan | Global standard for high-assurance KYC. | High | Requires handling multiple ICAO LDS formats and cryptographic auth (BAC/PACE). |
| Age Verification (>18) | Core KYC requirement for DeFi/Gambling. | Medium | Noir range proof logic is straightforward. |
| Nationality Check | Needed for sanction list compliance. | Medium | Equality proof in ZK. |
| Replay Protection | Prevents duplicate use of identity or proof. | Medium | **Best Practice:** Use Nullifiers to prevent double-spending an identity proof without revealing identity. |

## Differentiators

Features that set MinKYC apart.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Selective Disclosure | Share *only* what's needed (e.g., "Over 18" but not "DOB"). | Medium | Core strength of ZKPs. |
| Unlinkability | Verifiers cannot track users across apps. | High | **Crucial:** Requires randomized nullifiers (salted per app/verifier). |
| Proof Binding | Prevents attackers from stealing and replaying proofs. | Medium | Circuit must include `caller_pubkey` as a public input. |
| Local ZK Generation | PII never leaves the Solana Seeker device. | High | Maximum security; "Zero-Trust" architecture. |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Identifiable Receipt Seeds | Links ZK proof back to a wallet/identity PDA. | Use **Nullifiers** as PDA seeds for receipts. |
| Centralized PII Storage | Creates a breach "honeypot" and violates GDPR. | Store only commitments (hashes) and receipts on-chain. |
| On-Chain Raw Passport Data | Immutable public record of identity is a privacy disaster. | Use ZK proofs to verify attributes without revealing data. |

## Feature Dependencies

```
NFC Passport Read → SOD Hash Verification → RSA/ECDSA Signature Verification → ZK Attribute Proof → Nullifier Generation → On-Chain Verification
```

## MVP Recommendation

Prioritize:
1. **NFC Reading (DG1/SOD):** Prove we can get raw data from the chip.
2. **Basic Noir Circuit:** Verify SHA-256 hashes match the SOD.
3. **Nullifier Logic:** Ensure basic replay protection exists in a private way.

Defer: **Lawful Intercept (Identity Escrow):** Focus on the user-to-dApp privacy first, then layer on the regulator-to-issuer compliance.

## Sources

- [eIDAS 2.0 ARF (Selective Disclosure)](https://github.com/eu-digital-identity-wallet/architecture-and-reference-framework)
- [ICAO 9303 (NFC Passport Standards)](https://www.icao.int/publications/pages/publication.aspx?docnum=9303)
- [Light Protocol: ZK Compression for Nullifiers](https://www.lightprotocol.com/)
