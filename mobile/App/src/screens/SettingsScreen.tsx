/**
 * Settings Screen
 * App preferences and identity reset.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../hooks/useWallet';
import { clearAllData } from '../utils/secureStorage';

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
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.dangerButton} onPress={handleReset}>
          <Text style={styles.dangerButtonText}>🗑️ Delete Identity & Reset App</Text>
          <Text style={styles.dangerSubtext}>
            Removes all passport data, keys, and history from this device.
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>0.1.0 (MVP)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Protocol</Text>
          <Text style={styles.infoValue}>MinKYC on Solana</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    margin: 16,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
  },
  dangerSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default SettingsScreen;
