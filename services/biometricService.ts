
/**
 * BIOMETRIC SERVICE (WebAuthn)
 * Handles interaction with the device's secure enclave (TouchID, FaceID, Windows Hello).
 */

// Helper to encode ArrayBuffer to Base64URL
const bufferToBase64URL = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// Check if biometrics are available on this device
export const isBiometricAvailable = async (): Promise<boolean> => {
  if (!window.PublicKeyCredential) return false;
  
  // Check for platform authenticator (TouchID/FaceID/Windows Hello)
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (e) {
    return false;
  }
};

// Register a new credential (Enable Biometrics)
export const registerBiometric = async (userEmail: string): Promise<boolean> => {
  try {
    if (!window.PublicKeyCredential) return false;

    // Random challenge
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userID = new TextEncoder().encode(userEmail);

    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: challenge,
      rp: {
        name: "Velano Pass",
        id: window.location.hostname, // Must match current domain
      },
      user: {
        id: userID,
        name: userEmail,
        displayName: userEmail,
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" }, // ES256
        { alg: -257, type: "public-key" }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform", // Forces TouchID/FaceID/Hello
        userVerification: "required", // Forces biometric check
        requireResidentKey: false,
      },
      timeout: 60000,
      attestation: "none",
    };

    const credential = await navigator.credentials.create({ publicKey });
    
    // In a real server-side app, we would send this credential to the server.
    // Here, getting a credential proves the user successfully passed the OS biometric prompt.
    return !!credential;
  } catch (e) {
    console.error("Biometric registration failed", e);
    return false;
  }
};

// Verify user (Unlock Vault)
export const verifyBiometric = async (): Promise<boolean> => {
  try {
    if (!window.PublicKeyCredential) return false;

    // Random challenge
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: challenge,
      timeout: 60000,
      userVerification: "required", // Forces biometric prompt
    };

    const assertion = await navigator.credentials.get({ publicKey });
    
    // If the OS returns an assertion, the user successfully used FaceID/TouchID
    return !!assertion;
  } catch (e) {
    console.error("Biometric verification failed", e);
    return false;
  }
};
