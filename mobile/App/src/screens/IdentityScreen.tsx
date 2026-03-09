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
import { getCommitment, hasPassportData, getPassportData, savePassportData, computeCommitment, saveCommitment } from '../utils/secureStorage';
import { PassportData, MOCK_PROFILES } from '../constants/mockProfiles';
import { useNFC } from '../hooks/useNFC';
import { Alert } from 'react-native';
import PassportDataModal from '../components/PassportDataModal';

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
  const [scanning, setScanning] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isSupported, isEnabled, readPassport } = useNFC();
  const navigation = useNavigation<any>();

  const handlePassportRead = async (data: PassportData) => {
    try {
      await savePassportData(data);
      const secret = 'min_kyc_secret_nonce_2026';
      const commitment = computeCommitment(data, secret);
      await saveCommitment(commitment);
      
      setPassportData(data);
      setCommitmentHex(commitment);
      
      Alert.alert('Success', 'Passport read successfully and identity updated.');
    } catch (err) {
      Alert.alert('Error', 'Failed to save passport data.');
    }
  };

  const handleActualPassportScan = async (passportNumber: string, dateOfBirth: string, expiryDate: string) => {
    setIsModalVisible(false);
    setScanning(true);
    try {
      const result = await readPassport(passportNumber, dateOfBirth, expiryDate);
      if (result) {
        // Map NfcResult to PassportData
        const passportData: PassportData = {
          surname: result.lastName,
          givenNames: result.firstName,
          nationality: result.nationality,
          dateOfBirth: result.birthDate,
          sex: result.gender === 'M' || result.gender === 'Male' ? 'M' : 'F',
          passportNumber: result.documentNo,
          expiryDate: result.expiryDate,
          issuingCountry: result.nationality,
          documentType: 'P',
        };
        await handlePassportRead(passportData);
      }
    } catch (err: any) {
      Alert.alert('Scan Failed', err.message || 'Could not read passport. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const startNFCScan = async () => {
    if (!isSupported || !isEnabled) {
      Alert.alert('NFC Unavailable', 'Please enable NFC in your device settings.');
      return;
    }
    setIsModalVisible(true);
  };

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
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Passport Data</Text>
          <TouchableOpacity 
            style={[styles.miniReadButton, scanning && styles.disabledButton]} 
            onPress={startNFCScan}
            disabled={scanning}
          >
            <Text style={styles.miniReadButtonText}>
              {scanning ? '...' : '🔄 Read Passport'}
            </Text>
          </TouchableOpacity>
        </View>

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

      <View style={styles.demoSection}>
        <Text style={styles.demoTitle}>🧪 Demo: Select Mock Profile</Text>
        <View style={styles.mockProfilesList}>
          {Object.keys(MOCK_PROFILES).map((key, index) => {
            const profile = MOCK_PROFILES[key];
            return (
              <TouchableOpacity
                key={key}
                style={styles.mockProfileButton}
                onPress={() => handlePassportRead(profile)}
              >
                <Text style={styles.mockProfileText}>
                  {profile.sex === 'M' ? '👨' : '👩'} {profile.givenNames} ({profile.nationality})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <PassportDataModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleActualPassportScan}
        isLoading={scanning}
      />
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  miniReadButton: {
    backgroundColor: '#14F195',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  miniReadButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
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
  demoSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 40,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9945FF',
    marginBottom: 12,
  },
  mockProfilesList: {
    gap: 8,
  },
  mockProfileButton: {
    padding: 12,
    backgroundColor: '#f8f4ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0d0ff',
  },
  mockProfileText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default IdentityScreen;
