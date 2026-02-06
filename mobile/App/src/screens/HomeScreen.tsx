/**
 * Home Screen
 * Main entry point for the MinKYC mobile app
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useWallet } from '../hooks/useWallet';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { connected, publicKey, connect, disconnect, connecting } = useWallet();

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MinKYC</Text>
        <Text style={styles.subtitle}>
          Privacy-Preserving Identity on Solana
        </Text>
      </View>

      <View style={styles.walletSection}>
        {connected ? (
          <>
            <View style={styles.walletConnected}>
              <Text style={styles.walletLabel}>Connected Wallet</Text>
              <Text style={styles.walletAddress}>
                {publicKey ? formatAddress(publicKey.toString()) : 'Unknown'}
              </Text>
            </View>
            <TouchableOpacity style={styles.disconnectButton} onPress={disconnect}>
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={[styles.connectButton, connecting && styles.connectingButton]} 
            onPress={connect}
            disabled={connecting}
          >
            <Text style={styles.connectButtonText}>
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>

        <TouchableOpacity 
          style={[styles.actionButton, !connected && styles.disabledButton]}
          onPress={() => navigation.navigate('Identity')}
          disabled={!connected}
        >
          <Text style={styles.actionButtonText}>📋 Manage Identity</Text>
          <Text style={styles.actionButtonSubtext}>View or create your identity</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, !connected && styles.disabledButton]}
          onPress={() => navigation.navigate('Scan')}
          disabled={!connected}
        >
          <Text style={styles.actionButtonText}>📡 Scan Passport (NFC)</Text>
          <Text style={styles.actionButtonSubtext}>Read ePassport chip data</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, !connected && styles.disabledButton]}
          onPress={() => navigation.navigate('Verify')}
          disabled={!connected}
        >
          <Text style={styles.actionButtonText}>✓ Generate Proof</Text>
          <Text style={styles.actionButtonSubtext}>Verify identity for a platform</Text>
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
  walletSection: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletConnected: {
    alignItems: 'center',
    marginBottom: 12,
  },
  walletLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  walletAddress: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9945FF',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  connectButton: {
    backgroundColor: '#9945FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  connectingButton: {
    opacity: 0.7,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disconnectButton: {
    borderWidth: 1,
    borderColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: '#ff4444',
    fontSize: 14,
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
  disabledButton: {
    opacity: 0.5,
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
