// Import polyfills at the very top - must be first
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import 'crypto-browserify';

// Import Buffer
import { Buffer } from 'buffer';

// Ensure global is defined for Web3 libraries
if (typeof global === 'undefined') {
  var global = globalThis;
}

// Make Buffer available globally
global.Buffer = Buffer;

// Set process.browser flag for libraries that check environment
if (typeof process === 'undefined') {
  global.process = { 
    browser: true, 
    env: {},
    version: '16.0.0',
    platform: 'browser',
    nextTick: (fn: Function) => setTimeout(fn, 0),
    cwd: () => '/',
    argv: [],
    pid: 1,
    title: 'browser',
    umask: () => 0,
    uptime: () => 0,
    hrtime: () => [0, 0],
    chdir: () => {},
    exit: () => {},
    kill: () => {},
    abort: () => {},
    binding: () => {},
    reallyExit: () => {}
  };
} else {
  if (typeof process.browser === 'undefined') {
    process.browser = true;
  }
  if (!process.nextTick) {
    process.nextTick = (fn: Function) => setTimeout(fn, 0);
  }
}

// Create a comprehensive crypto polyfill BEFORE any other imports
const createCryptoPolyfill = () => {
  const getRandomValuesPolyfill = (() => {
    try {
      const { getRandomValues } = require('react-native-get-random-values');
      return getRandomValues;
    } catch (e) {
      // Fallback if react-native-get-random-values fails
      return (array: any) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      };
    }
  })();

  const randomBytesPolyfill = (size: number) => {
    const array = new Uint8Array(size);
    getRandomValuesPolyfill(array);
    return Buffer.from(array);
  };

  // Create a comprehensive crypto object that satisfies bcryptjs requirements
  const cryptoPolyfill = {
    getRandomValues: getRandomValuesPolyfill,
    randomBytes: randomBytesPolyfill,
    
    // CRITICAL: Set seed to empty object to prevent bcryptjs errors
    // bcryptjs checks for crypto.seed existence and tries to access properties on it
    seed: {},
    
    // Add other properties that crypto libraries might expect
    constants: {
      SSL_OP_ALL: 0x80000BFF,
      SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION: 0x40000,
      SSL_OP_CIPHER_SERVER_PREFERENCE: 0x400000,
      SSL_OP_CISCO_ANYCONNECT: 0x8000,
      SSL_OP_COOKIE_EXCHANGE: 0x2000,
      SSL_OP_CRYPTOPRO_TLSEXT_BUG: 0x80000000,
      SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS: 0x800,
      SSL_OP_EPHEMERAL_RSA: 0x200000,
      SSL_OP_LEGACY_SERVER_CONNECT: 0x4,
      SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER: 0x20,
      SSL_OP_MICROSOFT_SESS_ID_BUG: 0x1,
      SSL_OP_MSIE_SSLV2_RSA_PADDING: 0x40,
      SSL_OP_NETSCAPE_CA_DN_BUG: 0x20000000,
      SSL_OP_NETSCAPE_CHALLENGE_BUG: 0x2,
      SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG: 0x40000000,
      SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG: 0x8,
      SSL_OP_NO_COMPRESSION: 0x20000,
      SSL_OP_NO_QUERY_MTU: 0x1000,
      SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION: 0x10000,
      SSL_OP_NO_SSLv2: 0x1000000,
      SSL_OP_NO_SSLv3: 0x2000000,
      SSL_OP_NO_TICKET: 0x4000,
      SSL_OP_NO_TLSv1: 0x4000000,
      SSL_OP_NO_TLSv1_1: 0x10000000,
      SSL_OP_NO_TLSv1_2: 0x8000000,
      SSL_OP_PKCS1_CHECK_1: 0x0,
      SSL_OP_PKCS1_CHECK_2: 0x0,
      SSL_OP_SINGLE_DH_USE: 0x100000,
      SSL_OP_SINGLE_ECDH_USE: 0x80000,
      SSL_OP_SSLEAY_080_CLIENT_DH_BUG: 0x80,
      SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG: 0x10,
      SSL_OP_TLS_BLOCK_PADDING_BUG: 0x200,
      SSL_OP_TLS_D5_BUG: 0x100,
      SSL_OP_TLS_ROLLBACK_BUG: 0x800000
    },
    
    webcrypto: typeof window !== 'undefined' ? window.crypto : null,
    
    // Add subtle for Web Crypto API compatibility
    subtle: typeof window !== 'undefined' && window.crypto ? window.crypto.subtle : null,
    
    // Add additional Node.js crypto module properties that bcryptjs might check for
    DEFAULT_ENCODING: 'buffer',
    
    // Stub functions for Node.js crypto methods (throw descriptive errors)
    createHash: () => {
      throw new Error('createHash not available in React Native - use alternative hashing');
    },
    createHmac: () => {
      throw new Error('createHmac not available in React Native - use alternative');
    },
    createCipher: () => {
      throw new Error('createCipher not available in React Native');
    },
    createDecipher: () => {
      throw new Error('createDecipher not available in React Native');
    },
    pbkdf2: () => {
      throw new Error('pbkdf2 not available in React Native');
    },
    pbkdf2Sync: () => {
      throw new Error('pbkdf2Sync not available in React Native');
    },
    
    // Random fill functions that bcryptjs might use
    randomFillSync: (buffer: any, offset?: number, size?: number) => {
      const actualOffset = offset || 0;
      const actualSize = size || (buffer.length - actualOffset);
      const randomBytes = randomBytesPolyfill(actualSize);
      
      if (buffer.set) {
        buffer.set(randomBytes, actualOffset);
      } else {
        for (let i = 0; i < actualSize; i++) {
          buffer[actualOffset + i] = randomBytes[i];
        }
      }
      return buffer;
    },
    
    randomFill: (buffer: any, offset?: number, size?: number, callback?: Function) => {
      // Handle function overloads
      let actualOffset = 0;
      let actualSize = buffer.length;
      let actualCallback = callback;
      
      if (typeof offset === 'function') {
        actualCallback = offset;
      } else if (typeof offset === 'number') {
        actualOffset = offset;
        if (typeof size === 'function') {
          actualCallback = size;
          actualSize = buffer.length - actualOffset;
        } else if (typeof size === 'number') {
          actualSize = size;
        }
      }
      
      try {
        const result = cryptoPolyfill.randomFillSync(buffer, actualOffset, actualSize);
        if (actualCallback) {
          actualCallback(null, result);
        }
      } catch (error) {
        if (actualCallback) {
          actualCallback(error);
        }
      }
    },
    
    // Timing safe equal function for security
    timingSafeEqual: (a: any, b: any) => {
      if (a.length !== b.length) return false;
      let result = 0;
      for (let i = 0; i < a.length; i++) {
        result |= a[i] ^ b[i];
      }
      return result === 0;
    },
    
    // Additional properties for broader compatibility
    scrypt: () => {
      throw new Error('scrypt not available in React Native');
    },
    scryptSync: () => {
      throw new Error('scryptSync not available in React Native');
    },
    
    // Certificate and key functions
    generateKeyPair: () => {
      throw new Error('generateKeyPair not available in React Native');
    },
    generateKeyPairSync: () => {
      throw new Error('generateKeyPairSync not available in React Native');
    },
    
    // Signing and verification
    createSign: () => {
      throw new Error('createSign not available in React Native');
    },
    createVerify: () => {
      throw new Error('createVerify not available in React Native');
    },
    
    // Cipher streams
    Cipher: class MockCipher {
      constructor() {
        throw new Error('Cipher not available in React Native');
      }
    },
    Decipher: class MockDecipher {
      constructor() {
        throw new Error('Decipher not available in React Native');
      }
    },
    
    // Hash classes
    Hash: class MockHash {
      constructor() {
        throw new Error('Hash not available in React Native');
      }
    },
    Hmac: class MockHmac {
      constructor() {
        throw new Error('Hmac not available in React Native');
      }
    }
  };

  return cryptoPolyfill;
};

// Apply crypto polyfill to global immediately
const polyfill = createCryptoPolyfill();
global.crypto = polyfill;

// Apply crypto polyfill to window if in browser environment
if (typeof window !== 'undefined') {
  window.crypto = polyfill;
  // Make Buffer available on window for web compatibility
  window.Buffer = Buffer;
}

// Ensure TextEncoder/TextDecoder are available (needed by some crypto libraries)
if (typeof global.TextEncoder === 'undefined') {
  try {
    const textEncoding = require('text-encoding');
    global.TextEncoder = textEncoding.TextEncoder;
    global.TextDecoder = textEncoding.TextDecoder;
  } catch (e) {
    // Fallback TextEncoder/TextDecoder implementation
    global.TextEncoder = class TextEncoder {
      encode(str: string) {
        const result = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
          result[i] = str.charCodeAt(i);
        }
        return result;
      }
    };
    global.TextDecoder = class TextDecoder {
      decode(buffer: Uint8Array) {
        return String.fromCharCode.apply(null, Array.from(buffer));
      }
    };
  }
}

// Ensure window TextEncoder/TextDecoder are also available
if (typeof window !== 'undefined') {
  if (typeof window.TextEncoder === 'undefined') {
    window.TextEncoder = global.TextEncoder;
  }
  if (typeof window.TextDecoder === 'undefined') {
    window.TextDecoder = global.TextDecoder;
  }
}

console.log('✅ Comprehensive crypto polyfills applied successfully');
console.log('   - global.crypto.seed:', global.crypto.seed);
console.log('   - global.crypto.getRandomValues:', typeof global.crypto.getRandomValues);
console.log('   - global.crypto.randomBytes:', typeof global.crypto.randomBytes);
console.log('   - global.crypto.randomFillSync:', typeof global.crypto.randomFillSync);
console.log('   - global.Buffer:', typeof global.Buffer);
console.log('   - global.process.browser:', global.process.browser);
if (typeof window !== 'undefined') {
  console.log('   - window.crypto.seed:', window.crypto.seed);
  console.log('   - window.Buffer:', typeof window.Buffer);
}