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
import EIdReader, { EIdReadResult } from '@2060.io/react-native-eid-reader';
import { trigger, HapticFeedbackTypes } from 'react-native-haptic-feedback';

export type NFCStep = 'IDLE' | 'SCANNING' | 'TAG_DETECTED' | 'AUTHENTICATING' | 'READING_DATA' | 'COMPLETED' | 'ERROR';

interface UseNFCResult {
  isSupported: boolean;
  isEnabled: boolean;
  isScanning: boolean;
  nfcStep: NFCStep;
  nfcProgress: number;
  startScan: () => Promise<boolean>;
  readPassport: (passportNumber: string, dateOfBirth: string, expiryDate: string) => Promise<EIdReadResult | null>;
  stopScan: () => Promise<void>;
  error: string | null;
}

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export function useNFC(): UseNFCResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [nfcStep, setNfcStep] = useState<NFCStep>('IDLE');
  const [nfcProgress, setNfcProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const supported = await EIdReader.isNfcSupported();
        if (mounted) setIsSupported(supported);
        
        if (supported) {
          const enabled = await EIdReader.isNfcEnabled();
          if (mounted) setIsEnabled(enabled);
        }
      } catch (err: any) {
        console.log('[useNFC] NFC check failed:', err.message);
        if (mounted) {
          setIsSupported(false);
          setIsEnabled(false);
        }
      }
    }

    init();

    // Listeners
    EIdReader.addOnTagDiscoveredListener(() => {
      console.log('[useNFC] Tag discovered event');
      trigger(HapticFeedbackTypes.impactLight, hapticOptions);
      setNfcStep('TAG_DETECTED');
      setNfcProgress(20);
    });

    return () => {
      mounted = false;
      EIdReader.removeListeners();
    };
  }, []);

  /**
   * Start scanning for an NFC passport tag.
   * In this new version, we mainly rely on EIdReader.startReading for everything,
   * but we keep startScan for initial "looking for tag" state.
   */
  const startScan = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !isEnabled) {
      setError('NFC is not available on this device');
      return false;
    }

    setIsScanning(true);
    setNfcStep('SCANNING');
    setNfcProgress(10);
    setError(null);

    // With the new library, we can also use NfcManager just to "wait" for any tag if we want,
    // but startReading is better as it handles the whole flow.
    // However, the app might want to wait for tag before asking for MRZ.
    // For now, we'll just signal we are ready.
    return true;
  }, [isSupported, isEnabled]);

  /**
   * Perform actual passport reading using BAC/PACE authentication.
   * Requires passport details as input.
   */
  const readPassport = useCallback(async (
    passportNumber: string,
    dateOfBirth: string,
    expiryDate: string
  ): Promise<EIdReadResult | null> => {
    setIsScanning(true);
    setNfcStep('SCANNING');
    setNfcProgress(10);
    setError(null);

    try {
      console.log('[useNFC] Starting passport read with MRZ key...');
      
      const result = await EIdReader.startReading({
        mrzInfo: {
          documentNumber: passportNumber,
          birthDate: dateOfBirth,
          expirationDate: expiryDate,
        },
        includeImages: true,
        includeRawData: true,
      });

      if (result.status === 'OK') {
        console.log('[useNFC] Passport read successfully');
        trigger(HapticFeedbackTypes.notificationSuccess, hapticOptions);
        setNfcStep('COMPLETED');
        setNfcProgress(100);
        return result;
      } else if (result.status === 'Canceled') {
        console.log('[useNFC] Passport read canceled');
        setNfcStep('IDLE');
        setNfcProgress(0);
        return null;
      } else {
        throw new Error('Passport reading failed');
      }
    } catch (err: any) {
      console.error('[useNFC] Passport read exception:', err);
      trigger(HapticFeedbackTypes.notificationError, hapticOptions);
      setNfcStep('ERROR');
      setError(err.message || 'Passport reading failed');
      return null;
    } finally {
      setIsScanning(false);
      EIdReader.stopReading();
    }
  }, []);

  /**
   * Cancel any active NFC scan
   */
  const stopScan = useCallback(async () => {
    try {
      EIdReader.stopReading();
    } catch {}
    setIsScanning(false);
    setNfcStep('IDLE');
    setNfcProgress(0);
  }, []);

  return {
    isSupported,
    isEnabled,
    isScanning,
    nfcStep,
    nfcProgress,
    startScan,
    readPassport,
    stopScan,
    error,
  };
}

