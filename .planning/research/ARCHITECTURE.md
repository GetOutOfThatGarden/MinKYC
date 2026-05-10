# Architecture Patterns

**Domain:** Privacy-Preserving Identity (ZK-KYC)
**Researched:** 2025-05-24

## Recommended Architecture: "On-Device Prover, On-Chain Verifier"

MinKYC follows the "Sovereign Identity" pattern where the user is the sole custodian of their raw PII.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **NFC Scanner (Mobile)** | Reads ICAO 9303 LDS data from passport chip. | Passport Chip, ZK Prover |
| **ZK Prover (Mobile)** | Noir circuit that verifies passport authenticity and generates attribute proofs. | NFC Scanner, Solana (Proof Submission) |
| **Solana Program** | Verifies ZK proofs and stores commitments/receipts. | ZK Prover, dApps (Verification Query) |
| **Identity Issuer (Off-chain)** | (Future) Regulated entity that issues the root credential or handles escrow. | User, Regulator |

### Data Flow

1. **Scan:** Mobile app scans passport MRZ to derive BAC/PACE keys and reads NFC chip.
2. **Prove:** Noir circuit takes raw LDS data as private inputs, CSCA certificates as public inputs, and generates a proof (e.g., "Over 18").
3. **Commit:** Proof and Nullifier are sent to the Solana program.
4. **Verify:** Solana program verifies the ZK proof using the `noir_verifier` contract.
5. **Receipt:** On success, a `ProofReceipt` PDA is created, which the dApp checks to authorize the user.

## Patterns to Follow

### Pattern 1: Nullifiers for Sybil Resistance
**What:** A deterministic hash of the passport unique ID + secret salt.
**When:** To prevent a single passport from being used to create multiple accounts.
**Example:**
```typescript
const nullifier = sha256(passportNumber + userSecret);
// Store on Solana: ["nullifier", nullifier]
```

### Pattern 2: One-Time Heavy Proof / Recurring Light Proof
**What:** Generating a full passport proof is slow (30-120s). Instead, generate it once to create a "MinKYC Identity" (on-chain commitment), then use a faster "Membership Proof" for subsequent dApp log-ins.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Server-Side ZK Generation
**What:** Sending raw passport data to a server to generate the proof.
**Why bad:** Defeats the purpose of ZK-KYC; creates a massive security liability and violates "Privacy by Design."
**Instead:** Perform all cryptographic operations locally on the user's device (Solana Seeker).

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **Solana State** | Minimal. | PDAs are manageable. | Use Compression (State Compression) for receipts if needed. |
| **Latency** | 60s per proof is okay. | 60s is okay. | Need "Light Proof" optimization for frequent verifications. |

## Sources

- [Solana Seeker Architecture](https://solana.com/seeker)
- [Noir / Barretenberg Performance Reports](https://noir-lang.org/docs/)
