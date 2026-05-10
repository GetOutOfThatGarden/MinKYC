import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import * as BN from 'bn.js';

// Define the connection to the Solana Devnet
export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Current Devnet Program ID
export const MINKYC_PROGRAM_ID = new PublicKey('9zzT4KdUh7TEtiR8ioTMhDLWDa4c6ymzAjQsYYfvc3h1');

/**
 * Utility to verify if an address is valid
 */
export const isValidAddress = (address: string): boolean => {
    try {
        const pubkey = new PublicKey(address);
        return PublicKey.isOnCurve(pubkey.toBuffer());
    } catch {
        return false;
    }
};

/**
 * Derives the Identity PDA for a given wallet address and index
 */
export const getIdentityPda = (walletAddress: PublicKey, index: number = 0): { pda: PublicKey, bump: number } => {
    const indexLe = new BN(index).toArrayLike(Buffer, 'le', 8);
    const [pda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from('identity'), walletAddress.toBuffer(), indexLe],
        MINKYC_PROGRAM_ID
    );
    return { pda, bump };
};

/**
 * Derives the Nullifier PDA
 */
export const getNullifierPda = (nullifier: Buffer): { pda: PublicKey, bump: number } => {
    const [pda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from('nullifier'), nullifier],
        MINKYC_PROGRAM_ID
    );
    return { pda, bump };
};
