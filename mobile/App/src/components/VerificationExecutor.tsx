import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ZKProver } from './ZKProver';
import { getPassportData, getCommitment } from '../utils/secureStorage';
import { generateReceipt } from '../utils/receiptGenerator';
import { checkCondition } from '../utils/age';
import { VerificationRequest, VerificationReceipt } from '../types/verification';
import { AppText } from './AppText';
import { theme } from '../constants/theme';

interface Props {
  request: VerificationRequest;
  onReceipt: (receipt: VerificationReceipt, satisfied: boolean, approvingUserName?: string) => void;
  onError: (error: string) => void;
}

export const VerificationExecutor: React.FC<Props> = ({ request, onReceipt, onError }) => {
  const [inputs, setInputs] = useState<any>(null);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function prepareInputs() {
      try {
        const passport = await getPassportData();
        const commitment = await getCommitment();
        
        if (!passport || !commitment) {
          throw new Error('No identity found. Please scan your passport first.');
        }

        if (mounted) {
          // Simplification for the prototype
          setInputs({
            dob: passport.dateOfBirth, // In real life, convert to format required by circuit
            passport_name_hash: "0x123", // Mock
            submitted_name_hash: "0x123", // Mock
            secret: "min_kyc_secret_nonce_2026",
            current_date: new Date().toISOString().split('T')[0],
            salt: Math.random().toString(),
            commitment: commitment
          });
        }
      } catch (err: any) {
        if (mounted) {
          setErrorLocal(err.message);
          onError(err.message);
        }
      }
    }
    prepareInputs();

    return () => {
      mounted = false;
    };
  }, [request, onError]);

  const handleProof = async (proof: Uint8Array, publicInputs: string[]) => {
    try {
      const passport = await getPassportData();
      const satisfied = passport ? checkCondition(passport.dateOfBirth, request.condition) : false;
      
      // Generate receipt using our utility
      const receipt = generateReceipt(request, proof, publicInputs);
      const name = passport ? `${passport.givenNames} ${passport.surname}` : 'Unknown User';
      onReceipt(receipt, satisfied, name);
    } catch (err: any) {
      onError(err.message);
    }
  };

  if (errorLocal) {
    return (
      <View style={styles.container}>
        <AppText color={theme.colors.error} align="center">{errorLocal}</AppText>
      </View>
    );
  }

  if (!inputs) {
    return (
      <View style={styles.container}>
         <ActivityIndicator size="large" color={theme.colors.primary} testID="loading-indicator" />
         <AppText weight="semibold" style={styles.loadingText}>Loading Identity...</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <AppText weight="semibold" style={styles.loadingText}>Generating Zero-Knowledge Proof...</AppText>
      <AppText variant="subtext" style={styles.subText}>This happens locally on your device.</AppText>
      
      <ZKProver
        inputs={inputs}
        onProofGenerated={handleProof}
        onError={onError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textMain,
  },
  subText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textDim,
  },
});
