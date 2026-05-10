# Research Summary: MinKYC Regulatory & Ecosystem Landscape

**Domain:** Privacy-Preserving Identity / ZK-KYC
**Researched:** 2024-05-23
**Overall confidence:** HIGH

## Executive Summary

MinKYC is positioned at the intersection of blockchain scalability (Solana), hardware-backed identity (NFC Passports), and emerging privacy regulations (eIDAS 2.0, UK DIATF). The research confirms that Zero-Knowledge KYC is becoming a regulatory requirement in the EU and UK for platforms seeking to satisfy AML/KYC mandates without violating GDPR's data minimization principles. 

A critical technical discovery is the need for a robust **Nullifier-based Replay Protection** system. The current PDA-based receipt strategy reveals the link between identity and verification, which is a major privacy pitfall. Transitioning to nullifiers and implementing proof binding (to prevent front-running) is essential for production security.

## Key Findings

**Stack:** Solana (Anchor), Noir (ZK Circuits), React Native (Mobile NFC), ICAO 9303 (Passport Standard).
**Architecture:** On-device ZK proof generation from NFC data; on-chain verification using Nullifier Registry PDAs.
**Critical pitfall:** **Privacy Leaks via PDA Seeds**. Current receipt pattern links verifications to public identity PDAs. **Nullifiers** must be used instead.

## Implications for Roadmap

Based on research, suggested phase structure:

1.  **Phase 1: Core ZK-Passport Circuit** - Implement Noir circuits for SHA-256 and RSA signature verification (ICAO SOD).
2.  **Phase 2: Mobile NFC & ZK Integration** - Enable mobile reading of ICAO LDS and local proof generation.
3.  **Phase 3: Privacy & Replay Protection** - Implement **Nullifiers** in Noir and **Nullifier Registry** in Anchor. Add **Proof Binding** to prevent front-running.
4.  **Phase 4: Scalability (ZK Compression)** - Integrate Light Protocol for low-cost nullifier storage at scale.
5.  **Phase 5: Regulatory Compliance Layer** - Implement "Lawful Intercept" (Identity Escrow) and align with eIDAS 2.0 / UK DIATF standards.

**Phase ordering rationale:**
- Technical feasibility (ZK circuits) is the highest risk.
- Privacy and security (Nullifiers/Binding) must be established before any real-world pilot or audit.
- Scalability (Compression) is prioritized after security to handle growth.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Solana/Noir is a proven combination; NFC/ICAO is a global standard. |
| Features | MEDIUM | Regulatory "Lawful Intercept" needs careful implementation to avoid centralizing privacy. |
| Architecture | HIGH | Nullifier + On-chain registry is the industry standard for ZK privacy. |
| Pitfalls | HIGH | Performance and privacy leak patterns are well-understood. |

## Gaps to Address

- **Performance Benchmarking:** Exact latency on Solana Seeker for full RSA verification in Noir.
- **Identity Escrow:** Detailed mechanism for "Lawful Intercept" that doesn't compromise the "Privacy by Design" principle.
- **UK Certification:** Mapping the specific GPG45 identity profiles to the ZK circuit outputs.
