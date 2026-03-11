/**
 * Identity Screen
 * Displays the user's passport data (with blur toggle) and on-chain commitment.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { useWallet } from '../hooks/useWallet';
import { getIdentityPda } from '../utils/solana';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getCommitment, hasPassportData, getPassportData, savePassportData, computeCommitment, saveCommitment } from '../utils/secureStorage';
import { PassportData, MOCK_PROFILES } from '../constants/mockProfiles';
import { useNFC } from '../hooks/useNFC';
import PassportDataModal from '../components/PassportDataModal';
import { AppText } from '../components/AppText';
import { theme } from '../constants/theme';
import { ClipboardList, EyeOff, Eye, Shield, Link as LinkIcon, UserCircle, RefreshCcw } from 'lucide-react-native';

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
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText style={styles.loadingText}>Loading identity...</AppText>
      </View>
    );
  }

  if (!passportData) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.emptyState}>
          <ClipboardList size={64} color={theme.colors.iconDim} style={styles.emptyIcon} />
          <AppText variant="h2" style={styles.emptyTitle}>No Identity Found</AppText>
          <AppText variant="subtext" style={styles.emptyText} align="center">
            Create an on-chain identity to start using MinKYC. Your identity
            will be stored as a cryptographic commitment — no personal data
            is revealed.
          </AppText>
          <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('Onboarding')}>
            <AppText weight="semibold" color={theme.colors.surface}>Get Started</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsMasked(!isMasked)}
      >
        <View style={styles.toggleContent}>
          {isMasked ? (
            <Eye size={18} color={theme.colors.primary} style={styles.toggleIcon} />
          ) : (
            <EyeOff size={18} color={theme.colors.primary} style={styles.toggleIcon} />
          )}
          <AppText color={theme.colors.primary} weight="semibold">
            {isMasked ? 'Reveal Details' : 'Hide Private Data'}
          </AppText>
        </View>
      </TouchableOpacity>

      {/* Passport Data Card */}
      <View style={styles.dataCard}>
        <View style={styles.cardHeader}>
          <AppText variant="h3">Secure Credentials</AppText>
          <TouchableOpacity 
            style={[styles.miniReadButton, scanning && styles.disabledButton]} 
            onPress={startNFCScan}
            disabled={scanning}
          >
            <View style={styles.miniReadContent}>
              {!scanning && <RefreshCcw size={14} color={theme.colors.surface} style={{ marginRight: 4 }} />}
              <AppText variant="caption" color={theme.colors.surface} weight="semibold">
                {scanning ? 'Reading...' : 'Update'}
              </AppText>
            </View>
          </TouchableOpacity>
        </View>

        {FIELD_LABELS.map(({ key, label }) => (
          <View key={key} style={styles.fieldRow}>
            <AppText variant="subtext">{label}</AppText>
            <AppText style={styles.fieldValue}>{maskValue(passportData[key])}</AppText>
          </View>
        ))}
      </View>

      {/* Commitment Card */}
      <View style={styles.commitmentCard}>
        <AppText variant="h3" style={styles.commitmentCardTitle}>On-Chain Identity</AppText>

        {commitmentHex && (
          <View style={styles.commitmentSection}>
            <AppText variant="subtext">Commitment Hash</AppText>
            <AppText style={styles.commitmentValue}>
              {formatCommitment(commitmentHex)}
            </AppText>
            <AppText variant="caption" style={styles.commitmentHint}>
              Cryptographic hash of your identity data — this is the only thing stored on-chain.
            </AppText>
          </View>
        )}

        <View style={styles.fieldRow}>
          <AppText variant="subtext">Status</AppText>
          <View style={styles.statusBadge}>
            <AppText variant="caption" color={theme.colors.success}>Active</AppText>
          </View>
        </View>

        <TouchableOpacity style={styles.explorerButton} onPress={openExplorer}>
          <View style={styles.explorerContent}>
            <LinkIcon size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <AppText weight="semibold" color={theme.colors.primary}>View on Solana Explorer</AppText>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoHeader}>
          <Shield size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
          <AppText variant="h3" color={theme.colors.primary}>How It Works</AppText>
        </View>
        <AppText variant="subtext" style={styles.infoText}>
          1. Your passport data is hashed with a secret{'\n'}
          2. Only the hash (commitment) is stored on-chain{'\n'}
          3. Original data never leaves your device{'\n'}
          4. Zero-knowledge proofs verify requirements
        </AppText>
      </View>

      <View style={styles.demoSection}>
        <AppText variant="h3" color={theme.colors.textMain} style={styles.demoTitle}>
          Development Profiles
        </AppText>
        <View style={styles.mockProfilesList}>
          {Object.keys(MOCK_PROFILES).map((key, index) => {
            const profile = MOCK_PROFILES[key];
            return (
              <TouchableOpacity
                key={key}
                style={styles.mockProfileButton}
                onPress={() => handlePassportRead(profile)}
              >
                <View style={styles.mockProfileContent}>
                  <UserCircle size={20} color={theme.colors.iconDim} style={{ marginRight: 8 }} />
                  <AppText>
                    {profile.givenNames} ({profile.nationality})
                  </AppText>
                </View>
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
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textDim,
  },
  emptyState: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIcon: {
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
  },
  toggleButton: {
    backgroundColor: theme.colors.primaryLight,
    margin: theme.spacing.md,
    marginBottom: 0,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIcon: {
    marginRight: theme.spacing.sm,
  },
  dataCard: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadii.lg,
    ...theme.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  miniReadButton: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadii.sm,
  },
  miniReadContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  fieldValue: {
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  commitmentCard: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    marginTop: 0,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadii.lg,
    ...theme.shadows.card,
  },
  commitmentCardTitle: {
    marginBottom: theme.spacing.md,
  },
  commitmentSection: {
    marginBottom: theme.spacing.md,
  },
  commitmentValue: {
    fontFamily: 'monospace',
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  commitmentHint: {
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  explorerButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadii.sm,
    alignItems: 'center',
  },
  explorerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: theme.colors.primaryLight,
    margin: theme.spacing.md,
    marginTop: 0,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.lg,
    marginBottom: theme.spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    lineHeight: 22,
  },
  demoSection: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 40,
  },
  demoTitle: {
    marginBottom: theme.spacing.md,
  },
  mockProfilesList: {
    gap: 8,
  },
  mockProfileButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadii.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mockProfileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default IdentityScreen;
