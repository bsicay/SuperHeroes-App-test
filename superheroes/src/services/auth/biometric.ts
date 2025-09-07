import BiometricModule from '@native/biometric/js/BiometricModule';
import { BiometricAuthenticationError, BiometricCapabilities } from '@types/biometric';

export class BiometricAuthService {
  /**
   * Autentica al usuario usando biometría
   * Este es el método requerido por la prueba técnica
   */
  static authenticate(
    onSuccess: () => void,
    onFailure: (error: BiometricAuthenticationError) => void
  ): void {
    BiometricModule.authenticate(onSuccess, onFailure);
  }

  /**
   * Verifica si el sensor biométrico está disponible
   */
  static async isSensorAvailable(): Promise<boolean> {
    try {
      return await BiometricModule.isSensorAvailable();
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Obtiene el tipo de biometría disponible
   */
  static async getAvailableBiometryType(): Promise<string> {
    try {
      return await BiometricModule.getAvailableBiometryType();
    } catch (error) {
      console.error('Error getting biometry type:', error);
      return 'None';
    }
  }

  /**
   * Obtiene las capacidades biométricas del dispositivo
   */
  static async getCapabilities(): Promise<BiometricCapabilities> {
    try {
      const capabilities = await BiometricModule.getCapabilities();
      return {
        isAvailable: capabilities.isAvailable,
        biometryType: capabilities.biometryType as any,
        isDeviceSecure: capabilities.isDeviceSecure,
      };
    } catch (error) {
      console.error('Error getting biometric capabilities:', error);
      return {
        isAvailable: false,
        biometryType: 'None',
        isDeviceSecure: false,
      };
    }
  }

  /**
   * Wrapper para autenticación con Promise
   */
  static authenticateAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authenticate(
        () => resolve(),
        (error) => reject(error)
      );
    });
  }

  /**
   * Verifica si el usuario puede crear/modificar equipos
   * (requiere autenticación biométrica según la prueba técnica)
   */
  static async canManageTeams(): Promise<boolean> {
    try {
      const capabilities = await this.getCapabilities();
      return capabilities.isAvailable;
    } catch (error) {
      console.error('Error checking team management capability:', error);
      return false;
    }
  }

  /**
   * Autentica al usuario antes de crear/modificar un equipo
   */
  static async authenticateForTeamManagement(): Promise<void> {
    const canManage = await this.canManageTeams();
    
    if (!canManage) {
      throw new Error('Biometric authentication not available');
    }

    return this.authenticateAsync();
  }
}
