import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import OnboardingScreen from '../OnboardingScreen';
import { MOCK_PROFILES } from '../../constants/mockProfiles';
import * as secureStorage from '../../utils/secureStorage';
import { useNFC } from '../../hooks/useNFC';

// Mock dependencies
jest.mock('../../hooks/useNFC');
jest.mock('../../utils/secureStorage');
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));
jest.mock('lucide-react-native', () => ({
  ShieldCheck: ({ children }: any) => children,
  Nfc: ({ children }: any) => children,
  Users: ({ children }: any) => children,
  ChevronDown: ({ children }: any) => children,
  ChevronUp: ({ children }: any) => children,
  Lock: ({ children }: any) => children,
  ChevronRight: ({ children }: any) => children,
}));

jest.mock('@2060.io/react-native-eid-reader', () => ({
  isNfcSupported: jest.fn().mockResolvedValue(true),
  isNfcEnabled: jest.fn().mockResolvedValue(true),
  startReading: jest.fn(),
  stopReading: jest.fn(),
  addOnTagDiscoveredListener: jest.fn(),
  removeListeners: jest.fn(),
}));

jest.mock('react-native-nfc-manager', () => ({
  isSupported: jest.fn().mockResolvedValue(true),
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  isOptional: true,
}));

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert.alert = jest.fn((title, message, buttons) => {
    if (buttons && buttons.length > 0 && buttons[0].onPress) {
      buttons[0].onPress();
    }
  });
  return RN;
});

// Mock Navigation
const mockNavigate = jest.fn();
const mockSetParams = jest.fn();
const mockReset = jest.fn();

let mockRouteParams: any = {};

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockNavigate,
      setParams: mockSetParams,
      reset: mockReset,
      getState: () => ({ routes: [{ name: 'Onboarding' }] }),
    }),
    useRoute: () => ({
      params: mockRouteParams,
    }),
  };
});

describe('Ingestion Flow E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams = {};
    (useNFC as jest.Mock).mockReturnValue({
      isSupported: true,
      isEnabled: true,
      readPassport: jest.fn(),
      nfcStep: 'IDLE',
      nfcProgress: 0,
      error: null,
    });
    
    // Default mock implementation for secureStorage
    (secureStorage.savePassportData as jest.Mock).mockResolvedValue(undefined);
    (secureStorage.saveCommitment as jest.Mock).mockResolvedValue(undefined);
    (secureStorage.computeCommitment as jest.Mock).mockReturnValue('mock_commitment');
  });

  it('successfully completes the ingestion flow when mrzData is received', async () => {
    const profile = MOCK_PROFILES.adult_irl;
    
    // Simulate returning from MRZScanScreen with data
    mockRouteParams = {
      mrzData: {
        documentNumber: profile.documentNumber,
        dateOfBirth: '900101',
        expiryDate: '300101',
      },
    };

    const mockReadPassport = jest.fn().mockResolvedValue({
      status: 'OK',
      data: {
        lastName: profile.data.surname,
        firstName: profile.data.givenNames,
        nationality: profile.data.nationality,
        birthDate: profile.data.dateOfBirth,
        gender: profile.data.sex,
        documentNo: profile.data.passportNumber,
        expiryDate: profile.data.expiryDate,
      }
    });

    (useNFC as jest.Mock).mockReturnValue({
      isSupported: true,
      isEnabled: true,
      readPassport: mockReadPassport,
      nfcStep: 'IDLE',
      nfcProgress: 0,
      error: null,
    });

    // 1. Render Onboarding Screen
    render(<OnboardingScreen />);

    // 2. Verify NFC read was triggered by useEffect reacting to mockRouteParams
    await waitFor(() => {
      expect(mockReadPassport).toHaveBeenCalledWith(
        'PA1234567',
        '900101',
        '300101'
      );
    });

    // 3. Verify data was saved correctly
    await waitFor(() => {
      expect(secureStorage.savePassportData).toHaveBeenCalledWith(
        expect.objectContaining({
          passportNumber: 'PA1234567',
          surname: 'MURPHY',
          givenNames: 'SEAN',
          nationality: 'IRL',
        })
      );
      expect(secureStorage.saveCommitment).toHaveBeenCalledWith('mock_commitment');
    });

    // 4. Verify navigation back to Home
    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    });
  });

  it('successfully creates identity using a mock profile', async () => {
    const profile = MOCK_PROFILES.adult_usa;
    
    // 1. Render Onboarding Screen
    const { getByText } = render(<OnboardingScreen />);

    // 2. Expand a profile (Adult USA)
    const profileButton = getByText('JAMES SMITH');
    fireEvent.press(profileButton);

    // 3. Click "Use This Profile"
    const useButton = getByText('Use This Profile');
    fireEvent.press(useButton);

    // 4. Verify data was saved
    await waitFor(() => {
      expect(secureStorage.savePassportData).toHaveBeenCalledWith(
        expect.objectContaining({
          passportNumber: 'US9876543',
          surname: 'SMITH',
          givenNames: 'JAMES',
        })
      );
      expect(secureStorage.saveCommitment).toHaveBeenCalled();
    });

    // 5. Verify navigation
    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    });
  });
});
