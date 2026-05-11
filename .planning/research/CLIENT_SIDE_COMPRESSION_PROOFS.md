# Client-Side State Proof Research: Light Protocol

**Project:** MinKYC
**Domain:** ZK Compression & Client-Side Proofs
**Researched:** 2024-05-24
**Confidence:** HIGH

## Overview

Light Protocol's **ZK Compression (v3)** enables "stateless" transactions on Solana by storing account data in off-chain Merkle trees (maintained by indexers) and verifying state transitions on-chain via ZK-SNARKs. Client-side interaction involves retrieving Merkle inclusion proofs and validity proofs from specialized RPC nodes to "spend" or "verify" compressed state.

## 1. Proof Generation & Retrieval Flow

In ZK Compression, "proof generation" is typically split into two components:
1.  **Merkle Inclusion Proof**: Proves a specific compressed account exists in the state tree.
2.  **ZK Validity Proof (SNARK)**: Proves the state transition follows protocol rules without revealing the entire tree.

### High-Level Retrieval (SDK)
The `@lightprotocol/stateless.js` SDK provides high-level methods to fetch everything needed for a transaction in one call.

| Method | Purpose | Returns |
|--------|---------|---------|
| `getValidityProofV0` | Full proof for transaction | Merkle path + SNARK proof |
| `getCompressedAccountProof` | Merkle inclusion only | Merkle path, root, leaf index |

### Manual Proof Retrieval (RPC)
If building custom logic or using a mobile SDK without full `stateless.js` support, you can query the **Photon RPC** directly:

```json
{
  "jsonrpc": "2.0",
  "method": "getCompressedAccountProof",
  "params": { "address": "COMPRESSED_ACCOUNT_ADDRESS" }
}
```

## 2. Compressed Nullifiers

"Compressed Nullifiers" are a specialized application of ZK Compression used to prevent double-spending or replay attacks in a privacy-preserving or rent-free manner.

### The Nullifier Pattern
1.  **Identify**: Generate a unique `id` (32-byte hash) for the action.
2.  **Derive**: Compute the compressed PDA address using `deriveNullifierAddress(id)`.
3.  **Check**: Query the indexer to see if the nullifier already exists.
4.  **Spend**: Include an instruction to "create" (nullify) this PDA. If it already exists, the transaction fails.

### SDK: `@lightprotocol/nullifier-program`
This library simplifies the nullifier lifecycle:

```typescript
import { createRpc } from "@lightprotocol/stateless.js";
import { createNullifierIx, fetchProof } from "@lightprotocol/nullifier-program";

const rpc = createRpc("https://mainnet.helius-rpc.com/?api-key=YOUR_KEY");

// 1. Fetch proof that the nullifier is available (or get its state)
const proof = await fetchProof(rpc, id);

// 2. Create the instruction to "spend" the nullifier
const nullifierIx = await createNullifierIx(rpc, payer.publicKey, id);
```

## 3. RPC & Infrastructure Requirements

Standard Solana RPCs do not support ZK Compression. You must use a **Photon-enabled RPC**.

### Essential Components
- **Photon**: The indexer that tracks the Merkle tree and compressed account state.
- **Prover**: A specialized node that generates the ZK-SNARK (Groth16) validity proofs.
- **Provider**: **Helius** is the primary provider for Photon/Prover infrastructure on Solana.

### RPC Endpoints
- **Mainnet**: `https://mainnet.helius-rpc.com/?api-key=<key>`
- **Devnet**: `https://devnet.helius-rpc.com/?api-key=<key>`

## 4. Mobile & SDK Implementation

### React Native (Solana Seeker / Generic Mobile)
- **SDK**: `@lightprotocol/stateless.js` is the standard.
- **Polyfills**: Requires `Buffer`, `crypto`, and `process` polyfills.
- **Performance**:
    - **Delegated Proving (Default)**: The mobile app fetches the SNARK from the Prover RPC. Fast (<500ms) and low-resource.
    - **Client-side Proving**: Requires running a ZK circuit (e.g., Noir) on-device. The app retrieves the Merkle inclusion proof from Photon and generates its own SNARK.

### Native Android (Kotlin)
For native Android development (idiomatic for Solana Seeker), use the **Artemis SDK**:
- **Dependency**: `xyz.selenus:artemis-privacy`
- **Purpose**: Unified Kotlin client for ZK compression and privacy features.
- **Methods**: Provides Kotlin-native wrappers for Photon RPC calls and ZK proof handling.

### Recommended SDK Methods for Proofs
| Requirement | Method (TS) | Method (Kotlin/Artemis) |
|-------------|-------------|-------------------------|
| **Retrieve Merkle Path** | `rpc.getCompressedAccountProof` | `photon.getCompressedAccountProof` |
| **Check if Nullifier Spent** | `rpc.getCompressedAccount` | `photon.getCompressedAccount` |
| **Fetch Full Validity Proof** | `rpc.getValidityProofV0` | `photon.getValidityProof` |
| **Identity/Nullifier Proof** | `fetchProof(rpc, id)` | Included in Artemis Privacy module |

## 5. Potential Pitfalls

- **Proof Staleness**: Merkle proofs are tied to a specific root. If the tree updates before your transaction lands, the proof is invalid. High-traffic apps should use **Replay Protection** and potentially retry logic.
- **Prover Latency**: While Helius Provers are fast, they are a centralized dependency for proof generation unless you implement client-side SNARKs.
- **Address Collisions**: Ensure nullifier IDs are globally unique to avoid accidental blocking of actions.

## Sources
- [ZK Compression Documentation](https://www.zkcompression.com)
- [Helius Photon RPC Reference](https://docs.helius.dev/solana-compression/zk-compression)
- [Light Protocol GitHub](https://github.com/lightprotocol/light-protocol)
- [Artemis SDK (Selenus)](https://selenus.xyz)
- [Nullifier Program GitHub](https://github.com/Lightprotocol/nullifier-program)
