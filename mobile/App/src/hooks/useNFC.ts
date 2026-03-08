/**
 * useNFC Hook
 * Provides NFC scanning capabilities with graceful fallback for emulators.
 * 
 * Two scanning modes:
 * 1. Tag Detection — uses react-native-nfc-manager to detect when a passport chip is near
 * 2. Passport Reading — uses react-native-nfc-passport-reader for full BAC authentication
 */

import { useState, useEffect, useCallback } from 'react';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

interface UseNFCResult {
  isSupported: boolean;
  isEnabled: boolean;
  isScanning: boolean;
  startScan: () => Promise<boolean>;
  stopScan: () => Promise<void>;
  error: string | null;
}

export function useNFC(): UseNFCResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const supported = await NfcManager.isSupported();
        if (mounted) setIsSupported(supported);
        
        if (supported) {
          await NfcManager.start();
          const enabled = await NfcManager.isEnabled();
          if (mounted) setIsEnabled(enabled);
        }
      } catch (err: any) {
        console.log('[useNFC] NFC not available:', err.message);
        if (mounted) {
          setIsSupported(false);
          setIsEnabled(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  /**
   * Start scanning for an NFC passport tag (IsoDep — ISO 14443-4).
   * Returns true if a tag was detected, false if cancelled/failed.
   */
  const startScan = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !isEnabled) {
      setError('NFC is not available on this device');
      return false;
    }

    setIsScanning(true);
    setError(null);

    try {
      // Request IsoDep technology — this is what ePassports use (ISO 14443-4)
      await NfcManager.requestTechnology(NfcTech.IsoDep);
      
      // Tag detected!
      const tag = await NfcManager.getTag();
      console.log('[useNFC] Passport chip detected:', tag?.id);
      
      return true;
    } catch (err: any) {
      if (err.message !== 'cancelled') {
        console.error('[useNFC] Scan error:', err);
        setError(err.message || 'NFC scan failed');
      }
      return false;
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch {}
      setIsScanning(false);
    }
  }, [isSupported, isEnabled]);

  /**
   * Cancel any active NFC scan
   */
  const stopScan = useCallback(async () => {
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch {}
    setIsScanning(false);
  }, []);

  return {
    isSupported,
    isEnabled,
    isScanning,
    startScan,
    stopScan,
    error,
  };
}
