import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';

export interface BiometricAuthenticationError {
  code: string;
  message: string;
  details?: any;
}

export interface BiometricAuthSpec extends TurboModule {
  authenticate(
    onSuccess: () => void,
    onFailure: (error: BiometricAuthenticationError) => void
  ): void;
}

export default TurboModuleRegistry.get<BiometricAuthSpec>('BiometricAuth') as BiometricAuthSpec | null;
