import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { VerificationRequest } from '../types/verification';

interface VerificationRequestModalProps {
  request: VerificationRequest | null;
  visible: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export const VerificationRequestModal: React.FC<VerificationRequestModalProps> = ({
  request,
  visible,
  onApprove,
  onReject,
}) => {
  if (!request) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Verification Request</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Platform:</Text>
              <Text style={styles.value}>{request.platformId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Request:</Text>
              <Text style={styles.value}>Confirm that {request.userId} is {request.condition}</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Data shared: Verification result only</Text>
            <Text style={styles.infoText}>No personal documents will be shared.</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={onReject}>
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={onApprove}>
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    color: '#0d47a1',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  rejectButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
  approveButton: {
    backgroundColor: '#14F195',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
