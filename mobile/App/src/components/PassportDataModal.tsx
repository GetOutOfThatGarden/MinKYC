import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

interface PassportDataModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (passportNumber: string, dateOfBirth: string, expiryDate: string) => void;
  isLoading?: boolean;
}

const PassportDataModal: React.FC<PassportDataModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [passportNumber, setPassportNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(''); // YYMMDD
  const [expiryDate, setExpiryDate] = useState(''); // YYMMDD

  const handleSubmit = () => {
    if (!passportNumber || !dateOfBirth || !expiryDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    // Simple length validation for YYMMDD
    if (dateOfBirth.length !== 6 || expiryDate.length !== 6) {
      Alert.alert('Error', 'Dates must be in YYMMDD format (6 digits)');
      return;
    }
    onSubmit(passportNumber, dateOfBirth, expiryDate);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Passport Details</Text>
              <Text style={styles.modalSubtitle}>
                Required for secure NFC authentication (Basic Access Control).
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Passport Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. L898902C"
                  value={passportNumber}
                  onChangeText={setPassportNumber}
                  autoCapitalize="characters"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth (YYMMDD)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 800101"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Expiry Date (YYMMDD)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 300101"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.submitButton, isLoading && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Processing...' : 'Start Scan'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#9945FF',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default PassportDataModal;
