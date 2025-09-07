import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
import { BiometricAuthenticationError, BiometricCapabilities } from '@types/biometric';

export interface Spec extends TurboModule {
  // Método requerido por la prueba técnica
  authenticate(
    onSuccess: () => void,
    onFailure: (error: BiometricAuthenticationError) => void
  ): void;
  
  // Métodos adicionales para funcionalidad completa
  isSensorAvailable(): Promise<boolean>;
  getAvailableBiometryType(): Promise<string>;
  getCapabilities(): Promise<BiometricCapabilities>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BiometricModule');
