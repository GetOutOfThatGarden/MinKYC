/**
 * Home Screen
 * Main entry point for the MinKYC mobile app.
 * Redirects to Onboarding if no identity data exists.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useWallet } from '../hooks/useWallet';
import { hasPassportData, getPassportData } from '../utils/secureStorage';
import { PassportData } from '../constants/mockProfiles';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { connected, publicKey } = useWallet();
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
        <ActivityIndicator size="large" color="#9945FF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MinKYC</Text>
        <Text style={styles.subtitle}>
          Privacy-Preserving Identity on Solana
        </Text>
      </View>

      <View style={styles.identitySection}>
        <Text style={styles.identityLabel}>Identity Status</Text>

        {userName && (
          <Text style={styles.identityName}>
            ✅ {userName}
          </Text>
        )}

        {publicKey && (
          <Text style={styles.accountId}>
            Account ID: {formatAddress(publicKey.toString())}
          </Text>
        )}
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Identity')}
        >
          <Text style={styles.actionButtonText}>📋 My Identity</Text>
          <Text style={styles.actionButtonSubtext}>View your passport data & commitment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={styles.actionButtonText}>📷 Scan QR</Text>
          <Text style={styles.actionButtonSubtext}>Scan a QR code to verify your identity</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.actionButtonText}>📜 Verification History</Text>
          <Text style={styles.actionButtonSubtext}>View past verifications & receipts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Settings' as any)}
        >
          <Text style={styles.actionButtonText}>⚙️ Settings</Text>
          <Text style={styles.actionButtonSubtext}>Reset identity, app preferences</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About MinKYC</Text>
        <Text style={styles.infoText}>
          MinKYC is a privacy-preserving identity protocol. Your passport data
          never leaves your device — only cryptographic proofs are shared.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#9945FF',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 8,
  },
  identitySection: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  identityLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  identityName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  accountId: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'monospace',
  },
  actionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionButtonSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  infoSection: {
    padding: 16,
    margin: 16,
    marginTop: 0,
    backgroundColor: '#e8f4f8',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default HomeScreen;
