import { VerificationReceipt } from '../types/verification';

/**
 * Simulates sending the VerificationReceipt to the platform's webhook.
 */
export async function sendReceipt(receipt: VerificationReceipt, endpoint?: string): Promise<boolean> {
  // If no endpoint is specified, use a default mock endpoint
  const targetUrl = endpoint || 'https://mock.socialprofile.xyz/api/verify';
  
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        minkyc_receipt: receipt
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to send receipt', error);
    return false;
  }
}
