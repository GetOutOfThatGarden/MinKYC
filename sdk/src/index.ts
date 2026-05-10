import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

export interface MinKYCRequest {
  requester: string;
  requirements: {
    over18?: boolean;
    nationality?: string[];
  };
  verifierId: number;
}

export class MinKYCClient {
  constructor(
    public connection: Connection,
    public programId: PublicKey = new PublicKey('9zzT4KdUh7TEtiR8ioTMhDLWDa4c6ymzAjQsYYfvc3h1')
  ) {}

  /**
   * Create a verification request QR/Link for the user
   */
  createRequest(request: MinKYCRequest): string {
    const data = JSON.stringify(request);
    const encoded = Buffer.from(data).toString('base64');
    return `minkyc://verify?data=${encoded}`;
  }

  /**
   * Derive the Nullifier PDA
   */
  getNullifierPda(callerPubkey: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('nullifier'), callerPubkey.toBuffer()],
      this.programId
    );
    return pda;
  }

  /**
   * Derive the Identity PDA for a user
   */
  getIdentityPda(owner: PublicKey, index: number = 0): PublicKey {
    const indexLe = Buffer.alloc(8);
    indexLe.writeBigUInt64LE(BigInt(index));
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('identity'), owner.toBuffer(), indexLe],
      this.programId
    );
    return pda;
  }
}

/**
 * React Hook for MinKYC Integration (requires @solana/wallet-adapter-react)
 */
export function useMinKYC(client: MinKYCClient) {
  return {
    createRequest: (req: MinKYCRequest) => client.createRequest(req),
    getIdentityPda: (owner: PublicKey) => client.getIdentityPda(owner),
  };
}
