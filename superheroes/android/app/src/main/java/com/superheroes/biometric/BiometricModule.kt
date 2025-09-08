package com.superheroes.biometric

import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

class BiometricModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    companion object {
        private const val MODULE_NAME = "BiometricModule"
    }

    override fun getName(): String = MODULE_NAME

    @ReactMethod
    fun authenticate(onSuccess: () -> Unit, onFailure: (error: Map<String, Any>) -> Unit) {
        try {
            val activity = reactApplicationContext.currentActivity as? FragmentActivity
            if (activity == null) {
                val error = mapOf(
                    "code" to "NO_ACTIVITY",
                    "message" to "No current activity available"
                )
                onFailure(error)
                return
            }

            val biometricManager = BiometricManager.from(reactApplicationContext)
            if (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK) != BiometricManager.BIOMETRIC_SUCCESS) {
                val error = mapOf(
                    "code" to "BIOMETRIC_NOT_AVAILABLE",
                    "message" to "Biometric authentication not available"
                )
                onFailure(error)
                return
            }

            val executor = ContextCompat.getMainExecutor(reactApplicationContext)
            val biometricPrompt = BiometricPrompt(activity, executor, object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    onSuccess()
                }

                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    val error = mapOf(
                        "code" to "AUTHENTICATION_ERROR",
                        "message" to errString.toString(),
                        "details" to "Error code: $errorCode"
                    )
                    onFailure(error)
                }

                override fun onAuthenticationFailed() {
                    super.onAuthenticationFailed()
                    val error = mapOf(
                        "code" to "AUTHENTICATION_FAILED",
                        "message" to "Authentication failed"
                    )
                    onFailure(error)
                }
            })

            val promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle("Autenticación Biométrica")
                .setSubtitle("Confirma tu identidad para continuar")
                .setNegativeButtonText("Cancelar")
                .build()

            biometricPrompt.authenticate(promptInfo)
        } catch (e: Exception) {
            val error = mapOf(
                "code" to "UNEXPECTED_ERROR",
                "message" to "An unexpected error occurred",
                "details" to (e.message ?: "Unknown error")
            )
            onFailure(error)
        }
    }

    @ReactMethod
    fun isSensorAvailable(promise: Promise) {
        try {
            val biometricManager = BiometricManager.from(reactApplicationContext)
            val canAuthenticate = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK)
            promise.resolve(canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS)
        } catch (e: Exception) {
            promise.reject("BIOMETRIC_ERROR", "Error checking biometric availability", e)
        }
    }

    @ReactMethod
    fun getAvailableBiometryType(promise: Promise) {
        try {
            val biometricManager = BiometricManager.from(reactApplicationContext)
            val canAuthenticate = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK)
            
            val biometryType = if (canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS) {
                "Fingerprint" // manejo tanto huella como rostro
            } else {
                "None"
            }
            
            promise.resolve(biometryType)
        } catch (e: Exception) {
            promise.reject("BIOMETRIC_ERROR", "Error getting biometry type", e)
        }
    }

    @ReactMethod
    fun getCapabilities(promise: Promise) {
        try {
            val biometricManager = BiometricManager.from(reactApplicationContext)
            val canAuthenticate = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK)
            
            val capabilities = Arguments.createMap().apply {
                putBoolean("isAvailable", canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS)
                putString("biometryType", if (canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS) "Fingerprint" else "None")
                putBoolean("isDeviceSecure", canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS || canAuthenticate == BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE)
            }
            
            promise.resolve(capabilities)
        } catch (e: Exception) {
            promise.reject("BIOMETRIC_ERROR", "Error getting capabilities", e)
        }
    }
}
