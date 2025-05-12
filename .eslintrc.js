module.exports = {
  extends: ['@react-native/eslint-config', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'no-trailing-spaces': 'warn',
    '@typescript-eslint/no-shadow': ['error'],
    'no-shadow': 'off',
    'no-undef': 'off',
    // Suppress the 'already defined in upper scope' warnings
    '@typescript-eslint/no-redeclare': 'off',
    // Allow some unused variables for destructuring
    '@typescript-eslint/no-unused-vars': ['warn', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'ignoreRestSiblings': true,
    }],
  },
};
