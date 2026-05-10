# Domain Pitfalls

**Domain:** Privacy-Preserving Identity (ZK-KYC)
**Researched:** 2025-05-24

## Critical Pitfalls

### Pitfall 1: Mobile ZK Latency (The "UX Wall")
**What goes wrong:** Generating a ZK proof for RSA-4096 (standard for many passports) on a mobile device can take several minutes or crash the app due to memory limits.
**Prevention:** 
- Use the most optimized ZK backend (Barretenberg).
- Implement the "One-time Heavy / Recurring Light" proof model.
- Use a "Loading" UI that explains the cryptographic process to the user.

### Pitfall 2: Compromised Nullifiers
**What goes wrong:** If the salt used for the nullifier is lost or the hashing algorithm is weak, users can be tracked or their identity can be linked across different applications.
**Prevention:** Use a strong, user-derived salt (stored in Secure Enclave) and standard SHA-256 for nullifiers.

### Pitfall 3: CSCA Certificate Management
**What goes wrong:** The ZK circuit must verify the passport against a "Country Signing Certification Authority" (CSCA) certificate. If these certificates are outdated or missing, legitimate passports will fail verification.
**Prevention:** Maintain an up-to-date "ICAO Master List" of CSCA certificates as public inputs or a trusted on-chain registry.

## Moderate Pitfalls

### Pitfall 4: NFC Compatibility
**What goes wrong:** Different countries use different ICAO LDS versions (e.g., BAC vs. PACE vs. SAC). Some mobile devices have weak NFC antennas.
**Prevention:** Use a robust library like `react-native-nfc-manager` and provide clear "how-to" animations for passport placement.

## Minor Pitfalls

### Pitfall 5: Solana Account Rent
**What goes wrong:** Creating a `ProofReceipt` PDA for every verification can become expensive in terms of Solana rent.
**Prevention:** Design the program to allow users or dApps to close receipts after use to reclaim SOL, or use a subscription-based model.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| ZK Circuits | RSA signature complexity | Use pre-optimized Noir libraries for RSA/BigInt. |
| Mobile App | Memory overhead | Monitor WASM memory usage closely on Android/iOS. |
| Regulatory | AML Traceability | Design the "Lawful Intercept" path early, even if implemented later. |

## Sources

- [ICAO Master List](https://www.icao.int/Security/FAL/PKD/Pages/ICAO-Master-List.aspx)
- [Aztec / Noir Community Discussions on Mobile ZK](https://forum.aztec.network/)
