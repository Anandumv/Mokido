const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure Metro to properly handle crypto and buffer modules
config.resolver.extraNodeModules = {
  buffer: require.resolve('buffer'),
  stream: require.resolve('readable-stream'),
  process: require.resolve('process/browser'),
  'text-encoding': require.resolve('text-encoding'),
  util: require.resolve('util'),
  path: require.resolve('path-browserify'),
  fs: false, // Disable fs module
  net: false, // Disable net module
  tls: false, // Disable tls module
  child_process: false, // Disable child_process module
};

// Add crypto alias to resolver - this is crucial for bcryptjs
config.resolver.alias = {
  buffer: require.resolve('buffer'),
  process: require.resolve('process/browser'),
  stream: require.resolve('readable-stream'),
  'text-encoding': require.resolve('text-encoding'),
  util: require.resolve('util'),
  path: require.resolve('path-browserify'),
  // Add specific aliases for common problematic modules
  fs: false,
  net: false,
  tls: false,
  child_process: false,
};

// Ensure proper module resolution for polyfills
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

// Add support for additional file extensions including CommonJS
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs', 'mjs'];

// Configure transformer to handle Node.js modules properly
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
  // Add support for older JS syntax that bcryptjs might use
  minifierConfig: {
    mangle: {
      keep_fnames: true,
    },
    output: {
      ascii_only: true,
      quote_keys: true,
      wrap_iife: true,
    },
    sourceMap: {
      includeSources: false,
    },
    toplevel: false,
    compress: {
      reduce_funcs: false,
    },
  },
};

// Add global modules that need to be available
config.resolver.nodeModulesPaths = [
  ...config.resolver.nodeModulesPaths,
  './node_modules'
];

// Add resolver fallbacks for Node.js modules
config.resolver.fallback = {
  buffer: require.resolve('buffer'),
  stream: require.resolve('readable-stream'),
  process: require.resolve('process/browser'),
  util: require.resolve('util'),
  path: require.resolve('path-browserify'),
  fs: false,
  net: false,
  tls: false,
  child_process: false,
  os: false,
  querystring: require.resolve('querystring-es3'),
  url: require.resolve('url'),
  assert: require.resolve('assert'),
  events: require.resolve('events'),
  crypto: require.resolve('crypto-browserify'), // Use crypto polyfill for bcryptjs
};

module.exports = config;