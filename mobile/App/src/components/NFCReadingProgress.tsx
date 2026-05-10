import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CheckCircle2, Scan, Nfc, AlertCircle } from 'lucide-react-native';

export type NFCStep = 'IDLE' | 'SCANNING' | 'TAG_DETECTED' | 'AUTHENTICATING' | 'READING_DATA' | 'COMPLETED' | 'ERROR';

interface NFCReadingProgressProps {
  visible: boolean;
  step: NFCStep;
  progress?: number; // 0 to 100
  error?: string | null;
  onClose?: () => void;
}

export const NFCReadingProgress: React.FC<NFCReadingProgressProps> = ({ visible, step, progress, error, onClose }) => {
  const getIcon = () => {
    switch (step) {
      case 'IDLE':
      case 'SCANNING':
        return <Scan size={48} color="#6366f1" />;
      case 'TAG_DETECTED':
      case 'AUTHENTICATING':
        return <Nfc size={48} color="#6366f1" />;
      case 'READING_DATA':
        return <ActivityIndicator size="large" color="#6366f1" />;
      case 'COMPLETED':
        return <CheckCircle2 size={48} color="#22c55e" />;
      case 'ERROR':
        return <AlertCircle size={48} color="#ef4444" />;
      default:
        return <Scan size={48} color="#6366f1" />;
    }
  };

  const getStatusMessage = () => {
    switch (step) {
      case 'IDLE':
        return 'Ready to scan';
      case 'SCANNING':
        return 'Searching for passport...';
      case 'TAG_DETECTED':
        return 'Passport detected!';
      case 'AUTHENTICATING':
        return 'Authenticating (PACE/BAC)...';
      case 'READING_DATA':
        return 'Reading passport data...';
      case 'COMPLETED':
        return 'Success!';
      case 'ERROR':
        return error || 'An error occurred';
      default:
        return '';
    }
  };

  if (!visible || step === 'IDLE') return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>{getIcon()}</View>
        <Text style={styles.title}>{getStatusMessage()}</Text>
        
        {(step === 'SCANNING' || step === 'TAG_DETECTED' || step === 'AUTHENTICATING' || step === 'READING_DATA') && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress || 0}%` }]} />
            <Text style={styles.progressText}>{progress || 0}%</Text>
          </View>
        )}

        {step === 'ERROR' && (
          <View style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'COMPLETED' && (
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: '#22c55e' }]}>
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
