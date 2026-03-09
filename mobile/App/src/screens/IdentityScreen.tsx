/**
 * Identity Screen
 * Displays the user's passport data (with blur toggle) and on-chain commitment.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useWallet } from '../hooks/useWallet';
import { getIdentityPda } from '../utils/solana';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getCommitment, hasPassportData, getPassportData } from '../utils/secureStorage';
import { PassportData } from '../constants/mockProfiles';

const FIELD_LABELS: { key: keyof PassportData; label: string }[] = [
  { key: 'surname', label: 'Surname' },
  { key: 'givenNames', label: 'Given Names' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'sex', label: 'Sex' },
  { key: 'passportNumber', label: 'Passport Number' },
  { key: 'expiryDate', label: 'Expiry Date' },
  { key: 'issuingCountry', label: 'Issuing Country' },
  { key: 'documentType', label: 'Document Type' },
];

const IdentityScreen: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [passportData, setPassportData] = useState<PassportData | null>(null);
  const [commitmentHex, setCommitmentHex] = useState<string | null>(null);
  const [pda, setPda] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMasked, setIsMasked] = useState(true);
  const navigation = useNavigation<any>();

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      async function load() {
        const exists = await hasPassportData();
        if (!exists) {
          if (mounted) {
            setPassportData(null);
            setLoading(false);
          }
          return;
        }
        const data = await getPassportData();
        const commitment = await getCommitment();
        if (mounted) {
          setPassportData(data);
          setCommitmentHex(commitment);
          if (connected && publicKey) {
            const { pda: identityPda } = getIdentityPda(publicKey);
            setPda(identityPda.toBase58());
          }
          setLoading(false);
        }
      }
      load();
      return () => { mounted = false; };
    }, [connected, publicKey])
  );

  const formatCommitment = (hex: string): string => {
    return `${hex.slice(0, 8)}...${hex.slice(-8)}`;
  };

  const openExplorer = () => {
    if (pda) {
      Linking.openURL(`https://explorer.solana.com/address/${pda}?cluster=devnet`);
    }
  };

  const maskValue = (value: string): string => {
    if (!isMasked) return value;
    if (value.length <= 2) return '••';
    return '••••••';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#9945FF" />
        <Text style={styles.loadingText}>Loading identity...</Text>
      </View>
    );
  }

  if (!passportData) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Identity Found</Text>
          <Text style={styles.emptyText}>
            Create an on-chain identity to start using MinKYC. Your identity
            will be stored as a cryptographic commitment — no personal data
            is revealed.
          </Text>
          <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('Onboarding')}>
            <Text style={styles.createButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Blur Toggle */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsMasked(!isMasked)}
      >
        <Text style={styles.toggleText}>
          {isMasked ? '👁 Show Sensitive Data' : '🙈 Hide Sensitive Data'}
        </Text>
      </TouchableOpacity>

      {/* Passport Data Card */}
      <View style={styles.dataCard}>
        <Text style={styles.cardTitle}>Passport Data</Text>

        {FIELD_LABELS.map(({ key, label }) => (
          <View key={key} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.fieldValue}>{maskValue(passportData[key])}</Text>
          </View>
        ))}
      </View>

      {/* Commitment Card */}
      <View style={styles.commitmentCard}>
        <Text style={styles.cardTitle}>On-Chain Identity</Text>

        {commitmentHex && (
          <View style={styles.commitmentSection}>
            <Text style={styles.fieldLabel}>Commitment Hash</Text>
            <Text style={styles.commitmentValue}>
              {formatCommitment(commitmentHex)}
            </Text>
            <Text style={styles.commitmentHint}>
              Cryptographic hash of your identity data — this is the only thing stored on-chain.
            </Text>
          </View>
        )}

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.explorerButton} onPress={openExplorer}>
          <Text style={styles.explorerButtonText}>🔗 View on Solana Explorer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🔒 How It Works</Text>
        <Text style={styles.infoText}>
          1. Your passport data is hashed with a secret{'\n'}
          2. Only the hash (commitment) is stored on-chain{'\n'}
          3. Original data never leaves your device{'\n'}
          4. Zero-knowledge proofs verify requirements
        </Text>
      </View>
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
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#9945FF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    backgroundColor: '#e8f4f8',
    margin: 16,
    marginBottom: 0,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b3e5fc',
  },
  toggleText: {
    color: '#0288d1',
    fontWeight: '600',
    fontSize: 14,
  },
  dataCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fieldLabel: {
    fontSize: 13,
    color: '#888',
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'monospace',
  },
  commitmentCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commitmentSection: {
    marginBottom: 12,
  },
  commitmentValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#9945FF',
    marginTop: 4,
  },
  commitmentHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
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
    marginTop: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#9945FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  explorerButtonText: {
    color: '#9945FF',
    fontWeight: '600',
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: '#e8f4f8',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});

export default IdentityScreen;
