import EncryptedStorage from 'react-native-encrypted-storage';
import { VerificationHistoryItem } from '../types/verification';

const HISTORY_KEY = 'minkyc_verification_history';

/**
 * Save a new VerificationHistoryItem to secure storage.
 * Prepends the item to the existing list.
 */
export async function saveHistoryItem(item: VerificationHistoryItem): Promise<void> {
  try {
    const existingHistory = await getHistory();
    const updatedHistory = [item, ...existingHistory];
    await EncryptedStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save history item', error);
  }
}

/**
 * Retrieve all stored VerificationHistoryItems.
 * Returns an empty array if none exist.
 */
export async function getHistory(): Promise<VerificationHistoryItem[]> {
  try {
    const raw = await EncryptedStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as VerificationHistoryItem[];
  } catch (error) {
    console.error('Failed to get history', error);
    return [];
  }
}

/**
 * Clear all verification history.
 */
export async function clearHistory(): Promise<void> {
  try {
    await EncryptedStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history', error);
  }
}
