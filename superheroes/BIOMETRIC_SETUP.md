# SuperHeroes App - Autenticación Biométrica con Turbo Modules

Este proyecto demuestra cómo implementar autenticación biométrica en React Native usando Turbo Modules personalizados.

## Características

- ✅ Autenticación biométrica (Touch ID, Face ID, Huella dactilar)
- ✅ Turbo Modules personalizados para iOS y Android
- ✅ Verificación de disponibilidad de sensores biométricos
- ✅ Encriptación/desencriptación de datos usando biometría
- ✅ Fallback a código de acceso
- ✅ Interfaz de usuario moderna y responsiva

## Estructura del Proyecto

```
src/
├── native-modules/
│   └── BiometricAuth/
│       └── BiometricAuth.ts          # Especificación TypeScript del Turbo Module
├── components/
│   └── BiometricAuthComponent.tsx    # Componente React Native
ios/
└── BiometricAuth/
    ├── BiometricAuth.h               # Header del módulo iOS
    └── BiometricAuth.m               # Implementación del módulo iOS
android/
└── src/main/java/com/superheroes/biometricauth/
    ├── BiometricAuthModule.java      # Módulo Android
    └── BiometricAuthPackage.java     # Paquete Android
```

## Instalación y Configuración

### Prerrequisitos

- Node.js >= 20.19.4
- React Native CLI
- Xcode (para iOS)
- Android Studio (para Android)

### Pasos de Instalación

1. **Clonar e instalar dependencias:**
   ```bash
   cd superheroes
   npm install
   ```

2. **Configurar iOS:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Configurar Android:**
   - Asegúrate de que las dependencias de biometría estén en `android/app/build.gradle`
   - Los permisos ya están configurados en `AndroidManifest.xml`

## Uso del Turbo Module

### Importar el módulo

```typescript
import BiometricAuth from './src/native-modules/BiometricAuth/BiometricAuth';
```

### Métodos Disponibles

#### Verificación de Disponibilidad
```typescript
// Verificar si el sensor biométrico está disponible
const isAvailable = await BiometricAuth.isSensorAvailable();

// Obtener el tipo de biometría disponible
const biometryType = await BiometricAuth.getAvailableBiometryType();
// Retorna: "TouchID", "FaceID", "Biometric", o "None"

// Obtener el nivel de seguridad del dispositivo
const securityLevel = await BiometricAuth.getSecurityLevel();
// Retorna: "BIOMETRIC", "DEVICE_PASSCODE", o "NONE"

// Verificar si el dispositivo está seguro
const isSecure = await BiometricAuth.isDeviceSecure();
```

#### Autenticación
```typescript
// Autenticación biométrica simple
const success = await BiometricAuth.authenticate(
  'Confirma tu identidad para continuar'
);

// Autenticación con fallback a código de acceso
const success = await BiometricAuth.authenticateWithFallback(
  'Confirma tu identidad para continuar',
  'Usa tu código de acceso como alternativa'
);
```

#### Encriptación/Desencriptación
```typescript
// Encriptar datos usando biometría
const encryptedData = await BiometricAuth.encryptData(
  'Datos sensibles',
  'Confirma tu identidad para encriptar'
);

// Desencriptar datos usando biometría
const decryptedData = await BiometricAuth.decryptData(
  encryptedData,
  'Confirma tu identidad para desencriptar'
);
```

#### Gestión de Claves
```typescript
// Crear claves biométricas
const keysCreated = await BiometricAuth.createKeys();

// Eliminar claves biométricas
const keysDeleted = await BiometricAuth.deleteKeys();

// Verificar si existen claves biométricas
const keysExist = await BiometricAuth.biometricKeysExist();
```

## Ejecutar la Aplicación

### iOS
```bash
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```

## Permisos Requeridos

### iOS
Los permisos se manejan automáticamente a través de `LocalAuthentication.framework`.

### Android
Los siguientes permisos están configurados en `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

## Características del Turbo Module

### Ventajas de los Turbo Modules

1. **Mejor Rendimiento**: Comunicación más eficiente entre JavaScript y código nativo
2. **Type Safety**: Especificación TypeScript para mejor desarrollo
3. **Arquitectura Moderna**: Compatible con la Nueva Arquitectura de React Native
4. **Mejor Debugging**: Mejor integración con herramientas de desarrollo

### Implementación Técnica

- **iOS**: Implementado usando `LocalAuthentication.framework`
- **Android**: Implementado usando `androidx.biometric:biometric`
- **TypeScript**: Especificación completa del módulo con tipos
- **Error Handling**: Manejo robusto de errores en ambas plataformas

## Solución de Problemas

### Error: "Biometric authentication not available"
- Verifica que el dispositivo tenga sensores biométricos
- Asegúrate de que la biometría esté configurada en el dispositivo
- Verifica los permisos en Android

### Error: "Authentication failed"
- El usuario canceló la autenticación
- Falló la verificación biométrica
- El dispositivo no está configurado para biometría

### Error de Compilación en iOS
- Ejecuta `cd ios && pod install`
- Limpia el proyecto: `npx react-native clean`

### Error de Compilación en Android
- Verifica que las dependencias estén en `build.gradle`
- Limpia el proyecto: `cd android && ./gradlew clean`

## Próximos Pasos

1. **Implementar Almacenamiento Seguro**: Usar Keychain (iOS) y Keystore (Android)
2. **Mejorar Encriptación**: Implementar encriptación AES con claves biométricas
3. **Agregar Tests**: Tests unitarios y de integración
4. **Optimizar UI**: Mejorar la experiencia de usuario
5. **Documentación**: Agregar más ejemplos de uso

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.