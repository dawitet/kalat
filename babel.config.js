module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ts',
          '.tsx',
          '.json',
          '.png',
          '.jpg',
          '.svg',
        ],
        alias: {
          'assets': './assets',
          'images': './assets/images',
        },
      },
    ],
  ],
};
