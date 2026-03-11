/**
 * Scan Screen
 * QR code scanning interface
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { VerificationRequestModal } from '../components/VerificationRequestModal';
import { VerificationExecutor } from '../components/VerificationExecutor';
import { parseVerificationRequest } from '../utils/qrParser';
import { sendReceipt } from '../utils/receiptSender';
import { saveHistoryItem } from '../utils/historyStorage';
import { VerificationRequest, VerificationReceipt } from '../types/verification';
import { AppText } from '../components/AppText';
import { theme } from '../constants/theme';
import { QrCode, ShieldPlus, X } from 'lucide-react-native';

const ScanScreen: React.FC = () => {
  const [scanningQR, setScanningQR] = useState(false);
  const [scannedRequest, setScannedRequest] = useState<VerificationRequest | null>(null);
  const [executingRequest, setExecutingRequest] = useState<VerificationRequest | null>(null);
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

  const injectMockRequest = () => {
    const mockReq: VerificationRequest = {
      platformId: "MOCK_PLATFORM_ID",
      requestId: "REQ_" + Math.random().toString(36).substr(2, 9),
      condition: "age >= 18",
      userId: "TEST_USER_123"
    };
    setScannedRequest(mockReq);
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSpacer} />
        
        <View style={styles.scanCard}>
          <QrCode size={64} color={theme.colors.primary} style={styles.scanIcon} />
          <AppText variant="h2" align="center" style={styles.title}>
            Scan KYC Request
          </AppText>
          <AppText variant="subtext" align="center" style={styles.instructions}>
            Scan a QR code from a supported platform to securely verify your identity without revealing your underlying data.
          </AppText>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={enableQRScanner}
          >
            <AppText weight="bold" color={theme.colors.surface}>
              Start Scanner
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mockButton}
            onPress={injectMockRequest}
          >
            <AppText variant="caption" color={theme.colors.primary} weight="semibold">
              Bypass / Inject Mock Request (Test Only)
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.securityNote}>
          <View style={styles.securityHeader}>
            <ShieldPlus size={20} color={theme.colors.success} style={{ marginRight: 8 }} />
            <AppText weight="semibold" color={theme.colors.textMain}>Local Verification</AppText>
          </View>
          <AppText variant="caption" style={styles.securityText}>
            MinKYC performs identity checks locally on your device. Only a zero-knowledge proof is sent to the requesting platform. Your actual passport data is never transmitted.
          </AppText>
        </View>
      </ScrollView>

      {scanningQR && device != null && (
        <View style={StyleSheet.absoluteFill}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={scanningQR}
            codeScanner={codeScanner}
          />
          <View style={styles.qrHeader}>
            <TouchableOpacity 
              style={styles.cancelQRButton} 
              onPress={() => setScanningQR(false)}
            >
              <X size={24} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
          <View style={styles.qrOverlay}>
            <View style={styles.qrTargetBox}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.instructionPill}>
              <AppText variant="caption" color={theme.colors.surface} weight="semibold">
                Align QR code within the frame
              </AppText>
            </View>
          </View>
        </View>
      )}

      {scanningQR && device == null && (
        <View style={[StyleSheet.absoluteFill, styles.noCameraContainer]}>
          <AppText align="center">No camera device found</AppText>
          <TouchableOpacity 
            style={[styles.scanButton, { marginTop: theme.spacing.xl }]} 
            onPress={() => setScanningQR(false)}
          >
            <AppText color={theme.colors.surface}>Cancel</AppText>
          </TouchableOpacity>
        </View>
      )}

      {executingRequest && (
        <View style={[StyleSheet.absoluteFill, styles.executionOverlay]}>
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
                Alert.alert('Verification Failed', 'Requirement NOT satisfied. ZK Proof generated but reflects failure.');
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
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  headerSpacer: {
    height: theme.spacing.xxl,
  },
  scanCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadii.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.card,
  },
  scanIcon: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.textMain,
  },
  instructions: {
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
    paddingHorizontal: theme.spacing.sm,
  },
  scanButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxl,
    borderRadius: theme.borderRadii.lg,
    alignItems: 'center',
    width: '100%',
    ...theme.shadows.button,
  },
  mockButton: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadii.md,
    width: '100%',
    alignItems: 'center',
  },
  securityNote: {
    backgroundColor: theme.colors.successLight,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadii.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)', // translucent success
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  securityText: {
    color: theme.colors.textDim,
    lineHeight: 18,
  },
  qrHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  cancelQRButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: theme.borderRadii.round,
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
    width: 260,
    height: 260,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: theme.colors.secondary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  instructionPill: {
    marginTop: theme.spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadii.round,
  },
  noCameraContainer: {
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  executionOverlay: {
    backgroundColor: theme.colors.background,
    zIndex: 100,
    justifyContent: 'center',
  },
});

export default ScanScreen;
