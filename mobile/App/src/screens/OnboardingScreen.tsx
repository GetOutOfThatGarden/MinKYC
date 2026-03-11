/**
 * Onboarding Screen
 * First screen for new users: scan a passport via NFC or select a mock profile.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MOCK_PROFILES, PassportData } from '../constants/mockProfiles';
import { useNFC } from '../hooks/useNFC';
import { savePassportData, computeCommitment, saveCommitment } from '../utils/secureStorage';
import { useNavigation } from '@react-navigation/native';
import PassportDataModal from '../components/PassportDataModal';
import { AppText } from '../components/AppText';
import { theme } from '../constants/theme';
import { ShieldCheck, Nfc, Users, ChevronDown, ChevronUp, Lock } from 'lucide-react-native';

const FIELD_LABELS: Record<keyof PassportData, string> = {
  documentType: 'Document Type',
  issuingCountry: 'Issuing Country',
  passportNumber: 'Passport Number',
  surname: 'Surname',
  givenNames: 'Given Names',
  nationality: 'Nationality',
  dateOfBirth: 'Date of Birth',
  sex: 'Sex',
  expiryDate: 'Expiry Date',
};

const OnboardingScreen: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isSupported, readPassport } = useNFC();
  const navigation = useNavigation<any>();

  const handleSelectProfile = async (data: PassportData) => {
    try {
      await savePassportData(data);
      const secret = 'min_kyc_secret_nonce_2026';
      const commitment = computeCommitment(data, secret);
      await saveCommitment(commitment);

      Alert.alert(
        'Identity Created',
        `Passport for ${data.givenNames} ${data.surname} securely stored.`,
        [{ text: 'Continue', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] }) }],
      );
    } catch {
      Alert.alert('Error', 'Failed to create identity. Please try again.');
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
          issuingCountry: result.nationality, // Simplified
          documentType: 'P',
        };
        await handleSelectProfile(passportData);
      }
    } catch (err: any) {
      Alert.alert('Scan Failed', err.message || 'Could not read passport chip. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const startNFCScan = () => {
    setIsModalVisible(true);
  };

  const toggleExpand = (key: string) => {
    setExpandedProfile(expandedProfile === key ? null : key);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <ShieldCheck size={48} color={theme.colors.surface} />
        </View>
        <AppText variant="h1" color={theme.colors.surface} align="center" style={styles.headerTitle}>
          Welcome to MinKYC
        </AppText>
        <AppText variant="body" color={theme.colors.surface} align="center" style={styles.headerSubtitle}>
          To get started, read your passport or choose a test profile below.
        </AppText>
      </View>

      <View style={styles.body}>
        {/* NFC Section */}
        {isSupported ? (
          <TouchableOpacity
            style={[styles.nfcButton, scanning && styles.nfcButtonScanning]}
            onPress={startNFCScan}
            disabled={scanning}
          >
            <Nfc size={20} color={theme.colors.surface} style={{ marginRight: 8 }} />
            <AppText weight="semibold" color={theme.colors.surface}>
              {scanning ? 'Scanning...' : 'Read Passport via NFC'}
            </AppText>
          </TouchableOpacity>
        ) : (
          <View style={styles.nfcUnavailable}>
            <Nfc size={20} color={theme.colors.warning} style={{ marginRight: 8 }} />
            <AppText variant="subtext" color={theme.colors.warning} style={{ flex: 1 }}>
              NFC not available on this device. Please use a test profile below.
            </AppText>
          </View>
        )}

        {/* Mock Profiles */}
        <View style={styles.profilesSection}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <AppText variant="h3">Test Profiles</AppText>
          </View>
          <AppText variant="subtext" style={styles.sectionSubtitle}>
            Tap to preview passport data, then select to create your identity.
          </AppText>

          {Object.keys(MOCK_PROFILES).map((key) => {
            const profile = MOCK_PROFILES[key];
            const isExpanded = expandedProfile === key;

            return (
              <View key={key} style={styles.profileCard}>
                <TouchableOpacity
                  style={styles.profileHeader}
                  onPress={() => toggleExpand(key)}
                >
                  <View style={styles.profileHeaderLeft}>
                    <AppText weight="semibold">
                      {profile.givenNames} {profile.surname}
                    </AppText>
                    <AppText variant="caption" style={styles.profileMeta}>
                      {profile.nationality} • {profile.sex === 'M' ? 'Male' : profile.sex === 'F' ? 'Female' : 'Other'}
                    </AppText>
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={20} color={theme.colors.border} />
                  ) : (
                    <ChevronDown size={20} color={theme.colors.border} />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.profileDetails}>
                    {(Object.keys(FIELD_LABELS) as (keyof PassportData)[]).map((field) => (
                      <View key={field} style={styles.fieldRow}>
                        <AppText variant="caption" style={styles.fieldLabel}>{FIELD_LABELS[field]}</AppText>
                        <AppText variant="subtext" weight="medium" style={styles.fieldValue}>{profile[field]}</AppText>
                      </View>
                    ))}

                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => handleSelectProfile(profile)}
                    >
                      <AppText weight="semibold" color={theme.colors.surface}>Use This Profile</AppText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.privacyNote}>
          <View style={styles.privacyHeader}>
            <Lock size={16} color={theme.colors.success} style={{ marginRight: 8 }} />
            <AppText weight="semibold">Your Data Stays Private</AppText>
          </View>
          <AppText variant="caption" style={styles.privacyText}>
            Passport data is encrypted and stored only on your device.
            Only a cryptographic hash is ever shared.
          </AppText>
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
  content: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxl,
    alignItems: 'center',
    borderBottomLeftRadius: theme.borderRadii.xl,
    borderBottomRightRadius: theme.borderRadii.xl,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadii.round,
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    opacity: 0.9,
    paddingHorizontal: theme.spacing.lg,
  },
  body: {
    padding: theme.spacing.md,
  },
  nfcButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.button,
  },
  nfcButtonScanning: {
    opacity: 0.7,
  },
  nfcUnavailable: {
    flexDirection: 'row',
    backgroundColor: theme.colors.warningLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.lg,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  profilesSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    marginBottom: theme.spacing.lg,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadii.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  profileHeaderLeft: {
    flex: 1,
  },
  profileMeta: {
    marginTop: 4,
  },
  profileDetails: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  fieldLabel: {
    color: theme.colors.textDim,
  },
  fieldValue: {
    fontFamily: 'monospace',
  },
  selectButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    ...theme.shadows.button,
  },
  privacyNote: {
    backgroundColor: theme.colors.successLight,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadii.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: theme.spacing.xxl,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  privacyText: {
    color: theme.colors.textDim,
    lineHeight: 18,
  },
});

export default OnboardingScreen;
