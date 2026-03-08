/**
 * Wallet Hook - Local Hidden Keypair Integration
 * 
 * Provides a seamless, invisible local wallet for gasless transactions.
 * No external wallet app required.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { PublicKey, Transaction, Keypair, VersionedTransaction } from '@solana/web3.js';
import EncryptedStorage from 'react-native-encrypted-storage';

// 1. MUST import get-random-values FIRST for crypto polyfill
import 'react-native-get-random-values';

// 2. Polyfill buffer for React Native
import { Buffer } from 'buffer';
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

const LOCAL_WALLET_KEY = 'minkyc_local_wallet_secret';

interface WalletContextType {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
  signAllTransactions: (txs: (Transaction | VersionedTransaction)[]) => Promise<(Transaction | VersionedTransaction)[]>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keypair, setKeypair] = useState<Keypair | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Initialize the hidden local wallet
  useEffect(() => {
    const initLocalWallet = async () => {
      setConnecting(true);
      try {
        // 1. Check if we already have a secret key saved
        const storedSecretStr = await EncryptedStorage.getItem(LOCAL_WALLET_KEY);

        let localKeypair: Keypair;

        if (storedSecretStr) {
          // Restore existing wallet
          const secretKeyArray = JSON.parse(storedSecretStr);
          const secretKeyUint8 = new Uint8Array(secretKeyArray);
          localKeypair = Keypair.fromSecretKey(secretKeyUint8);
          console.log('Restored existing hidden wallet:', localKeypair.publicKey.toBase58());
        } else {
          // 2. Generate brand new seamless wallet
          localKeypair = Keypair.generate();
          const secretKeyArray = Array.from(localKeypair.secretKey);

          await EncryptedStorage.setItem(
            LOCAL_WALLET_KEY,
            JSON.stringify(secretKeyArray)
          );
          console.log('Generated NEW hidden wallet:', localKeypair.publicKey.toBase58());
        }

        setKeypair(localKeypair);
      } catch (error) {
        console.error('Failed to initialize local wallet securely:', error);
      } finally {
        setConnecting(false);
      }
    };

    initLocalWallet();
  }, []);

  // "connect" now just simulates the UI state, as we auto-connect on mount
  const connect = useCallback(async () => {
    // If we have a keypair, we are already "connected" natively
    if (!keypair) {
      console.error('Local wallet not yet initialized');
    }
  }, [keypair]);

  const disconnect = useCallback(async () => {
    // Wipe old identity and generate a fresh one automatically
    try {
      await EncryptedStorage.removeItem(LOCAL_WALLET_KEY);
      setKeypair(null);
      console.log('Hidden local wallet wiped.');

      // Auto-regenerate a new wallet so the app never gets stuck
      const newKeypair = Keypair.generate();
      const secretKeyArray = Array.from(newKeypair.secretKey);
      await EncryptedStorage.setItem(
        LOCAL_WALLET_KEY,
        JSON.stringify(secretKeyArray)
      );
      setKeypair(newKeypair);
      console.log('Auto-generated new hidden wallet:', newKeypair.publicKey.toBase58());
    } catch (e) {
      console.error('Failed to reset wallet', e);
    }
  }, []);

  const signTransaction = useCallback(async (tx: Transaction | VersionedTransaction): Promise<Transaction | VersionedTransaction> => {
    if (!keypair) throw new Error('Not connected');

    if ('version' in tx) {
      // It's a VersionedTransaction
      tx.sign([keypair]);
      return tx;
    } else {
      // It's a standard Transaction
      tx.partialSign(keypair);
      return tx;
    }
  }, [keypair]);

  const signAllTransactions = useCallback(async (txs: (Transaction | VersionedTransaction)[]): Promise<(Transaction | VersionedTransaction)[]> => {
    if (!keypair) throw new Error('Not connected');

    return txs.map(tx => {
      if ('version' in tx) {
        tx.sign([keypair]);
      } else {
        tx.partialSign(keypair);
      }
      return tx;
    });
  }, [keypair]);

  return (
    <WalletContext.Provider
      value={{
        publicKey: keypair ? keypair.publicKey : null,
        connected: !!keypair,
        connecting,
        connect,
        disconnect,
        signTransaction,
        signAllTransactions,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
