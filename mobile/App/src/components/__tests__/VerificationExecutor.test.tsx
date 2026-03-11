import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { VerificationExecutor } from '../VerificationExecutor';
import { VerificationRequest } from '../../types/verification';
import * as secureStorage from '../../utils/secureStorage';

// Mock dependencies
jest.mock('../../utils/secureStorage', () => ({
  getPassportData: jest.fn(),
  getCommitment: jest.fn(),
}));

jest.mock('../ZKProver', () => {
  const { View } = require('react-native');
  return {
    ZKProver: ({ inputs, onProofGenerated, onError }: any) => {
      // Allow tests to trigger success or error
      if (inputs && inputs.dob === 'bad_error') {
        setTimeout(() => onError('Mocked ZK Error'), 10);
      } else if (inputs) {
        // Mock successful proof generation
        setTimeout(() => onProofGenerated(new Uint8Array([1, 2, 3]), ['mock_public_input']), 10);
      }
      return <View testID="zk-prover-mock" />;
    }
  };
});

describe('VerificationExecutor', () => {
  const mockRequest: VerificationRequest = {
    userId: 'user-123',
    platformId: 'test-platform',
    requestId: 'req-123',
    condition: 'age_over_18',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    (secureStorage.getPassportData as jest.Mock).mockResolvedValueOnce(null);
    const { getByTestId } = render(
      <VerificationExecutor request={mockRequest} onReceipt={jest.fn()} onError={jest.fn()} />
    );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('calls onError if no passport data is stored', async () => {
    const onErrorMock = jest.fn();
    (secureStorage.getPassportData as jest.Mock).mockResolvedValueOnce(null);
    (secureStorage.getCommitment as jest.Mock).mockResolvedValueOnce(null);

    const { getByText } = render(
      <VerificationExecutor request={mockRequest} onReceipt={jest.fn()} onError={onErrorMock} />
    );

    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalledWith('No identity found. Please scan your passport first.');
    });
  });

  it('fetches secure data, renders ZKProver, and returns a verified receipt', async () => {
    const onReceiptMock = jest.fn();
    (secureStorage.getPassportData as jest.Mock).mockResolvedValueOnce({ dateOfBirth: '1990-01-01' });
    (secureStorage.getCommitment as jest.Mock).mockResolvedValueOnce('mock_commitment_hash');

    const { getByTestId } = render(
      <VerificationExecutor request={mockRequest} onReceipt={onReceiptMock} onError={jest.fn()} />
    );

    // Wait for the async secureStorage fetches to resolve and the ZKProver to render
    await waitFor(() => {
      expect(getByTestId('zk-prover-mock')).toBeTruthy();
    });

    // Wait for the mock ZKProver to generate the proof and call onReceipt
    await waitFor(() => {
      expect(onReceiptMock).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: 'req-123',
          platformId: 'test-platform',
          publicSignals: ['mock_public_input']
        })
      );
    });
  });
});
