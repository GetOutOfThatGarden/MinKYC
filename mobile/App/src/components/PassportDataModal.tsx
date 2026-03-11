import React, { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { AppText } from './AppText';
import { theme } from '../constants/theme';

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
              <AppText variant="h3" style={styles.modalTitle}>Enter Passport Details</AppText>
              <AppText variant="caption" style={styles.modalSubtitle}>
                Required for secure NFC authentication (Basic Access Control).
              </AppText>

              <View style={styles.inputGroup}>
                <AppText variant="caption" style={styles.label}>Passport Number</AppText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. L898902C"
                  value={passportNumber}
                  onChangeText={setPassportNumber}
                  autoCapitalize="characters"
                  placeholderTextColor={theme.colors.textDim}
                />
              </View>

              <View style={styles.inputGroup}>
                <AppText variant="caption" style={styles.label}>Date of Birth (YYMMDD)</AppText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 800101"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor={theme.colors.textDim}
                />
              </View>

              <View style={styles.inputGroup}>
                <AppText variant="caption" style={styles.label}>Expiry Date (YYMMDD)</AppText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 300101"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor={theme.colors.textDim}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                  disabled={isLoading}
                >
                  <AppText weight="semibold" color={theme.colors.textDim}>Cancel</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.submitButton, isLoading && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <AppText weight="semibold" color={theme.colors.surface}>
                    {isLoading ? 'Processing...' : 'Start Scan'}
                  </AppText>
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
    padding: theme.spacing.xl,
  },
  modalContainer: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadii.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  modalTitle: {
    marginBottom: theme.spacing.xs,
  },
  modalSubtitle: {
    color: theme.colors.textDim,
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.textMain,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadii.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textMain,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.lg,
  },
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadii.md,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default PassportDataModal;
