/**
 * MinKYC Mobile App Entry Point
 * 
 * Solana Mobile Hackathon Scaffold
 * Features:
 * - Wallet connection (Phantom/Solflare)
 * - Identity management
 * - NFC passport scanning
 * - Proof generation and submission
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WalletProvider } from './src/hooks/useWallet';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import IdentityScreen from './src/screens/IdentityScreen';
import ScanScreen from './src/screens/ScanScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import VerificationHistoryScreen from './src/screens/VerificationHistoryScreen';
import VerificationRecordScreen from './src/screens/VerificationRecordScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { VerificationHistoryItem } from './src/types/verification';

export type RootStackParamList = {
  Home: undefined;
  Onboarding: undefined;
  Identity: undefined;
  Scan: undefined;
  ScanQR: undefined;
  Verify: { request?: any };
  History: undefined;
  HistoryDetail: { item: VerificationHistoryItem };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: '#9945FF' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ 
                title: 'MinKYC',
                animationTypeForReplace: 'push',
              }}
            />
            <Stack.Screen 
              name="Onboarding" 
              component={OnboardingScreen} 
              options={{ title: 'Get Started', headerShown: false }}
            />
            <Stack.Screen 
              name="Identity" 
              component={IdentityScreen} 
              options={{ title: 'My Identity' }}
            />
            <Stack.Screen 
              name="Scan" 
              component={ScanScreen} 
              options={{ title: 'Verify Identity' }}
            />
            <Stack.Screen 
              name="ScanQR" 
              component={ScanScreen} 
              options={{ title: 'Scan QR Code' }}
            />
            <Stack.Screen 
              name="Verify" 
              component={VerifyScreen} 
              options={{ title: 'Verify Identity' }}
            />
            <Stack.Screen 
              name="History" 
              component={VerificationHistoryScreen} 
              options={{ title: 'Verification History' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ title: 'Settings' }}
            />
            <Stack.Screen 
              name="HistoryDetail" 
              component={VerificationRecordScreen} 
              options={{ title: 'Verification Record' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </WalletProvider>
    </SafeAreaProvider>
  );
}

export default App;
