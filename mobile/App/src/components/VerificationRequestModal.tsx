import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { VerificationRequest } from '../types/verification';
import { AppText } from './AppText';
import { theme } from '../constants/theme';
import { ShieldCheck, Info } from 'lucide-react-native';

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
          <View style={styles.header}>
            <ShieldCheck size={32} color={theme.colors.primary} style={styles.headerIcon} />
            <AppText variant="h2" align="center" style={styles.title}>
              Verification Request
            </AppText>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <AppText variant="caption" style={styles.label}>Platform</AppText>
              <AppText variant="h3" style={styles.value}>{request.platformId}</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" style={styles.label}>What they want to verify</AppText>
              <AppText variant="body" weight="medium" style={styles.value}>
                Confirm that user is {request.condition}
              </AppText>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Info size={16} color={theme.colors.secondary} style={{ marginRight: 8, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <AppText variant="subtext" color={theme.colors.secondary} weight="semibold">
                Privacy Assured
              </AppText>
              <AppText variant="caption" color={theme.colors.secondary}>
                No personal documents will be shared.
              </AppText>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={onReject}>
              <AppText weight="semibold" color={theme.colors.error}>Reject</AppText>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={onApprove}>
              <AppText weight="semibold" color={theme.colors.surface}>Approve</AppText>
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
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadii.xl,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...theme.shadows.card,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerIcon: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.textMain,
  },
  detailsContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadii.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailRow: {
    flexDirection: 'column',
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.textDim,
  },
  value: {
    color: theme.colors.textMain,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.secondaryLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)', // light blue border
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButton: {
    backgroundColor: theme.colors.errorLight,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  approveButton: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.button,
  },
});
