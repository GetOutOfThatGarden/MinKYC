import { VerificationRequest } from '../types/verification';

export class QRParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QRParseError';
  }
}

/**
 * Parses a QR code string payload and extracts a VerificationRequest if valid.
 * Throws a QRParseError if the payload is invalid or not for MinKYC.
 */
export const parseVerificationRequest = (payload: string): VerificationRequest => {
  let data: any;
  try {
    data = JSON.parse(payload);
  } catch (e) {
    throw new QRParseError('Invalid JSON format');
  }

  if (!data || typeof data !== 'object') {
    throw new QRParseError('Invalid format');
  }

  if (data.minkyc !== true || data.type !== 'verify_request') {
    throw new QRParseError('Not a valid MinKYC request');
  }

  const { platformId, requestId, condition, userId } = data;

  if (!platformId || !requestId || !condition || !userId) {
    throw new QRParseError('Missing required fields');
  }

  return {
    platformId,
    requestId,
    condition,
    userId,
  };
};
