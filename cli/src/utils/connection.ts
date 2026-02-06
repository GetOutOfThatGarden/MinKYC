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
    
    // Check for AGENT_WALLET_SECRET_KEY env var (Base64 encoded)
    if (process.env.AGENT_WALLET_SECRET_KEY) {
        const secretKey = Buffer.from(process.env.AGENT_WALLET_SECRET_KEY, 'base64');
        const walletKeypair = Keypair.fromSecretKey(secretKey);
        const wallet = new anchor.Wallet(walletKeypair);
        const provider = new anchor.AnchorProvider(connection, wallet, {
            preflightCommitment: "confirmed",
        });
        return provider;
    }
    
    // Load wallet from ~/.config/solana/id.json or env
    const walletPath = process.env.ANCHOR_WALLET || os.homedir() + "/.config/solana/id.json";
    
    if (!fs.existsSync(walletPath)) {
        throw new Error(`Wallet not found at ${walletPath}. Set AGENT_WALLET_SECRET_KEY or ANCHOR_WALLET env var.`);
    }
    
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
