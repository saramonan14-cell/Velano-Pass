/**
 * CRYPTOGRAPHY SERVICE
 * Implements PBKDF2 for key derivation and AES-GCM for encryption.
 * This ensures Zero-Knowledge architecture: the raw key is never stored.
 */

const ENC_ALGO = { name: 'AES-GCM', length: 256 };
const KDF_ALGO = { name: 'PBKDF2' };
const HASH_ALGO = 'SHA-256';

// INCREASED SECURITY STANDARD (2025)
// OWASP recommends 600,000+ for PBKDF2-HMAC-SHA256
export const DEFAULT_ITERATIONS = 600000; 

// Utility: ArrayBuffer to Base64
export const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Utility: Base64 to ArrayBuffer
export const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// 1. Generate a random salt
export const generateSalt = (): string => {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  return bufferToBase64(salt.buffer);
};

// 2. Derive Key from Password (PBKDF2)
// Accepts custom iterations to support backward compatibility with older accounts
export const deriveKey = async (
    password: string, 
    saltBase64: string, 
    iterations: number = DEFAULT_ITERATIONS
): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = base64ToBuffer(saltBase64);

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: iterations,
      hash: HASH_ALGO,
    },
    keyMaterial,
    ENC_ALGO,
    false, // Master key is non-extractable
    ['encrypt', 'decrypt']
  );
};

// 3. Encrypt Data (AES-GCM)
// Returns { iv, cipherText } as Base64 strings
export const encryptData = async (
  key: CryptoKey,
  data: object
): Promise<{ iv: string; cipherText: string }> => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM

  const cipherTextBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedData
  );

  return {
    iv: bufferToBase64(iv.buffer),
    cipherText: bufferToBase64(cipherTextBuffer),
  };
};

// 4. Decrypt Data (AES-GCM)
export const decryptData = async (
  key: CryptoKey,
  ivBase64: string,
  cipherTextBase64: string
): Promise<any> => {
  const iv = base64ToBuffer(ivBase64);
  const cipherText = base64ToBuffer(cipherTextBase64);

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      cipherText
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedBuffer));
  } catch (e) {
    console.error("Decryption failed", e);
    throw new Error("Failed to decrypt data. Key may be incorrect or data corrupted.");
  }
};

// 5. Create a Verifier Hash
export const createVerifier = async (password: string, salt: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt + "verifier");
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return bufferToBase64(hashBuffer);
};

// 6. Generate Recovery Key (Random Hex)
export const generateRecoveryKey = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  
  const hex = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
      
  // Format as blocks of 4 for readability: AAAA-BBBB-CCCC...
  return hex.toUpperCase().match(/.{1,4}/g)?.join('-') || hex;
};
