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
import { savePassportData, computeCommitment, saveCommitment } from '../utils/secureStorage';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { VerificationRequestModal } from '../components/VerificationRequestModal';
import { VerificationExecutor } from '../components/VerificationExecutor';
import { parseVerificationRequest } from '../utils/qrParser';
import { sendReceipt } from '../utils/receiptSender';
import { saveHistoryItem } from '../utils/historyStorage';
import { VerificationRequest, VerificationReceipt } from '../types/verification';

const ScanScreen: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scanningQR, setScanningQR] = useState(false);
  const [scannedData, setScannedData] = useState<PassportData | null>(null);
  const [scannedRequest, setScannedRequest] = useState<VerificationRequest | null>(null);
  const [executingRequest, setExecutingRequest] = useState<VerificationRequest | null>(null);
  const [isMasked, setIsMasked] = useState(true);
  const navigation = useNavigation<any>();
  const device = useCameraDevice('back');

  const enableQRScanner = async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'granted') {
      setScanningQR(true);
    } else {
      Alert.alert('Permission Denied', 'Camera access is required to scan QR codes.');
    }
  };

   const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (scanningQR && codes.length > 0 && codes[0].value) {
        try {
          const req = parseVerificationRequest(codes[0].value);
          setScanningQR(false); 
          setScannedRequest(req);
        } catch (e: any) {
          console.log('Skipping non-MinKYC QR: ', e.message);
        }
      }
    }
  });

  const saveToIdentity = async () => {
    if (!scannedData) return;
    try {
      await savePassportData(scannedData);
      const secret = "min_kyc_secret_nonce_2026";
      const commitmentHash = computeCommitment(scannedData, secret);
      await saveCommitment(commitmentHash);
      
      Alert.alert('Success', 'Passport data securely isolated. Identity commitment created.', [
        { text: 'View Identity', onPress: () => navigation.navigate('Identity') }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to securely store passport data.');
    }
  };

  const selectMockProfile = (profileKey: string) => {
    setScannedData(MOCK_PROFILES[profileKey]);
    setIsMasked(true);
  };

  const injectTestQR = () => {
    const mockQR = JSON.stringify({
      minkyc: true,
      type: 'verify_request',
      platformId: 'MockPlatform_EMU',
      requestId: `req_${Date.now()}`,
      condition: 'Age >= 18',
      userId: 'user_anon_2026'
    });
    try {
      const req = parseVerificationRequest(mockQR);
      setScannedRequest(req);
    } catch (e: any) {
      Alert.alert('Testing Error', e.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {!scannedData ? (
          <>
          <TouchableOpacity
            style={[styles.scanButton, { backgroundColor: '#3498db', marginTop: 100 }]}
            onPress={enableQRScanner}
          >
            <Text style={styles.scanButtonText}>
              Scan QR
            </Text>
          </TouchableOpacity>

          <View style={styles.securityNote}>
            <Text style={styles.securityTitle}>🔒 Security Note</Text>
            <Text style={styles.securityText}>
              Verification is performed locally. Only a zero-knowledge proof
              is generated to prove you satisfy the requirements.
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

       {scanningQR && device != null && (
        <View style={StyleSheet.absoluteFill}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={scanningQR}
            codeScanner={codeScanner}
          />
          <TouchableOpacity 
            style={styles.cancelQRButton} 
            onPress={() => setScanningQR(false)}
          >
            <Text style={styles.cancelQRText}>Cancel</Text>
          </TouchableOpacity>
          <View style={styles.qrOverlay}>
            <View style={styles.qrTargetBox} />
            <Text style={styles.qrInstructionText}>Align QR code within the frame</Text>
          </View>
        </View>
      )}

      {scanningQR && device == null && (
        <View style={StyleSheet.absoluteFill}>
          <Text style={{ marginTop: 100, textAlign: 'center' }}>No camera device found</Text>
          <TouchableOpacity 
            style={styles.cancelQRButton} 
            onPress={() => setScanningQR(false)}
          >
            <Text style={styles.cancelQRText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {executingRequest && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', zIndex: 100, justifyContent: 'center' }]}>
          <VerificationExecutor
            request={executingRequest}
            onReceipt={async (receipt: VerificationReceipt, satisfied: boolean, approvingUserName?: string) => {
              setExecutingRequest(null);
              // Save to local history
              if (executingRequest) {
                await saveHistoryItem({ 
                  receipt, 
                  condition: executingRequest.condition,
                  satisfied,
                  approvingUserName
                });
              }
              const success = await sendReceipt(receipt);
              
              if (satisfied) {
                if (success) {
                  Alert.alert('Verification Successful', 'Requirement satisfied. ZK Proof generated and receipt delivered!');
                } else {
                  Alert.alert('Verification Successful', 'Requirement satisfied. ZK Proof generated, but failed to deliver receipt.');
                }
              } else {
                Alert.alert('Verification Failed', 'Requirement NOT satisfied (Age check failed). ZK Proof generated but reflects failure.');
              }
            }}
            onError={(error: string) => {
              setExecutingRequest(null);
              Alert.alert('Verification Failed', error);
            }}
          />
        </View>
      )}

      <VerificationRequestModal
        visible={scannedRequest !== null}
        request={scannedRequest}
        onApprove={() => {
          if (scannedRequest) {
            setExecutingRequest(scannedRequest);
          }
          setScannedRequest(null);
        }}
        onReject={() => {
          setScannedRequest(null);
        }}
      />
    </View>
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
  cancelQRButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  cancelQRText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrTargetBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#14F195',
    backgroundColor: 'transparent',
  },
  qrInstructionText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 8,
  },
});

export default ScanScreen;
