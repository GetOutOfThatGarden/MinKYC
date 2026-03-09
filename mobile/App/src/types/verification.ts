/**
 * TypeScript definitions for the MinKYC QR Verification Flow
 */

export interface VerificationRequest {
  platformId: string;
  requestId: string;
  condition: string;
  userId: string;
}

export interface VerificationReceipt {
  receiptId: string;
  requestId: string;
  platformId: string;
  timestamp: string;
  proof: {
    protocol: string;
    curve: string;
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
  };
  publicSignals: string[];
}

export interface VerificationHistoryItem {
  receipt: VerificationReceipt;
  condition: string;
  satisfied: boolean;
  approvingUserName?: string;
}
