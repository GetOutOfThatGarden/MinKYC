import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Define the connection to the Solana Devnet
export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// TODO: Replace with actual deployed MinKYC program ID on Devnet
export const MINKYC_PROGRAM_ID = new PublicKey('MinKYC1111111111111111111111111111111111111');

/**
 * Utility to verify if an address is valid
 * @param address Base58 formatted address
 * @returns boolean
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
 * Derives the Identity PDA for a given wallet address
 * @param walletAddress The user's public key
 * @returns { pda: PublicKey, bump: number }
 */
export const getIdentityPda = (walletAddress: PublicKey): { pda: PublicKey, bump: number } => {
    const [pda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from('identity'), walletAddress.toBuffer()],
        MINKYC_PROGRAM_ID
    );
    return { pda, bump };
};
