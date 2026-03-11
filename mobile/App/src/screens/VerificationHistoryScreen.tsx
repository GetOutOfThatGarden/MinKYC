import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getHistory } from '../utils/historyStorage';
import { VerificationHistoryItem } from '../types/verification';
import { AppText } from '../components/AppText';
import { theme } from '../constants/theme';
import { Building, Calendar, Receipt, ChevronRight, CheckCircle, XCircle } from 'lucide-react-native';

type VerificationHistoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

const VerificationHistoryScreen: React.FC = () => {
  const navigation = useNavigation<VerificationHistoryNavigationProp>();
  const [history, setHistory] = useState<VerificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    try {
      const items = await getHistory();
      // Sort newest first
      items.sort((a, b) => new Date(b.receipt.timestamp).getTime() - new Date(a.receipt.timestamp).getTime());
      setHistory(items);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const renderItem = ({ item }: { item: VerificationHistoryItem }) => {
    // Default satisfied to true for legacy items without the field
    const isSatisfied = item.satisfied !== false;
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('HistoryDetail', { item })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.platformIcon}>
            <Building size={16} color={theme.colors.primary} />
          </View>
          <AppText weight="bold" style={styles.platformId}>{item.receipt.platformId}</AppText>
          <View style={{ flex: 1 }} />
          <Calendar size={12} color={theme.colors.iconDim} style={{ marginRight: 4 }} />
          <AppText variant="caption">{new Date(item.receipt.timestamp).toLocaleDateString()}</AppText>
        </View>

        <View style={styles.cardBody}>
          <AppText variant="subtext" style={styles.conditionLabel}>Condition Verified:</AppText>
          <AppText weight="medium" style={styles.conditionValue}>"{item.condition}"</AppText>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.statusPillContainer}>
            {isSatisfied ? (
              <View style={[styles.statusPill, styles.statusSuccess]}>
                <CheckCircle size={12} color={theme.colors.success} style={{ marginRight: 4 }} />
                <AppText variant="caption" color={theme.colors.success}>Satisfied</AppText>
              </View>
            ) : (
              <View style={[styles.statusPill, styles.statusFailed]}>
                <XCircle size={12} color={theme.colors.error} style={{ marginRight: 4 }} />
                <AppText variant="caption" color={theme.colors.error}>Failed</AppText>
              </View>
            )}
            <View style={styles.receiptContainer}>
              <Receipt size={12} color={theme.colors.iconDim} style={{ marginRight: 4 }} />
              <AppText variant="caption" style={styles.receiptId}>
                ID: {item.receipt.receiptId.slice(0, 8)}...
              </AppText>
            </View>
          </View>
          <ChevronRight size={20} color={theme.colors.border} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : history.length === 0 ? (
        <View style={styles.center}>
          <Receipt size={48} color={theme.colors.iconDim} style={{ opacity: 0.5, marginBottom: 16 }} />
          <AppText variant="subtext" align="center">No verifications yet.</AppText>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.receipt.receiptId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadii.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  platformIcon: {
    padding: 6,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadii.sm,
    marginRight: theme.spacing.sm,
  },
  platformId: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textMain,
  },
  cardBody: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  conditionLabel: {
    marginBottom: theme.spacing.xs,
  },
  conditionValue: {
    color: theme.colors.textMain,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadii.round,
    marginRight: theme.spacing.sm,
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
  receiptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadii.sm,
  },
  receiptId: {
    fontFamily: 'monospace',
  },
});

export default VerificationHistoryScreen;
