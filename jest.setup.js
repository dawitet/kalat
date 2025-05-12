// jest.setup.js
// Configure react-native-reanimated mock
import 'react-native-gesture-handler/jestSetup';
import { setUpTests as setReanimatedTests } from 'react-native-reanimated/lib/module/jestUtils';

// Initialize Reanimated jest utilities
setReanimatedTests();
