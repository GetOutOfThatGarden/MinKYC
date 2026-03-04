/**
 * Scan Screen
 * NFC passport scanning interface
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { MOCK_PROFILES, PassportData } from '../constants/mockProfiles';



const ScanScreen: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<PassportData | null>(null);
  const [isMasked, setIsMasked] = useState(true);

  const startNFCScan = async () => {
    setScanning(true);

    try {
      // Integration point: NFC passport scanning
      // iOS: Use CoreNFC with NFCPassportReader
      // Android: Use android.nfc with JMRTD library

      // TODO: Implement actual NFC scanning
      // const passportReader = new PassportReader();
      // const data = await passportReader.scan({
      //   documentNumber: passportNumber,
      //   dateOfBirth: dob,
      //   dateOfExpiry: expiry,
      // });

      // Mock delay for demo
      setTimeout(() => {
        setScanning(false);
        setScannedData(MOCK_PROFILES.profile1); // Default to Profile 1 on "scan"
      }, 3000);

    } catch (error) {
      setScanning(false);
      Alert.alert('Scan Failed', 'Could not read passport chip. Please try again.');
    }
  };

  const saveToIdentity = () => {
    // Integration point: Hash passport data and create commitment
    Alert.alert('Coming Soon', 'Identity creation with scanned data will be implemented');
  };

  const selectMockProfile = (profileKey: string) => {
    setScannedData(MOCK_PROFILES[profileKey]);
    setIsMasked(true);
  };

  return (
    <ScrollView style={styles.container}>
      {!scannedData ? (
        <>
          <View style={styles.scanArea}>
            <View style={[styles.nfcIcon, scanning && styles.scanningActive]}>
              <Text style={styles.nfcIconText}>📡</Text>
            </View>

            <Text style={styles.title}>
              {scanning ? 'Scanning...' : 'Scan ePassport'}
            </Text>

            <Text style={styles.instructions}>
              {scanning
                ? 'Hold your phone near the passport chip. Keep it steady...'
                : 'Hold your phone near the passport chip to read data securely.'}
            </Text>

            {scanning && (
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.scanButton, scanning && styles.scanningButton]}
            onPress={startNFCScan}
            disabled={scanning}
          >
            <Text style={styles.scanButtonText}>
              {scanning ? 'Scanning...' : 'Start NFC Scan'}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>📖 How to Scan</Text>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Open your passport to the photo page</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Locate the chip symbol (usually on the cover)</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Hold phone near the chip area</Text>
            </View>
          </View>

          <View style={styles.mockProfilesSection}>
            <Text style={styles.infoTitle}>🧪 Testing: Select Mock Profile</Text>
            {Object.keys(MOCK_PROFILES).map((key, index) => {
              const profile = MOCK_PROFILES[key];
              return (
                <TouchableOpacity
                  key={key}
                  style={styles.mockProfileButton}
                  onPress={() => selectMockProfile(key)}
                >
                  <Text style={styles.mockProfileText}>
                    Profile {index + 1}: {profile.nationality} {profile.sex === 'M' ? 'Male' : 'Female'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.securityNote}>
            <Text style={styles.securityTitle}>🔒 Security Note</Text>
            <Text style={styles.securityText}>
              Passport data is read locally and never transmitted.
              Only a cryptographic hash is stored on-chain.
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>✓ Scan Complete</Text>

          <TouchableOpacity
            style={styles.toggleMaskButton}
            onPress={() => setIsMasked(!isMasked)}
          >
            <Text style={styles.toggleMaskText}>
              {isMasked ? '👁️ Show Sensitive Data' : '🙈 Hide Sensitive Data'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dataCard}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Surname</Text>
              <Text style={styles.dataValue}>{isMasked ? '****' : scannedData.surname}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Given Names</Text>
              <Text style={styles.dataValue}>{isMasked ? '****' : scannedData.givenNames}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nationality</Text>
              <Text style={styles.dataValue}>{isMasked ? '****' : scannedData.nationality}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Date of Birth</Text>
              <Text style={styles.dataValue}>{isMasked ? '****' : scannedData.dateOfBirth}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Passport No.</Text>
              <Text style={styles.dataValue}>***{scannedData.passportNumber.slice(-4)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveToIdentity}>
            <Text style={styles.saveButtonText}>Create Identity</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => setScannedData(null)}
          >
            <Text style={styles.scanAgainText}>Scan Again</Text>
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
    padding: 16,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nfcIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#9945FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scanningActive: {
    backgroundColor: '#14F195',
  },
  nfcIconText: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 24,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#9945FF',
  },
  scanButton: {
    backgroundColor: '#9945FF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  scanningButton: {
    backgroundColor: '#14F195',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#9945FF',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 14,
    color: '#555',
  },
  mockProfilesSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  mockProfileButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mockProfileText: {
    fontSize: 14,
    color: '#9945FF',
    fontWeight: '500',
  },
  securityNote: {
    backgroundColor: '#e8f4f8',
    padding: 16,
    borderRadius: 12,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  securityText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#14F195',
    textAlign: 'center',
    marginBottom: 24,
  },
  dataCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleMaskButton: {
    backgroundColor: '#e8f4f8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#b3e5fc',
  },
  toggleMaskText: {
    color: '#0288d1',
    fontWeight: '600',
    fontSize: 14,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#14F195',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scanAgainButton: {
    padding: 12,
    alignItems: 'center',
  },
  scanAgainText: {
    color: '#9945FF',
    fontSize: 14,
  },
});

export default ScanScreen;
