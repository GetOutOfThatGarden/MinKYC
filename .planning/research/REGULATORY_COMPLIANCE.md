# Regulatory Compliance: ZK-KYC in the UK & EU

**Project:** MinKYC
**Researched:** 2025-05-24
**Confidence:** HIGH

## Executive Summary

The regulatory environment in the UK and EU is shifting from a model of "data collection and storage" to "attribute verification and data minimization." Zero-Knowledge Proofs (ZKPs) are explicitly recognized in emerging frameworks (eIDAS 2.0, UK DIATF) as a primary Privacy-Enhancing Technology (PET) to resolve the conflict between AML/KYC mandates and privacy laws (GDPR).

## 1. European Union (EU) Landscape

### GDPR (General Data Protection Regulation)
ZK-KYC is the technical realization of GDPR's core principles:
*   **Data Minimization (Art. 5):** Verifiers receive only the *result* of a check (e.g., "User is > 18") rather than the underlying PII (Date of Birth).
*   **Privacy by Design (Art. 25):** ZKPs embed privacy into the architecture rather than relying on policy.
*   **Right to Erasure (Art. 17):** Since the verifier never holds PII, there is no "toxic data" to delete, simplifying compliance for dApps.

### eIDAS 2.0 (Regulation EU 2024/1183)
The most critical regulation for MinKYC. It introduces the **EU Digital Identity Wallet (EUDIW)**.
*   **Selective Disclosure:** Mandates that wallets allow users to share only specific attributes.
*   **Unlinkability:** The Architecture and Reference Framework (ARF) v1.4+ specifies ZKPs as the method to prevent verifiers from tracking users across different platforms.
*   **Timeline:** Member States must provide compliant wallets by late 2026. MinKYC's on-device ZK generation aligns perfectly with this trajectory.

### AMLD6 & AML Regulation (AMLR)
*   **High Assurance:** Requires "Strong Customer Authentication." MinKYC satisfies this by verifying the government-signed NFC chip in ICAO 9303 passports.
*   **Lawful Intercept:** AML mandates often require "traceability." MinKYC must consider a "Trusted Issuer" model or "Escrowed Reveal" keys to allow regulated entities to reveal identity under a valid court order.

## 2. United Kingdom (UK) Landscape

### UK Digital Identity and Attributes Trust Framework (DIATF)
The DIATF sets the standard for digital identity providers in the UK.
*   **GPG45 Compliance:** Identity verification must map to specific "Levels of Confidence" (LoA). MinKYC's NFC-based verification typically maps to "High" or "Very High" confidence profiles.
*   **Certification:** To be viable for UK financial institutions, MinKYC or its underlying issuer must be certified by an accredited Conformity Assessment Body (CAB).

### JMLSG Guidance
The Joint Money Laundering Steering Group recognizes **cryptographic verification** of primary identity documents (passports) as a valid sole source for Customer Due Diligence (CDD).

## 3. Technical Standards Alignment

| Standard | MinKYC Implementation | Regulatory Value |
| :--- | :--- | :--- |
| **ICAO 9303** | Reads LDS (DG1, SOD) via NFC | Provenance from a sovereign government. |
| **ISO/IEC 18013-5** | mDL (Mobile Driving License) standards | Alignment with future eIDAS wallet formats. |
| **ARF v1.4 (eIDAS)** | Noir Circuits for Selective Disclosure | Matches EU-mandated privacy outcomes. |

## 4. Compliance Strategy for MinKYC

1.  **Identity Commitment (Nullifiers):** Use a "Nullifier" (hash of passport number + secret) to prevent a single passport from creating multiple identities without revealing the passport number.
2.  **Trusted Issuer Path:** While dApps see only ZK proofs, MinKYC should allow for a regulated "Identity Issuer" who holds the link to the PII, ensuring AML "Lawful Intercept" requirements are met.
3.  **Circuit Audits:** Ensure the Noir circuits for RSA/SHA-256 are audited to prove they correctly verify the ICAO SOD signature against the government CSCA list.

## Sources

- [EU Regulation 2024/1183 (eIDAS 2.0)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1183)
- [UK Digital Identity and Attributes Trust Framework](https://www.gov.uk/government/publications/uk-digital-identity-and-attributes-trust-framework-updated-version)
- [eIDAS ARF v1.4.0 Technical Specifications](https://github.com/eu-digital-identity-wallet/architecture-and-reference-framework)
- [ICAO Doc 9303 (Machine Readable Travel Documents)](https://www.icao.int/publications/pages/publication.aspx?docnum=9303)
