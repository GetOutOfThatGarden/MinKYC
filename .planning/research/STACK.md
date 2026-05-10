# Technology Stack

**Project:** MinKYC
**Researched:** 2025-05-24

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Solana (Anchor) | Latest | Blockchain / PDAs | High throughput, low cost, strong support for ZK verifiers. |
| Noir | Latest | ZK DSL | Rust-like syntax, compiles to Barretenberg (optimized for WASM/Mobile). |
| React Native | Latest | Mobile App | Cross-platform, handles NFC via `react-native-nfc-manager`. |

### ZK Engine (Mobile)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Barretenberg | Latest | ZK Backend | Highly optimized C++ backend for Noir; usable in mobile via WASM or JNI. |
| WebAssembly | - | Proof Generation | Standard for running heavy ZK computations in cross-platform environments. |

### Standards
| Standard | Purpose | Why |
|----------|---------|-----|
| ICAO 9303 | Passport NFC | Global standard for electronic travel documents. |
| eIDAS 2.0 ARF | Regulatory Alignment | Mandatory for EU digital identity compliance. |
| UK DIATF | Regulatory Alignment | Framework for UK identity trust. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @solana/web3.js | Latest | Blockchain Comm | Connecting Mobile/Website to Solana. |
| react-native-nfc-manager | Latest | NFC Access | Reading passport chips on Android/iOS. |
| @noir-lang/noir_js | Latest | ZK Interaction | Orchestrating proof generation in TS/JS. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| ZK DSL | Noir | Circom | Noir is more ergonomic and integrates better with the Solana/Rust ecosystem. |
| Proof System | Plonk (Barretenberg) | Groth16 | Groth16 requires a per-circuit trusted setup; Plonk is universal. |

## Installation

```bash
# Mobile Dependencies
cd mobile/App
npm install react-native-nfc-manager @noir-lang/noir_js @noir-lang/backend_barretenberg

# Circuit Development
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup
```

## Sources

- [Noir Documentation](https://noir-lang.org/docs/)
- [Solana Developers](https://solana.com/developers)
- [eIDAS ARF Specification](https://github.com/eu-digital-identity-wallet/architecture-and-reference-framework)
