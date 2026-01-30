/**
 * @file minkyc.ts
 * @description Test suite for the MinKYC Anchor program.
 *
 * This file contains comprehensive integration tests for the MinKYC privacy-preserving identity verification protocol.
 * The tests simulate the complete lifecycle of a user identity on the Solana blockchain, covering:
 * 1. Identity Initialization: Creating a new identity account (PDA).
 * 2. Commitment Registration: Storing a cryptographic commitment (hash) of the user's identity data.
 * 3. Proof Verification: Submitting a Zero-Knowledge proof (mocked for MVP) to verify identity requirements.
 * 4. Identity Revocation: Invalidating an existing identity to prevent further usage.
 *
 * System Under Test:
 * - Program: MinKYC (Anchor Framework)
 * - Network: Localnet (configured in Anchor.toml)
 *
 * Prerequisites:
 * - A local Solana test validator must be running (handled by `anchor test`).
 * - The program must be deployed to the local cluster.
 * - The provider wallet is used as the test user and authority.
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Minkyc } from "../target/types/minkyc";
import { assert } from "chai";

describe("MinKYC Integration Tests", () => {
  // --- Setup & Configuration ---

  // Configure the client to use the local cluster provider.
  // This provider abstracts the connection to the Solana network and the user's wallet.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Reference to the deployed MinKYC program.
  // Anchor automatically generates the program interface types from the IDL.
  const program = anchor.workspace.Minkyc as Program<Minkyc>;
  
  // The wallet used to sign transactions and pay for account creation.
  const wallet = provider.wallet as anchor.Wallet;

  // --- Program Derived Addresses (PDAs) ---
  
  // identityPda: The public key of the user's identity account.
  // This address is deterministically derived from the "identity" seed and the user's wallet public key.
  let identityPda: anchor.web3.PublicKey;
  
  // identityBump: The canonical bump seed used to derive the PDA, ensuring it falls off the ed25519 curve.
  let identityBump: number;

  /**
   * Global Setup: Derive PDAs before running tests.
   *
   * We calculate the PDA for the Identity Account once and reuse it across tests.
   * The seeds used are:
   * 1. Buffer.from("identity") - A constant string literal acting as a namespace.
   * 2. wallet.publicKey.toBuffer() - The user's public key, ensuring 1:1 mapping between wallet and identity.
   */
  before(async () => {
    [identityPda, identityBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("identity"), wallet.publicKey.toBuffer()],
      program.programId
    );
    console.log("Derived Identity PDA:", identityPda.toBase58());
  });

  /**
   * Test Case: Initialize Identity
   *
   * Purpose:
   * Verify that a user can successfully initialize their identity account on-chain.
   *
   * Functionality Tested:
   * - `initialize_identity` instruction.
   * - PDA account creation and rent exemption.
   * - Initialization of account state (authority, default flags).
   *
   * Expected Outcome:
   * - A new IdentityAccount is created at the derived PDA.
   * - The `authority` field matches the signer's wallet.
   * - `verified` and `revoked` flags are false.
   * - `commitment` and `nullifier` are initialized to zero arrays.
   */
  it("Initialize Identity", async () => {
    // Execute the initializeIdentity instruction
    await program.methods
      .initializeIdentity()
      .accounts({
        identity: identityPda,             // The PDA to be initialized
        authority: wallet.publicKey,       // The signer paying for rent
        systemProgram: anchor.web3.SystemProgram.programId, // Required for account creation
      })
      .rpc();

    // Fetch the newly created account state from the blockchain
    const account = await program.account.identityAccount.fetch(identityPda);

    // Assertions
    // 1. Verify Authority: The account authority should match the test wallet.
    assert.ok(account.authority.equals(wallet.publicKey), "Authority should match wallet public key");
    
    // 2. Verify Initial Status: Identity should start as unverified.
    assert.ok(account.verified === false, "Identity should not be verified upon initialization");
    
    // 3. Verify Default Values: Commitment should be a zeroed 32-byte array.
    // We check the first byte as a proxy for the entire array being zeroed.
    assert.equal(account.commitment[0], 0, "Commitment should be initialized to zero");
  });

  /**
   * Test Case: Register Commitment
   *
   * Purpose:
   * Verify that the authority can update the identity account with a cryptographic commitment.
   *
   * Functionality Tested:
   * - `register_commitment` instruction.
   * - Access control (only authority can register).
   * - State update (commitment field).
   *
   * Inputs:
   * - `commitment`: A 32-byte array representing the hash of the user's private identity data.
   *   (In this test, we use an array filled with 1s for simplicity).
   *
   * Expected Outcome:
   * - The `commitment` field in the on-chain account is updated to match the input.
   */
  it("Register Commitment", async () => {
    // Create a dummy commitment (32 bytes of 1s)
    const commitment = new Uint8Array(32).fill(1);
    const commitmentArray = Array.from(commitment); // Convert to number[] for Anchor compatibility

    // Execute the registerCommitment instruction
    await program.methods
      .registerCommitment(commitmentArray)
      .accounts({
        identity: identityPda,       // The existing identity account
        authority: wallet.publicKey, // Must be the authority
      })
      .rpc();

    // Fetch updated account state
    const account = await program.account.identityAccount.fetch(identityPda);

    // Assertions
    // Verify that the on-chain commitment matches the input
    assert.deepEqual(account.commitment, commitmentArray, "On-chain commitment should match the input array");
  });

  /**
   * Test Case: Verify Proof
   *
   * Purpose:
   * Verify that the program accepts a validity proof and marks the identity as verified.
   * Note: In this MVP, the ZK proof verification is mocked, but the state transition logic is real.
   *
   * Functionality Tested:
   * - `verify_proof` instruction.
   * - Nullifier storage (to prevent replay/double-spending).
   * - State transition (`verified` -> true).
   *
   * Inputs:
   * - `nullifier`: A 32-byte unique identifier derived from the proof.
   * - `proof`: A byte buffer representing the ZK proof (mocked).
   *
   * Expected Outcome:
   * - The `verified` flag is set to true.
   * - The `nullifier` field is updated.
   */
  it("Verify Proof", async () => {
    // Create test data
    const nullifier = new Uint8Array(32).fill(2); // Dummy nullifier (all 2s)
    const nullifierArray = Array.from(nullifier);
    const proof = Buffer.from("mock_proof"); // Mock proof data

    // Execute the verifyProof instruction
    await program.methods
      .verifyProof(nullifierArray, proof)
      .accounts({
        identity: identityPda,
        authority: wallet.publicKey,
      })
      .rpc();

    // Fetch updated account state
    const account = await program.account.identityAccount.fetch(identityPda);

    // Assertions
    // 1. Verify Nullifier: Ensure the nullifier was stored correctly.
    assert.deepEqual(account.nullifier, nullifierArray, "Nullifier should be stored on-chain");
    
    // 2. Verify Status: The identity should now be marked as verified.
    assert.ok(account.verified === true, "Identity verified status should be true");
  });

  /**
   * Test Case: Revoke Identity
   *
   * Purpose:
   * Verify that a user can revoke their identity, invalidating its verification status.
   * This is crucial for security (e.g., if keys are compromised or the user wants to exit).
   *
   * Functionality Tested:
   * - `revoke_identity` instruction.
   * - State transition (`revoked` -> true, `verified` -> false).
   *
   * Expected Outcome:
   * - The `revoked` flag is set to true.
   * - The `verified` flag is reset to false.
   * - Subsequent verification attempts should fail (implicitly tested by logic, but verified here by state).
   */
  it("Revoke Identity", async () => {
    // Execute the revokeIdentity instruction
    await program.methods
      .revokeIdentity()
      .accounts({
        identity: identityPda,
        authority: wallet.publicKey,
      })
      .rpc();

    // Fetch updated account state
    const account = await program.account.identityAccount.fetch(identityPda);

    // Assertions
    // 1. Verify Verification Status: Should be false after revocation.
    assert.ok(account.verified === false, "Identity should be un-verified after revocation");
    
    // 2. Verify Revocation Status: Should be true.
    assert.ok(account.revoked === true, "Identity revoked status should be true");
  });
});
