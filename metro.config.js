const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const config = getDefaultConfig(__dirname);

// Standard configuration - no SVG support
const { assetExts, sourceExts } = config.resolver;

const customConfig = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: [...assetExts],
    sourceExts: [...sourceExts],
  },
};

module.exports = mergeConfig(config, customConfig);
