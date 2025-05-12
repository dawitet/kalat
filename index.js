/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import {App} from './App';
import {name as appName} from './app.json';

// Import the image registry to ensure it's loaded before any components
import imageAssets from './assets/imageRegistry';

// Initialize image assets explicitly and safely
try {
  console.log('Image registry loaded with', Object.keys(imageAssets).length, 'assets');
} catch (err) {
  console.log('Failed to log image registry assets:', err);
}

// Add some logging to help debug Hermes issues
console.log('Starting application with Hermes:', global.HermesInternal !== undefined);

// Ignore specific warnings that may appear during development
LogBox.ignoreLogs([
  'Property \'require\' doesn\'t exist',
  'Require cycle:',
  'Warning: Failed prop type',
]);

// Error handler for global exceptions
if (__DEV__) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Check for the specific Hermes require error
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Property \'require\' doesn\'t exist')) {
      console.log('CAUGHT HERMES REQUIRE ERROR! This is likely related to dynamic image importing.');
      console.log('Make sure to use the imageRegistry for all image imports!');
      return; // Don't show this error in the console
    }
    originalConsoleError(...args);
  };
}

// Register the main component
AppRegistry.registerComponent(appName, () => App);
