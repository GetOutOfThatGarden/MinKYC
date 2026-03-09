import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
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

type VerificationHistoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

const VerificationHistoryScreen: React.FC = () => {
  const navigation = useNavigation<VerificationHistoryNavigationProp>();
  const [history, setHistory] = useState<VerificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    try {
      const items = await getHistory();
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

  const renderItem = ({ item }: { item: VerificationHistoryItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HistoryDetail', { item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.platformId}>{item.receipt.platformId}</Text>
        <Text style={styles.date}>
          {new Date(item.receipt.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.condition}>Condition: {item.condition}</Text>
      <Text style={styles.receiptId}>ID: {item.receipt.receiptId.slice(0, 12)}...</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9945FF" />
        </View>
      ) : history.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No verifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.receipt.receiptId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#9945FF" />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  condition: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  receiptId: {
    fontSize: 12,
    color: '#aaa',
    fontFamily: 'monospace',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default VerificationHistoryScreen;
