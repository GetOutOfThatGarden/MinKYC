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
import IdentityScreen from './src/screens/IdentityScreen';
import ScanScreen from './src/screens/ScanScreen';
import VerifyScreen from './src/screens/VerifyScreen';

export type RootStackParamList = {
  Home: undefined;
  Identity: undefined;
  Scan: undefined;
  Verify: { request?: any };
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
              options={{ title: 'MinKYC' }}
            />
            <Stack.Screen 
              name="Identity" 
              component={IdentityScreen} 
              options={{ title: 'My Identity' }}
            />
            <Stack.Screen 
              name="Scan" 
              component={ScanScreen} 
              options={{ title: 'Scan Passport' }}
            />
            <Stack.Screen 
              name="Verify" 
              component={VerifyScreen} 
              options={{ title: 'Verify Identity' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </WalletProvider>
    </SafeAreaProvider>
  );
}

export default App;
