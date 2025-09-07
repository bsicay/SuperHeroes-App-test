#import "BiometricAuth.h"
#import <React/RCTLog.h>

@implementation BiometricAuth

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_METHOD(isSensorAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  LAContext *context = [[LAContext alloc] init];
  NSError *error = nil;
  
  BOOL canEvaluate = [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
  
  if (error) {
    reject(@"BIOMETRIC_ERROR", @"Biometric authentication not available", error);
    return;
  }
  
  resolve(@(canEvaluate));
}

RCT_EXPORT_METHOD(getAvailableBiometryType:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  LAContext *context = [[LAContext alloc] init];
  NSError *error = nil;
  
  if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
    switch (context.biometryType) {
      case LABiometryTypeFaceID:
        resolve(@"FaceID");
        break;
      case LABiometryTypeTouchID:
        resolve(@"TouchID");
        break;
      case LABiometryTypeNone:
        resolve(@"None");
        break;
      default:
        resolve(@"Unknown");
        break;
    }
  } else {
    resolve(@"None");
  }
}

RCT_EXPORT_METHOD(authenticate:(NSString *)promptMessage
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  LAContext *context = [[LAContext alloc] init];
  NSError *error = nil;
  
  if (![context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
    reject(@"BIOMETRIC_ERROR", @"Biometric authentication not available", error);
    return;
  }
  
  [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
          localizedReason:promptMessage
                    reply:^(BOOL success, NSError * _Nullable error) {
    if (success) {
      resolve(@(YES));
    } else {
      reject(@"AUTHENTICATION_FAILED", @"Authentication failed", error);
    }
  }];
}

RCT_EXPORT_METHOD(authenticateWithFallback:(NSString *)promptMessage
                  fallbackPromptMessage:(NSString *)fallbackPromptMessage
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  LAContext *context = [[LAContext alloc] init];
  NSError *error = nil;
  
  if (![context canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:&error]) {
    reject(@"BIOMETRIC_ERROR", @"Authentication not available", error);
    return;
  }
  
  [context evaluatePolicy:LAPolicyDeviceOwnerAuthentication
          localizedReason:promptMessage
                    reply:^(BOOL success, NSError * _Nullable error) {
    if (success) {
      resolve(@(YES));
    } else {
      reject(@"AUTHENTICATION_FAILED", @"Authentication failed", error);
    }
  }];
}

RCT_EXPORT_METHOD(createKeys:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // Implementación para crear claves biométricas
  // Esta es una implementación simplificada
  resolve(@(YES));
}

RCT_EXPORT_METHOD(deleteKeys:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // Implementación para eliminar claves biométricas
  // Esta es una implementación simplificada
  resolve(@(YES));
}

RCT_EXPORT_METHOD(biometricKeysExist:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // Implementación para verificar si existen claves biométricas
  // Esta es una implementación simplificada
  resolve(@(NO));
}

RCT_EXPORT_METHOD(encryptData:(NSString *)data
                  promptMessage:(NSString *)promptMessage
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // Implementación para encriptar datos usando biometría
  // Esta es una implementación simplificada
  resolve(data);
}

RCT_EXPORT_METHOD(decryptData:(NSString *)encryptedData
                  promptMessage:(NSString *)promptMessage
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // Implementación para desencriptar datos usando biometría
  // Esta es una implementación simplificada
  resolve(encryptedData);
}

RCT_EXPORT_METHOD(getSecurityLevel:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  LAContext *context = [[LAContext alloc] init];
  NSError *error = nil;
  
  if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
    resolve(@"BIOMETRIC");
  } else if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:&error]) {
    resolve(@"DEVICE_PASSCODE");
  } else {
    resolve(@"NONE");
  }
}

RCT_EXPORT_METHOD(isDeviceSecure:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  LAContext *context = [[LAContext alloc] init];
  NSError *error = nil;
  
  BOOL isSecure = [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:&error];
  resolve(@(isSecure));
}

@end