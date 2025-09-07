export interface BiometricAuthenticationError {
  code: string;
  message: string;
  details?: string;
}

export interface BiometricCapabilities {
  isAvailable: boolean;
  biometryType: 'TouchID' | 'FaceID' | 'Fingerprint' | 'None';
  isDeviceSecure: boolean;
}

export type BiometricAuthCallback = {
  onSuccess: () => void;
  onFailure: (error: BiometricAuthenticationError) => void;
};
