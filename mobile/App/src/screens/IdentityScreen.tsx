/**
 * Identity Screen
 * Manage user's on-chain identity
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useWallet } from '../hooks/useWallet';

interface IdentityData {
  owner: string;
  commitment: number[];
  revoked: boolean;
  index: string;
  verificationCount: string;
}

const IdentityScreen: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [identity, setIdentity] = useState<IdentityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasIdentity, setHasIdentity] = useState(false);

  // TODO: Fetch identity from Solana
  useEffect(() => {
    if (connected && publicKey) {
      fetchIdentity();
    }
  }, [connected, publicKey]);

  const fetchIdentity = async () => {
    setLoading(true);
    try {
      // Integration point: Fetch from Solana
      // const identityAccount = await program.account.identity.fetch(identityPda);
      
      // Mock for scaffold
      setHasIdentity(false);
      setIdentity(null);
    } catch (error) {
      console.log('No identity found');
      setHasIdentity(false);
    } finally {
      setLoading(false);
    }
  };

  const createIdentity = async () => {
    setLoading(true);
    try {
      // Integration point: Call initialize on program
      // 1. Generate mock passport data or use scanned data
      // 2. Create commitment hash
      // 3. Submit to Solana
      
      Alert.alert('Coming Soon', 'Identity creation will be implemented with Solana Mobile SDK');
    } catch (error) {
      Alert.alert('Error', 'Failed to create identity');
    } finally {
      setLoading(false);
    }
  };

  const formatCommitment = (commitment: number[]): string => {
    const hex = Buffer.from(commitment).toString('hex');
    return `${hex.slice(0, 8)}...${hex.slice(-8)}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#9945FF" />
        <Text style={styles.loadingText}>Loading identity...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {!hasIdentity ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Identity Found</Text>
          <Text style={styles.emptyText}>
            Create an on-chain identity to start using MinKYC. Your identity 
            will be stored as a cryptographic commitment — no personal data 
            is revealed.
          </Text>
          <TouchableOpacity style={styles.createButton} onPress={createIdentity}>
            <Text style={styles.createButtonText}>Create Identity</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.identityCard}>
          <Text style={styles.cardTitle}>Identity Details</Text>
          
          {identity && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Index</Text>
                <Text style={styles.detailValue}>{identity.index}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {identity.revoked ? 'Revoked' : 'Active'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Verifications</Text>
                <Text style={styles.detailValue}>{identity.verificationCount}</Text>
              </View>
              
              <View style={styles.commitmentSection}>
                <Text style={styles.detailLabel}>Commitment</Text>
                <Text style={styles.commitmentValue}>
                  {formatCommitment(identity.commitment)}
                </Text>
                <Text style={styles.commitmentHint}>
                  Cryptographic hash of your identity data
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🔒 How It Works</Text>
        <Text style={styles.infoText}>
          1. Your passport data is hashed with a secret{'\n'}
          2. Only the hash (commitment) is stored on-chain{'\n'}
          3. Original data never leaves your device{'\n'}
          4. Zero-knowledge proofs verify requirements
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
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#9945FF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  identityCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'monospace',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  commitmentSection: {
    marginTop: 12,
  },
  commitmentValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#9945FF',
    marginTop: 4,
  },
  commitmentHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#e8f4f8',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});

export default IdentityScreen;
