import { saveHistoryItem, getHistory, clearHistory } from '../historyStorage';
import { VerificationHistoryItem } from '../../types/verification';
import EncryptedStorage from 'react-native-encrypted-storage';

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('History Storage', () => {
  const mockItem: VerificationHistoryItem = {
    receipt: {
      receiptId: 'receipt-1',
      requestId: 'req-1',
      platformId: 'test-platform',
      timestamp: '2026-03-09T00:00:00Z',
      proof: {
        pi_a: ['a', 'a'],
        pi_b: [['b', 'b'], ['b', 'b']],
        pi_c: ['c', 'c'],
        protocol: 'groth16',
        curve: 'bn128'
      },
      publicSignals: ['signal_1']
    },
    condition: 'age_over_18'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveHistoryItem', () => {
    it('saves a new item to an empty history', async () => {
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      await saveHistoryItem(mockItem);
      expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
        'minkyc_verification_history',
        JSON.stringify([mockItem])
      );
    });

    it('prepends a new item to existing history', async () => {
      const existingHistory = [
        { ...mockItem, receipt: { ...mockItem.receipt, receiptId: 'receipt-old' } }
      ];
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(existingHistory));
      
      await saveHistoryItem(mockItem);
      expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
        'minkyc_verification_history',
        JSON.stringify([mockItem, ...existingHistory])
      );
    });
  });

  describe('getHistory', () => {
    it('returns an empty array when no history exists', async () => {
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const history = await getHistory();
      expect(history).toEqual([]);
    });

    it('returns parsed history items', async () => {
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([mockItem]));
      const history = await getHistory();
      expect(history).toEqual([mockItem]);
    });
  });

  describe('clearHistory', () => {
    it('removes the history key from storage', async () => {
      await clearHistory();
      expect(EncryptedStorage.removeItem).toHaveBeenCalledWith('minkyc_verification_history');
    });
  });
});
