/**
 * Home Screen
 * Main entry point for the MinKYC mobile app.
 * Redirects to Onboarding if no identity data exists.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useWallet } from '../hooks/useWallet';
import { hasPassportData, getPassportData } from '../utils/secureStorage';
import { AppText } from '../components/AppText';
import { theme } from '../constants/theme';
import { ScanLine, UserSquare, ScrollText, Settings, CheckCircle } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface ActionButtonProps {
  label: string;
  description: string;
  icon: LucideIcon;
  onPress: () => void;
  iconColor?: string;
}

const ActionButton = React.memo(({ label, description, icon: Icon, onPress, iconColor }: ActionButtonProps) => (
  <TouchableOpacity
    style={styles.actionButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.actionIconContainer}>
      <Icon size={24} color={iconColor || theme.colors.primary} />
    </View>
    <View style={styles.actionTextContainer}>
      <AppText weight="semibold">{label}</AppText>
      <AppText variant="subtext">{description}</AppText>
    </View>
  </TouchableOpacity>
));

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  // On every focus: check if identity exists, redirect to onboarding if not
  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      async function check() {
        const exists = await hasPassportData();
        if (!exists) {
          navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          return;
        }
        const data = await getPassportData();
        if (mounted && data) {
          setUserName(`${data.givenNames} ${data.surname}`);
        }
        if (mounted) setLoading(false);
      }
      check();
      return () => { mounted = false; };
    }, [navigation])
  );

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <AppText variant="h1" color={theme.colors.surface}>MinKYC</AppText>
        <AppText variant="subtext" color={theme.colors.surface} style={styles.subtitle}>
          Privacy-Preserving Identity on Solana
        </AppText>
      </View>

      <View style={styles.identitySection}>
        <AppText variant="caption" style={styles.identityLabel}>Identity Status</AppText>

        {userName && (
          <View style={styles.identityNameContainer}>
            <CheckCircle size={20} color={theme.colors.success} style={styles.iconMargin} />
            <AppText variant="h2">{userName}</AppText>
          </View>
        )}

        {publicKey && (
          <AppText style={styles.accountId}>
            Account ID: {formatAddress(publicKey.toString())}
          </AppText>
        )}
      </View>

      <View style={styles.actionsSection}>
        <AppText variant="h3" style={styles.sectionTitle}>Identity Actions</AppText>

        <ActionButton
          label="My Identity"
          description="Secure passport credentials & proofs"
          icon={UserSquare}
          onPress={() => navigation.navigate('Identity')}
        />

        <ActionButton
          label="Verify Identity"
          description="Scan request for zero-knowledge verification"
          icon={ScanLine}
          onPress={() => navigation.navigate('Scan')}
        />

        <ActionButton
          label="Audit Log"
          description="Review past verification history"
          icon={ScrollText}
          onPress={() => navigation.navigate('History')}
        />

        <ActionButton
          label="Security Settings"
          description="Manage keys and identity data"
          icon={Settings}
          iconColor={theme.colors.iconDim}
          onPress={() => navigation.navigate('Settings' as any)}
        />
      </View>

      <View style={styles.infoSection}>
        <AppText weight="semibold" style={styles.infoTitle}>About MinKYC</AppText>
        <AppText variant="subtext" style={styles.infoText}>
          MinKYC is a privacy-preserving identity protocol. Your passport data
          never leaves your device — only cryptographic proofs are shared.
        </AppText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    alignItems: 'center',
    borderBottomLeftRadius: theme.borderRadii.xl,
    borderBottomRightRadius: theme.borderRadii.xl,
    // Modern platform shadow
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    opacity: 0.9,
  },
  identitySection: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    marginTop: -theme.spacing.lg,
    borderRadius: theme.borderRadii.lg,
    ...theme.shadows.card,
    alignItems: 'center',
  },
  identityLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  identityNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  iconMargin: {
    marginRight: theme.spacing.sm,
  },
  accountId: {
    color: theme.colors.textLight,
    fontFamily: 'monospace',
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing.xs,
  },
  actionsSection: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.textMain,
    marginLeft: theme.spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadii.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadii.md,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  infoSection: {
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadii.lg,
  },
  infoTitle: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    lineHeight: 20,
    color: theme.colors.textDim,
  },
});

export default HomeScreen;
