import { Connection, clusterApiUrl } from '@solana/web3.js';

// Define the connection to the Solana Devnet
export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Mock program ID for the MinKYC protocol
export const MINKYC_PROGRAM_ID = 'MinKYC1111111111111111111111111111111111111';

/**
 * Utility to verify if an address is valid
 * @param address Base58 formatted address
 * @returns boolean
 */
export const isValidAddress = (address: string): boolean => {
    try {
        return address.length >= 32 && address.length <= 44; // Basic check
    } catch {
        return false;
    }
};
