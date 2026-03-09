/**
 * Secure Storage Utility
 * Encrypts and persists passport data locally on-device.
 * Data NEVER leaves the device — only cryptographic commitments go on-chain.
 */

import EncryptedStorage from 'react-native-encrypted-storage';
import { PassportData } from '../constants/mockProfiles';
import { clearHistory } from './historyStorage';

const PASSPORT_KEY = 'minkyc_passport_data';
const COMMITMENT_KEY = 'minkyc_commitment';
const LOCAL_WALLET_KEY = 'minkyc_local_wallet_secret';

/**
 * Save passport data securely (encrypted at rest)
 */
export async function savePassportData(data: PassportData): Promise<void> {
  await EncryptedStorage.setItem(PASSPORT_KEY, JSON.stringify(data));
}

/**
 * Retrieve stored passport data
 */
export async function getPassportData(): Promise<PassportData | null> {
  const raw = await EncryptedStorage.getItem(PASSPORT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PassportData;
  } catch {
    return null;
  }
}

/**
 * Check if passport data exists
 */
export async function hasPassportData(): Promise<boolean> {
  const raw = await EncryptedStorage.getItem(PASSPORT_KEY);
  return !!raw;
}

/**
 * Clear all stored data (passport, commitment, and wallet key)
 * Used when the user resets their identity from Settings.
 */
export async function clearAllData(): Promise<void> {
  try { await EncryptedStorage.removeItem(PASSPORT_KEY); } catch {}
  try { await EncryptedStorage.removeItem(COMMITMENT_KEY); } catch {}
  try { await EncryptedStorage.removeItem(LOCAL_WALLET_KEY); } catch {}
  try { await clearHistory(); } catch {}
}

/**
 * Compute a commitment hash from passport data + secret.
 * This is the value that goes on-chain — the passport data itself NEVER does.
 * 
 * commitment = SHA-256(surname + givenNames + dateOfBirth + nationality + secret)
 * 
 * For production, this would match the Noir circuit's commitment computation.
 * For the prototype, we use a simple string hash.
 */
export function computeCommitment(data: PassportData, secret: string): string {
  const input = [
    data.surname,
    data.givenNames,
    data.dateOfBirth.replace(/-/g, ''),
    data.nationality,
    secret,
  ].join('|');
  
  // Simple deterministic hash for prototype
  // In production, use the same hash function as the Noir circuit
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to a hex-like string padded to 64 chars (simulating SHA-256)
  const base = Math.abs(hash).toString(16).padStart(8, '0');
  return (base.repeat(8)).slice(0, 64);
}

/**
 * Save the computed commitment
 */
export async function saveCommitment(commitment: string): Promise<void> {
  await EncryptedStorage.setItem(COMMITMENT_KEY, commitment);
}

/**
 * Get the stored commitment
 */
export async function getCommitment(): Promise<string | null> {
  return await EncryptedStorage.getItem(COMMITMENT_KEY);
}
