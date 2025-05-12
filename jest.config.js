module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo-.*|@expo/.*|react-native-reanimated|@rneui.*|react-native-vector-icons|react-native-ratings|react-native-elements|react-native-gesture-handler|@react-native-async-storage/async-storage)/)',
  ],
  // Setup files loaded before tests run
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^expo-notifications$': '<rootDir>/__tests__/mocks/expo-notifications.ts',
    '^expo-haptics$': '<rootDir>/__tests__/mocks/expo-haptics.ts',
    '^@react-native-async-storage/async-storage$': '<rootDir>/__tests__/mocks/async-storage.ts',
    '^react-native-reanimated$': '<rootDir>/__tests__/mocks/react-native-reanimated.js',
    '\\.(png|jpg|jpeg|gif|webp)$': '<rootDir>/__tests__/mocks/imageMock.js', // Specific for images
    '\\.(eot|otf|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__tests__/mocks/fileMock.js', // For other assets
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/mocks/',
  ],
};
