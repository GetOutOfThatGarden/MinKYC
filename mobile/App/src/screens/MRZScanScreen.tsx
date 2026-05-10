import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Zap } from 'lucide-react-native';
import { AppText } from '../components/AppText';
import { MRZCameraOverlay } from '../components/MRZCameraOverlay';
import { theme } from '../constants/theme';
import { parseMRZ } from '../utils/mrzParser';

const MRZScanScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const navigation = useNavigation<any>();
  const device = useCameraDevice('back');

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleManualEntry = () => {
    // Navigate to manual entry screen (future task) or Alert for now
    Alert.alert('Manual Entry', 'Manual entry will be implemented in a future update.');
  };

  // Simulated OCR Success for demonstration/testing
  // In a real implementation, this would be called from a Frame Processor
  const simulateScan = () => {
    const line1 = 'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<';
    const line2 = 'L898902C36UTO7408122F1204159ZE184226B<<<<<10';
    
    try {
      const result = parseMRZ([line1, line2]);
      setIsActive(false);
      Alert.alert(
        'Passport Scanned',
        `Document: ${result.documentNumber}\nDOB: ${result.dateOfBirth}\nExpiry: ${result.expiryDate}`,
        [
          { 
            text: 'Continue to NFC', 
            onPress: () => {
              // Try to find if we came from Identity or Onboarding
              const routes = navigation.getState().routes;
              const prevRoute = routes[routes.length - 2]?.name;
              navigation.navigate(prevRoute || 'Home', { mrzData: result });
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Scan Error', error.message);
    }
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AppText variant="h2" align="center">Camera Permission Required</AppText>
          <AppText align="center" style={styles.errorText}>
            We need camera access to scan your passport's MRZ zone.
          </AppText>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AppText color={theme.colors.surface}>Go Back</AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AppText align="center">No camera device found</AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        // Frame processor would go here:
        // frameProcessor={frameProcessor}
      />
      
      <MRZCameraOverlay />

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={theme.colors.surface} />
        </TouchableOpacity>
        <AppText variant="h3" color={theme.colors.surface}>Scan Passport</AppText>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.mockButton}
          onPress={simulateScan}
        >
          <Zap size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
          <AppText variant="caption" color={theme.colors.primary} weight="bold">
            Simulate Successful OCR
          </AppText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.manualButton}
          onPress={handleManualEntry}
        >
          <AppText color={theme.colors.surface} weight="semibold">
            Enter Details Manually
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: theme.borderRadii.round,
  },
  manualButton: {
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  mockButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadii.round,
    alignItems: 'center',
    marginBottom: 20,
    ...theme.shadows.button,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    color: theme.colors.textDim,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: theme.borderRadii.lg,
  },
});

export default MRZScanScreen;
