/**
 * Verify Screen
 * Generate ZK proof and submit verification
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useWallet } from '../hooks/useWallet';
import { ZKProver } from '../components/ZKProver';
import { getPassportData, getCommitment } from '../utils/secureStorage';

interface VerificationRequest {
  platform: string;
  requirements: string[];
  timestamp: string;
}

const VerifyScreen: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [generating, setGenerating] = useState(false);
  const [verified, setVerified] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [zkInputs, setZkInputs] = useState<any>(null);

  // Mock request from a platform
  const mockRequest: VerificationRequest = {
    platform: 'Example DEX',
    requirements: ['Age >= 18'],
    timestamp: new Date().toLocaleString(),
  };

  const denyRequest = () => {
    Alert.alert('Request Denied', 'You have rejected this verification request.');
    // In a real app, this would navigate back or notify the platform
  };

  const generateProof = async () => {
    setGenerating(true);
    
    const passportData = await getPassportData();
    const storedCommitmentHex = await getCommitment();
    
    if (!passportData || !storedCommitmentHex) {
      setGenerating(false);
      Alert.alert('No Identity', 'Please scan your passport and create an identity first.');
      return;
    }
    
    // For MVP prototyping matching main.nr structure:
    const dobInput = passportData.dateOfBirth.replace(/-/g, '');
    const nameHash = '11111'; // Mock representing hashed names
    const secret = 'min_kyc_secret_nonce_2026';
    
    setZkInputs({
      dob: dobInput,
      passport_name_hash: nameHash,
      submitted_name_hash: nameHash,
      secret: secret,
      current_date: '20260220', // Mocking current block time Date
      salt: '12345',
      commitment: storedCommitmentHex
    });
  };

  const handleProofGenerated = (proofBytes: Uint8Array, publicInputs: string[]) => {
    console.log('ZK Proof generated successfully:', proofBytes.length, 'bytes');
    setGenerating(false);
    setVerified(true);
    setTxSignature('5KT... (Proof Size: ' + proofBytes.length + ' bytes)');
    setZkInputs(null); // Reset
  };

  const handleProofError = (err: string) => {
    console.error('ZK Proof failed:', err);
    setGenerating(false);
    Alert.alert('Verification Failed', 'Could not generate proof. Please try again.');
    setZkInputs(null);
  };

  const viewOnExplorer = () => {
    // Open Solana Explorer
    Alert.alert('Explorer', 'Would open: https://explorer.solana.com/tx/...');
  };

  // Wallet is automatically connected via local Keypair

  return (
    <ScrollView style={styles.container}>
      {!verified ? (
        <>
          {zkInputs && (
            <ZKProver 
              inputs={zkInputs} 
              onProofGenerated={handleProofGenerated} 
              onError={handleProofError} 
            />
          )}

          <View style={styles.requestCard}>
            <Text style={styles.requestTitle}>Verification Request</Text>

            <View style={styles.platformRow}>
              <Text style={styles.platformLabel}>Platform</Text>
              <Text style={styles.platformName}>{mockRequest.platform}</Text>
            </View>

            <View style={styles.platformRow}>
              <Text style={styles.platformLabel}>Requested On</Text>
              <Text style={styles.platformName}>{mockRequest.timestamp}</Text>
            </View>

            <View style={styles.requirementsSection}>
              <Text style={styles.requirementsTitle}>Requirements to Prove:</Text>
              {mockRequest.requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Text style={styles.checkIcon}>☐</Text>
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.processCard}>
            <Text style={styles.processTitle}>What Happens Next:</Text>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Secure Verification</Text>
                <Text style={styles.stepDesc}>Your device securely verifies your details</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Submit Anonymously</Text>
                <Text style={styles.stepDesc}>Send anonymous verification to the network</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Receive Confirmation</Text>
                <Text style={styles.stepDesc}>Get a digital receipt of your secure verification</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.denyButton}
              onPress={denyRequest}
              disabled={generating}
            >
              <Text style={styles.denyButtonText}>Deny</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.approveButton, generating && styles.verifyingButton]}
              onPress={generateProof}
              disabled={generating}
            >
              {generating ? (
                <>
                  <ActivityIndicator color="#fff" style={styles.buttonSpinner} />
                  <Text style={styles.approveButtonText}>Verifying...</Text>
                </>
              ) : (
                <Text style={styles.approveButtonText}>Approve</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.privacyNote}>
            <Text style={styles.privacyTitle}>🔒 Privacy Guaranteed</Text>
            <Text style={styles.privacyText}>
              Your passport data stays on your device. Only a cryptographic
              proof is submitted — your actual identity remains private.
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>

          <Text style={styles.successTitle}>Verified!</Text>
          <Text style={styles.successText}>
            Verification successfully completed and logged.
          </Text>

          <View style={styles.receiptCard}>
            <Text style={styles.receiptTitle}>Verification Receipt</Text>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Platform</Text>
              <Text style={styles.receiptValue}>{mockRequest.platform}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>VERIFIED ✅</Text>
              </View>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Proof Receipt</Text>
              <Text style={styles.receiptValueSmall}>Created</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.explorerButton} onPress={viewOnExplorer}>
            <Text style={styles.explorerButtonText}>View on Solana Explorer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setVerified(false)}
          >
            <Text style={styles.doneButtonText}>Verify Another</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 16,
    color: '#666',
  },
  requestCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  platformRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  platformLabel: {
    fontSize: 14,
    color: '#666',
  },
  platformName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9945FF',
  },
  requirementsSection: {
    marginTop: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkIcon: {
    fontSize: 20,
    color: '#9945FF',
    marginRight: 12,
  },
  requirementText: {
    fontSize: 14,
    color: '#333',
  },
  processCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  processTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#9945FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  stepDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  denyButton: {
    backgroundColor: '#ff4d4f',
    padding: 18,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  denyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  approveButton: {
    backgroundColor: '#14F195',
    padding: 18,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyingButton: {
    opacity: 0.8,
  },
  buttonSpinner: {
    marginRight: 8,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyNote: {
    backgroundColor: '#e8f4f8',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  privacyText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  successContainer: {
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#14F195',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14F195',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  receiptCard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  receiptLabel: {
    fontSize: 14,
    color: '#666',
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  receiptValueSmall: {
    fontSize: 12,
    color: '#14F195',
  },
  statusBadge: {
    backgroundColor: '#14F195',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  explorerButton: {
    backgroundColor: '#9945FF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  explorerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    padding: 12,
  },
  doneButtonText: {
    color: '#666',
    fontSize: 14,
  },
});

export default VerifyScreen;
