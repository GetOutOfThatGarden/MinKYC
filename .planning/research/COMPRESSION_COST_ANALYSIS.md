# Cost Analysis: Standard PDA vs. ZK Compression (Light Protocol)

**Project:** MinKYC
**Domain:** Scalable Privacy-Preserving Compliance
**Target:** 1,000,000 KYC Nullifiers
**Researched:** 2024-05-23
**Confidence:** HIGH

## Executive Summary

To scale MinKYC to millions of users, the storage of "nullifiers" (receipts ensuring a passport isn't used twice) represents the largest single cost. Standard Solana PDA storage for 1 million records costs approximately **1,169 SOL**, whereas ZK Compression reduces this upfront cost to just **0.4 SOL**.

However, ZK Compression introduces recurring infrastructure requirements (Photon Indexer) and higher per-transaction compute costs. This analysis concludes that ZK Compression is the only viable path for mass-market KYC, but requires a strategic decision between self-hosting infrastructure vs. managed services.

---

## 1. Standard Solana PDA Storage

In the standard model, every verification creates a "Nullifier Record" account on-chain to prevent replay attacks.

### Cost Breakdown (per record)
| Component | Size/Value | Cost (SOL) |
|-----------|------------|------------|
| Data | 40 bytes (8 byte disc. + 32 byte nullifier) | - |
| Metadata | 128 bytes (Solana account overhead) | - |
| **Total Size** | **168 bytes** | **0.00116928** |

### Total for 1,000,000 Users
*   **Rent Deposit:** 1,169.28 SOL
*   **USD Value (@ $150/SOL):** ~$175,392
*   **Transaction Fee:** 0.000005 SOL (x 1M = 5 SOL)
*   **Compute Budget:** Standard (minimal)

**Verdict:** Prohibitively expensive for a low-margin compliance service.

---

## 2. ZK Compression (Light Protocol)

ZK Compression stores the actual data in the Solana ledger (calldata) and only maintains a Merkle Root in account state.

### Cost Breakdown (per record)
| Component | Cost (SOL) | Notes |
|-----------|------------|-------|
| **On-chain Creation** | ~0.0000004 | Leaf creation fee |
| **Transaction Fee** | ~0.0000050 | Standard Solana fee |
| **Total Upfront** | **0.0000054** | **~216x cheaper than PDA** |

### Total for 1,000,000 Users
*   **Upfront Cost:** 0.4 SOL (Storage) + 5 SOL (Fees) = **5.4 SOL**
*   **USD Value (@ $150/SOL):** ~$810
*   **Compute Budget:** ~292,000 CU (Requires priority fees to ensure landing)

---

## 3. Infrastructure & Operational Costs

Unlike standard PDAs, compressed state cannot be queried via standard `getAccountInfo` RPC calls.

### A. The Photon Indexer
You must run or pay for a "Photon" indexer to reconstruct the state from ledger data and generate validity proofs.

| Option | Monthly Cost | Pros | Cons |
|--------|--------------|------|------|
| **Self-Hosted** | ~$30 - $60 | Fixed cost, full control | DevOps overhead, sync lag |
| **Managed (Helius)**| ~$49 - $2,999| Zero maintenance, high perf | Credit-based pricing (Expensive at scale) |

**Scale Impact (1M Users):**
A managed service like Helius would cost ~$3,000/month (Business Plan) to handle the 110M+ credits required for 1M validity proof lookups. Self-hosting remains the most cost-effective path for high-volume production.

### B. Prover/Relayer Costs
If MinKYC provides a "gasless" experience for users:
*   **Proof Generation:** Required for every `verify` transaction.
*   **Compute Units:** 292k CU is nearly 1.5x the default 200k limit. Higher priority fees (e.g., 0.0001 SOL per tx) may be required during congestion.
*   **Total Relayer Expense (1M txs):** ~105 SOL ($15,750) including priority fees.

---

## 4. Comparative Matrix

| Feature | Standard PDA | ZK Compression |
|---------|--------------|----------------|
| **Upfront Cost (1M)** | **1,169 SOL** | **5.4 SOL** |
| **Recurring Cost** | $0 | ~$30 - $3,000/mo |
| **Data Availability** | On-chain (Account) | Ledger (Calldata) |
| **Complexity** | Low | High (Needs Prover/Indexer) |
| **Performance** | Fast | Slower (Proof generation time) |

---

## 5. Strategic Recommendation

1.  **MVP (Phase 1-2):** Use **Standard PDAs**. The cost for the first 1,000 users (~1.1 SOL) is negligible compared to the development speed of using standard Anchor accounts.
2.  **Scale (Phase 3+):** Migrate to **ZK Compression**.
    *   **Architecture:** Self-host the Photon indexer to keep recurring costs under $100/mo.
    *   **User Experience:** Use a Relayer to handle the 292k CU transactions, charging platforms a small fee in USDC to cover the SOL/Infrastructure costs.

## Sources
*   [Helius: ZK Compression Guide](https://www.helius.dev/blog/zk-compression-on-solana)
*   [Light Protocol Documentation](https://docs.lightprotocol.com/)
*   [Solana Rent Calculator](https://solanarentcalculator.com/)
*   [Triton One: Photon Indexing Services](https://triton.one/)
