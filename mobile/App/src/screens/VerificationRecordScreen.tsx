import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { AppText } from '../components/AppText';
import { theme } from '../constants/theme';
import { CheckCircle, XCircle } from 'lucide-react-native';

type VerificationRecordRouteProp = RouteProp<RootStackParamList, 'HistoryDetail'>;

const VerificationRecordScreen: React.FC = () => {
  const route = useRoute<VerificationRecordRouteProp>();
  const { item } = route.params;

  const isSatisfied = item.satisfied !== false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.statusHeader}>
          {isSatisfied ? (
            <View style={[styles.statusBanner, styles.statusSuccess]}>
              <CheckCircle size={24} color={theme.colors.success} style={{ marginRight: 8 }} />
              <AppText variant="h2" color={theme.colors.success}>Verified</AppText>
            </View>
          ) : (
            <View style={[styles.statusBanner, styles.statusFailed]}>
              <XCircle size={24} color={theme.colors.error} style={{ marginRight: 8 }} />
              <AppText variant="h2" color={theme.colors.error}>Failed</AppText>
            </View>
          )}
        </View>

        <AppText variant="caption" style={styles.label}>Platform</AppText>
        <AppText variant="h3" style={styles.value}>{item.receipt.platformId}</AppText>
        
        <AppText variant="caption" style={styles.label}>Date Verified</AppText>
        <AppText style={styles.value}>
          {new Date(item.receipt.timestamp).toLocaleString()}
        </AppText>

        <AppText variant="caption" style={styles.label}>Condition Required</AppText>
        <AppText style={styles.value}>{item.condition}</AppText>

        {item.approvingUserName && (
          <View style={styles.highlightBox}>
            <AppText variant="caption" style={styles.label}>Approved by</AppText>
            <AppText weight="bold" style={styles.value}>{item.approvingUserName}</AppText>
          </View>
        )}
        
        <View style={styles.divider} />
        
        <AppText variant="caption" style={styles.label}>Receipt ID</AppText>
        <AppText style={styles.code}>{item.receipt.receiptId}</AppText>

        <AppText variant="caption" style={styles.label}>Request ID</AppText>
        <AppText style={styles.code}>{item.receipt.requestId}</AppText>
        
        <View style={styles.divider} />

        <AppText variant="h3" style={styles.sectionTitle}>ZK Proof Data</AppText>
        
        <AppText variant="caption" style={styles.subLabel}>Protocol</AppText>
        <AppText style={styles.code}>{item.receipt.proof.protocol} ({item.receipt.proof.curve})</AppText>

        <AppText variant="caption" style={styles.subLabel}>Public Signals</AppText>
        <AppText style={styles.codeBlock}>{JSON.stringify(item.receipt.publicSignals, null, 2)}</AppText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadii.xl,
    ...theme.shadows.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusHeader: {
    marginBottom: theme.spacing.xl,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadii.lg,
    borderWidth: 1,
  },
  statusSuccess: {
    backgroundColor: theme.colors.successLight,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusFailed: {
    backgroundColor: theme.colors.errorLight,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  subLabel: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  value: {
    color: theme.colors.textMain,
  },
  highlightBox: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
  },
  sectionTitle: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },
  code: {
    fontFamily: 'monospace',
    color: theme.colors.textDim,
  },
  codeBlock: {
    fontFamily: 'monospace',
    color: theme.colors.textMain,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
    overflow: 'hidden',
    marginTop: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xl,
  },
});

export default VerificationRecordScreen;
