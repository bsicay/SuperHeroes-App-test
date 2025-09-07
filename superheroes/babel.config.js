module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@assets': './src/assets',
          '@components': './src/shared/components',
          '@hooks': './src/shared/hooks',
          '@utils': './src/shared/utils',
          '@types': './src/shared/types',
          '@theme': './src/theme',
          '@services': './src/services',
          '@features': './src/features',
          '@native-modules': './src/native-modules',
          '@navigation': './src/navigation',
        },
      },
    ],
  ],
};
