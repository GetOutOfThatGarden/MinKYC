import EncryptedStorage from 'react-native-encrypted-storage';
import {
  savePassportData,
  getPassportData,
  hasPassportData,
  clearAllData,
  computeCommitment,
  saveCommitment,
  getCommitment,
} from '../secureStorage';
import { PassportData } from '../../constants/mockProfiles';

// Mock react-native-encrypted-storage
jest.mock('react-native-encrypted-storage', () => {
  const store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      setItem: jest.fn(async (key: string, value: string) => {
        store[key] = value;
      }),
      getItem: jest.fn(async (key: string) => store[key] ?? null),
      removeItem: jest.fn(async (key: string) => {
        delete store[key];
      }),
      clear: jest.fn(async () => {
        for (const k of Object.keys(store)) {
          delete store[k];
        }
      }),
      // expose store for test resets
      _store: store,
    },
  };
});

const mockStore = (EncryptedStorage as any)._store;

const SAMPLE_PASSPORT: PassportData = {
  documentType: 'P',
  issuingCountry: 'IRL',
  passportNumber: 'PA1234567',
  surname: 'MURPHY',
  givenNames: 'SEAN',
  nationality: 'IRL',
  dateOfBirth: '2000-01-01',
  sex: 'M',
  expiryDate: '2029-01-01',
};

describe('secureStorage', () => {
  beforeEach(() => {
    // Clear the in-memory mock store between tests
    for (const k of Object.keys(mockStore)) {
      delete mockStore[k];
    }
    jest.clearAllMocks();
  });

  it('getPassportData returns null when no data exists', async () => {
    const result = await getPassportData();
    expect(result).toBeNull();
  });

  it('hasPassportData returns false when no data exists', async () => {
    const result = await hasPassportData();
    expect(result).toBe(false);
  });

  it('savePassportData + getPassportData round-trips correctly', async () => {
    await savePassportData(SAMPLE_PASSPORT);
    const retrieved = await getPassportData();
    expect(retrieved).toEqual(SAMPLE_PASSPORT);
  });

  it('hasPassportData returns true after saving', async () => {
    await savePassportData(SAMPLE_PASSPORT);
    const result = await hasPassportData();
    expect(result).toBe(true);
  });

  it('saveCommitment + getCommitment round-trips correctly', async () => {
    const hash = 'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234';
    await saveCommitment(hash);
    const retrieved = await getCommitment();
    expect(retrieved).toBe(hash);
  });

  it('computeCommitment produces deterministic output', () => {
    const hash1 = computeCommitment(SAMPLE_PASSPORT, 'secret');
    const hash2 = computeCommitment(SAMPLE_PASSPORT, 'secret');
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it('computeCommitment differs for different secrets', () => {
    const hash1 = computeCommitment(SAMPLE_PASSPORT, 'secret_a');
    const hash2 = computeCommitment(SAMPLE_PASSPORT, 'secret_b');
    expect(hash1).not.toBe(hash2);
  });

  describe('clearAllData', () => {
    it('wipes passport data, commitment, and wallet keys', async () => {
      // Seed all three storage keys
      await savePassportData(SAMPLE_PASSPORT);
      await saveCommitment('abcdef');
      mockStore['minkyc_local_wallet_secret'] = 'some_wallet_data';

      await clearAllData();

      expect(await getPassportData()).toBeNull();
      expect(await getCommitment()).toBeNull();
      expect(await hasPassportData()).toBe(false);
    });

    it('does not throw when storage is already empty', async () => {
      await expect(clearAllData()).resolves.not.toThrow();
    });
  });
});
