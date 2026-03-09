/**
 * Onboarding Screen
 * First screen for new users: scan a passport via NFC or select a mock profile.
 * Mock profiles are expandable accordions showing all passport fields.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🛂</Text>
        <Text style={styles.headerTitle}>Welcome to MinKYC</Text>
        <Text style={styles.headerSubtitle}>
          To get started, read your passport or choose a test profile below.
        </Text>
      </View>

      {/* NFC Section */}
      {isSupported && (
        <TouchableOpacity
          style={[styles.nfcButton, scanning && styles.nfcButtonScanning]}
          onPress={startNFCScan}
          disabled={scanning}
        >
          <Text style={styles.nfcButtonText}>
            {scanning ? '📡 Scanning...' : '📡 Read Passport via NFC'}
          </Text>
        </TouchableOpacity>
      )}

      {!isSupported && (
        <View style={styles.nfcUnavailable}>
          <Text style={styles.nfcUnavailableText}>
            📡 NFC not available on this device. Please use a test profile below.
          </Text>
        </View>
      )}

      {/* Mock Profiles */}
      <View style={styles.profilesSection}>
        <Text style={styles.sectionTitle}>Test Profiles</Text>
        <Text style={styles.sectionSubtitle}>
          Tap to preview passport data, then select to create your identity.
        </Text>

        {Object.keys(MOCK_PROFILES).map((key, index) => {
          const profile = MOCK_PROFILES[key];
          const isExpanded = expandedProfile === key;

          return (
            <View key={key} style={styles.profileCard}>
              <TouchableOpacity
                style={styles.profileHeader}
                onPress={() => toggleExpand(key)}
              >
                <View style={styles.profileHeaderLeft}>
                  <Text style={styles.profileName}>
                    {profile.givenNames} {profile.surname}
                  </Text>
                  <Text style={styles.profileMeta}>
                    {profile.nationality} • {profile.sex === 'M' ? 'Male' : profile.sex === 'F' ? 'Female' : 'Other'}
                  </Text>
                </View>
                <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.profileDetails}>
                  {(Object.keys(FIELD_LABELS) as (keyof PassportData)[]).map((field) => (
                    <View key={field} style={styles.fieldRow}>
                      <Text style={styles.fieldLabel}>{FIELD_LABELS[field]}</Text>
                      <Text style={styles.fieldValue}>{profile[field]}</Text>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleSelectProfile(profile)}
                  >
                    <Text style={styles.selectButtonText}>Use This Profile</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.privacyNote}>
        <Text style={styles.privacyTitle}>🔒 Your Data Stays Private</Text>
        <Text style={styles.privacyText}>
          Passport data is encrypted and stored only on your device.
          Only a cryptographic hash is ever shared.
        </Text>
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
  header: {
    backgroundColor: '#9945FF',
    padding: 32,
    paddingTop: 24,
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0d0ff',
    textAlign: 'center',
    lineHeight: 20,
  },
  nfcButton: {
    backgroundColor: '#14F195',
    margin: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  nfcButtonScanning: {
    opacity: 0.7,
  },
  nfcButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nfcUnavailable: {
    backgroundColor: '#fff3cd',
    margin: 16,
    padding: 14,
    borderRadius: 10,
  },
  nfcUnavailableText: {
    color: '#856404',
    fontSize: 13,
    textAlign: 'center',
  },
  profilesSection: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  profileHeaderLeft: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  profileMeta: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 14,
    color: '#9945FF',
    marginLeft: 12,
  },
  profileDetails: {
    backgroundColor: '#fafafa',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  selectButton: {
    backgroundColor: '#9945FF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  privacyNote: {
    backgroundColor: '#e8f4f8',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  privacyText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default OnboardingScreen;
