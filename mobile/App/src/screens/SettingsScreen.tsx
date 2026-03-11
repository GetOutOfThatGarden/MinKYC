/**
 * Settings Screen
 * App preferences and identity reset.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../hooks/useWallet';
import { clearAllData } from '../utils/secureStorage';
import { AppText } from '../components/AppText';
import { theme } from '../constants/theme';
import { Trash2, Smartphone, ShieldCheck } from 'lucide-react-native';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { disconnect } = useWallet();

  const handleReset = () => {
    Alert.alert(
      'Reset App',
      'This will delete your passport data, identity commitment, and account keys. You will need to set up again.\n\nAre you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await disconnect();
              navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
            } catch {
              Alert.alert('Error', 'Failed to reset. Please try again.');
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <AppText variant="caption" style={styles.sectionTitle}>Account</AppText>

        <TouchableOpacity style={styles.dangerButton} onPress={handleReset}>
          <View style={styles.dangerHeader}>
            <Trash2 size={20} color={theme.colors.error} style={{ marginRight: 8 }} />
            <AppText weight="semibold" color={theme.colors.error}>
              Delete Identity & Reset App
            </AppText>
          </View>
          <AppText variant="subtext" style={styles.dangerSubtext}>
            Removes all passport data, keys, and history from this device.
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <AppText variant="caption" style={styles.sectionTitle}>About</AppText>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabelContainer}>
            <Smartphone size={18} color={theme.colors.iconDim} style={{ marginRight: 8 }} />
            <AppText variant="subtext">App Version</AppText>
          </View>
          <AppText weight="medium">0.1.0 (MVP)</AppText>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabelContainer}>
            <ShieldCheck size={18} color={theme.colors.iconDim} style={{ marginRight: 8 }} />
            <AppText variant="subtext">Protocol</AppText>
          </View>
          <AppText weight="medium">MinKYC on Solana</AppText>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    margin: theme.spacing.md,
    marginBottom: 0,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  dangerButton: {
    backgroundColor: theme.colors.errorLight,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadii.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  dangerSubtext: {
    color: '#B91C1C', // darker red for readability on light red bg
    marginLeft: 28, // align with text above
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SettingsScreen;
