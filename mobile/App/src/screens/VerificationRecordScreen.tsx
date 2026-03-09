import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type VerificationRecordRouteProp = RouteProp<RootStackParamList, 'HistoryDetail'>;

const VerificationRecordScreen: React.FC = () => {
  const route = useRoute<VerificationRecordRouteProp>();
  const { item } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Platform</Text>
        <Text style={styles.value}>{item.receipt.platformId}</Text>
        
        <Text style={styles.label}>Date Verified</Text>
        <Text style={styles.value}>
          {new Date(item.receipt.timestamp).toLocaleString()}
        </Text>

        <Text style={styles.label}>Condition Met</Text>
        <Text style={styles.value}>{item.condition}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.label}>Receipt ID</Text>
        <Text style={styles.code}>{item.receipt.receiptId}</Text>

        <Text style={styles.label}>Request ID</Text>
        <Text style={styles.code}>{item.receipt.requestId}</Text>
        
        <View style={styles.divider} />

        <Text style={styles.label}>ZK Proof Data</Text>
        <Text style={styles.subLabel}>Protocol</Text>
        <Text style={styles.code}>{item.receipt.proof.protocol} ({item.receipt.proof.curve})</Text>

        <Text style={styles.subLabel}>Public Signals</Text>
        <Text style={styles.code}>{JSON.stringify(item.receipt.publicSignals, null, 2)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 12,
  },
  subLabel: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginTop: 4,
  },
  code: {
    fontSize: 12,
    color: '#9945FF',
    fontFamily: 'monospace',
    marginTop: 4,
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
});

export default VerificationRecordScreen;
