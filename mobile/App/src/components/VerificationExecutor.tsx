import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ZKProver } from './ZKProver';
import { VerificationRequest, VerificationReceipt } from '../types/verification';
import { getPassportData, getCommitment } from '../utils/secureStorage';
import { generateReceipt } from '../utils/receiptGenerator';

interface Props {
  request: VerificationRequest;
  onReceipt: (receipt: VerificationReceipt) => void;
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

  const handleProof = (proof: Uint8Array, publicInputs: string[]) => {
    // Generate receipt using our utility
    const receipt = generateReceipt(request, proof, publicInputs);
    onReceipt(receipt);
  };

  if (errorLocal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorLocal}</Text>
      </View>
    );
  }

  if (!inputs) {
    return (
      <View style={styles.container}>
         <ActivityIndicator size="large" color="#14F195" testID="loading-indicator" />
         <Text style={styles.loadingText}>Loading Identity...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#9945FF" />
      <Text style={styles.loadingText}>Generating Zero-Knowledge Proof...</Text>
      <Text style={styles.subText}>This happens locally on your device.</Text>
      
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
  }
});
