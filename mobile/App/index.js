/**
 * @format
 */

import { AppRegistry } from 'react-native';
import 'text-encoding'; // REQUIRED POLYFILL FOR SOLANA WEB3
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
