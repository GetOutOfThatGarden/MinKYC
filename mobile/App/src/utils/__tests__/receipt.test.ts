import { generateReceipt } from '../receiptGenerator';
import { sendReceipt } from '../receiptSender';
import { VerificationRequest } from '../../types/verification';

global.fetch = jest.fn();

describe('Receipt Utilities', () => {
  const mockRequest: VerificationRequest = {
    platformId: 'test-platform',
    requestId: 'req-123',
    condition: 'age_over_18',
    userId: 'user-123',
  };

  const mockProof = new Uint8Array([1, 2, 3]);
  const mockPublicSignals = ['mock_commitment_valid'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateReceipt', () => {
    it('generates a valid receipt matching the schema', () => {
      const receipt = generateReceipt(mockRequest, mockProof, mockPublicSignals);
      
      expect(receipt.requestId).toBe('req-123');
      expect(receipt.platformId).toBe('test-platform');
      expect(receipt.receiptId).toContain('receipt_');
      expect(receipt.timestamp).toBeDefined();
      expect(receipt.proof.protocol).toBe('groth16');
      expect(receipt.publicSignals).toEqual(['mock_commitment_valid']);
    });
  });

  describe('sendReceipt', () => {
    it('sends the receipt to the specified endpoint', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
      const receipt = generateReceipt(mockRequest, mockProof, mockPublicSignals);
      
      const success = await sendReceipt(receipt, 'https://test.endpoint/webhook');
      
      expect(success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('https://test.endpoint/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minkyc_receipt: receipt })
      });
    });

    it('returns false when the network request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));
      const receipt = generateReceipt(mockRequest, mockProof, mockPublicSignals);
      
      const success = await sendReceipt(receipt);
      expect(success).toBe(false);
    });
  });
});
