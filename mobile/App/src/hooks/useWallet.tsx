/**
 * Wallet Hook - Solana Mobile Integration
 * 
 * Provides wallet connection functionality for Phantom/Solflare Mobile
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

// Polyfill buffer for React Native
import { Buffer } from 'buffer';
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

interface WalletContextType {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signAllTransactions: (txs: Transaction[]) => Promise<Transaction[]>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const [authorizationResult, setAuthorizationResult] = useState<any>(null);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      await transact(async (wallet: Web3MobileWallet) => {
        const authResult = await wallet.authorize({
          cluster: 'devnet',
          identity: {
            name: 'MinKYC',
            uri: 'https://minkyc.com',
            icon: 'favicon.ico',
          },
        });

        setAuthorizationResult(authResult);

        if (authResult.accounts && authResult.accounts.length > 0) {
          const addressBuffer = Buffer.from(authResult.accounts[0].address, 'base64');
          setPublicKey(new PublicKey(authResult.accounts[0].address));
          setConnected(true);
        }
      });
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (authorizationResult) {
      try {
        await transact(async (wallet: Web3MobileWallet) => {
          await wallet.deauthorize({ auth_token: authorizationResult.auth_token });
        });
      } catch (err) {
        console.error('Failed to deauthorize fallback', err);
      }
    }
    setPublicKey(null);
    setConnected(false);
    setAuthorizationResult(null);
  }, [authorizationResult]);

  const signTransaction = useCallback(async (tx: Transaction): Promise<Transaction> => {
    if (!authorizationResult) throw new Error('Not connected');

    let signedTx: Transaction = tx;
    await transact(async (wallet: Web3MobileWallet) => {
      await wallet.reauthorize({
        auth_token: authorizationResult.auth_token,
        identity: {
          name: 'MinKYC',
          uri: 'https://minkyc.com',
          icon: 'favicon.ico',
        },
      });

      const [signed] = await wallet.signTransactions({
        transactions: [tx],
      });

      signedTx = signed as Transaction;
    });

    return signedTx;
  }, [authorizationResult]);

  const signAllTransactions = useCallback(async (txs: Transaction[]): Promise<Transaction[]> => {
    if (!authorizationResult) throw new Error('Not connected');

    let signedTxs: Transaction[] = [];
    await transact(async (wallet: Web3MobileWallet) => {
      await wallet.reauthorize({
        auth_token: authorizationResult.auth_token,
        identity: {
          name: 'MinKYC',
          uri: 'https://minkyc.com',
          icon: 'favicon.ico',
        },
      });

      const signed = await wallet.signTransactions({ transactions: txs });

      signedTxs = signed as Transaction[];
    });

    return signedTxs;
  }, [authorizationResult]);

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        connected,
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
