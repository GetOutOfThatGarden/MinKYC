/**
 * useNFC Hook
 * Provides NFC scanning capabilities with graceful fallback for emulators.
 * 
 * Two scanning modes:
 * 1. Tag Detection — uses react-native-nfc-manager to detect when a passport chip is near
 * 2. Passport Reading — uses react-native-nfc-passport-reader for full BAC authentication
 */

import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import NfcPassportReader, { NfcResult } from 'react-native-nfc-passport-reader';

interface UseNFCResult {
  isSupported: boolean;
  isEnabled: boolean;
  isScanning: boolean;
  startScan: () => Promise<boolean>;
  readPassport: (passportNumber: string, dateOfBirth: string, expiryDate: string) => Promise<NfcResult | null>;
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
        console.error('[useNFC] Scan error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
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
   * Perform actual passport reading using BAC authentication.
   * Requires passport details as input.
   */
  const readPassport = useCallback(async (
    passportNumber: string,
    dateOfBirth: string,
    expiryDate: string
  ): Promise<NfcResult | null> => {
    setIsScanning(true);
    setError(null);

    try {
      // CRITICAL: Stop NfcManager before using specialized reader to avoid conflicts
      try {
        await NfcManager.unregisterTagEvent();
        await NfcManager.cancelTechnologyRequest();
      } catch (e) {
        console.log('[useNFC] Info: NfcManager already stopped or not running');
      }

      console.log('[useNFC] Starting passport read with BAC key...');
      
      const scanResult = await NfcPassportReader.startReading({
        bacKey: {
          documentNo: passportNumber,
          birthDate: dateOfBirth,
          expiryDate: expiryDate,
        },
        includeImages: true,
      });

      console.log('[useNFC] Passport read successfully:', scanResult.firstName, scanResult.lastName);
      return scanResult;
    } catch (err: any) {
      console.error('[useNFC] Passport read exception:', err);
      if (err instanceof Error) {
        console.error('[useNFC] Stack:', err.stack);
      }
      setError(err.message || 'Passport reading failed');
      return null;
    } finally {
      setIsScanning(false);
    }
  }, []);

  /**
   * Cancel any active NFC scan
   */
  const stopScan = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        NfcPassportReader.stopReading();
      }
      await NfcManager.cancelTechnologyRequest();
    } catch {}
    setIsScanning(false);
  }, []);

  return {
    isSupported,
    isEnabled,
    isScanning,
    startScan,
    readPassport,
    stopScan,
    error,
  };
}
