import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Minkyc } from "../../../target/types/minkyc";
import IDL from "../../../target/idl/minkyc.json";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import fs from 'fs';
import os from 'os';

export function getProvider() {
    // Default to devnet
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    // Load wallet from ~/.config/solana/id.json or env
    const walletPath = process.env.ANCHOR_WALLET || os.homedir() + "/.config/solana/id.json";
    const walletKeypair = Keypair.fromSecretKey(
        Buffer.from(JSON.parse(fs.readFileSync(walletPath, 'utf-8')))
    );
    const wallet = new anchor.Wallet(walletKeypair);

    const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "confirmed",
    });
    return provider;
}

export function getProgram(provider: anchor.AnchorProvider) {
    // Program ID from IDL
    const programId = new PublicKey(IDL.address);
    return new Program(IDL as any, provider) as Program<Minkyc>;
}
