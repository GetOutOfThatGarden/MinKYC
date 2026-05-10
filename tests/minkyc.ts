import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Minkyc } from "../target/types/minkyc";
import { PublicKey, Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("minkyc privacy layer", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.minkyc as Program<Minkyc>;
  const provider = anchor.getProvider();

  let identityPda: PublicKey;
  let identityCounterPda: PublicKey;
  const commitment = Array(32).fill(1); // Mock commitment

  before(async () => {
    [identityCounterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("identity_counter"), provider.publicKey.toBuffer()],
      program.programId
    );
    
    // We assume index 0 for the first identity
    const indexLe = Buffer.alloc(8);
    indexLe.writeBigUInt64LE(BigInt(0));
    [identityPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("identity"), provider.publicKey.toBuffer(), indexLe],
      program.programId
    );
  });

  it("Initializes a sovereign identity", async () => {
    await program.methods
      .initialize(commitment)
      .accounts({
        identityCounter: identityCounterPda,
        identity: identityPda,
        owner: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.identity.fetch(identityPda);
    expect(account.owner.toBase58()).to.equal(provider.publicKey.toBase58());
    expect(account.verificationCount.toNumber()).to.equal(0);
  });

  it("Fails if proof binding is incorrect (wrong signer)", async () => {
    const wrongSigner = Keypair.generate();
    
    // Mock public inputs: [current_date, verifier_id, caller_pubkey, commitment]
    // caller_pubkey (index 2) is provider.publicKey, but wrongSigner is signing
    const publicInputs = [
      Array(32).fill(0), // date
      Array(32).fill(0), // verifier
      provider.publicKey.toBuffer(), // caller_pubkey
      Buffer.from(commitment), // commitment
    ];

    const nullifierPda = PublicKey.findProgramAddressSync(
      [Buffer.from("nullifier"), publicInputs[2]],
      program.programId
    )[0];

    try {
      await program.methods
        .verifyProof(Buffer.from([]), publicInputs, new anchor.BN(0))
        .accounts({
          identity: identityPda,
          nullifierReceipt: nullifierPda,
          verifier: wrongSigner.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([wrongSigner])
        .rpc();
      expect.fail("Should have failed proof binding");
    } catch (err: any) {
      expect(err.message).to.contain("ProofBindingFailed");
    }
  });

  it("Prevents proof replay using Nullifiers", async () => {
    const publicInputs = [
      Array(32).fill(0),
      Array(32).fill(0),
      provider.publicKey.toBuffer(),
      Buffer.from(commitment),
    ];

    const nullifierPda = PublicKey.findProgramAddressSync(
      [Buffer.from("nullifier"), publicInputs[2]],
      program.programId
    )[0];

    // First verification
    await program.methods
      .verifyProof(Buffer.from([]), publicInputs, new anchor.BN(0))
      .accounts({
        identity: identityPda,
        nullifierReceipt: nullifierPda,
        verifier: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Second verification with same nullifier (caller_pubkey in this demo)
    try {
      await program.methods
        .verifyProof(Buffer.from([]), publicInputs, new anchor.BN(0))
        .accounts({
          identity: identityPda,
          nullifierReceipt: nullifierPda,
          verifier: provider.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      expect.fail("Should have failed replay protection");
    } catch (err: any) {
      // Anchor throws 'already in use' if account exists and we try to init
      expect(err.message).to.contain("already in use");
    }
  });
});
