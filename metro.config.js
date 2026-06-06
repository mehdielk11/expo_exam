// https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow Metro to resolve .wasm files required by expo-sqlite's web worker
config.resolver.assetExts.push('wasm');

module.exports = config;
