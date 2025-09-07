package com.superheroes.biometricauth

import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.Looper
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
import com.facebook.react.bridge.Callback
import com.facebook.react.modules.core.DeviceEventManagerModule

class BiometricAuthModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BiometricAuth"
    }

    @ReactMethod
    fun authenticate(onSuccess: Callback, onFailure: Callback) {
        Handler(Looper.getMainLooper()).post {
            val activity = reactApplicationContext.currentActivity as? FragmentActivity
            if (activity == null) {
                val errorMap = Arguments.createMap()
                errorMap.putString("code", "NO_ACTIVITY")
                errorMap.putString("message", "No activity available for biometric authentication")
                onFailure.invoke(errorMap)
                return@post
            }

            val biometricManager = BiometricManager.from(reactApplicationContext)
            when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK)) {
                BiometricManager.BIOMETRIC_SUCCESS -> {
                    showBiometricPrompt(activity, onSuccess, onFailure)
                }
                BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> {
                    val errorMap = Arguments.createMap()
                    errorMap.putString("code", "NO_HARDWARE")
                    errorMap.putString("message", "No biometric hardware available")
                    onFailure.invoke(errorMap)
                }
                BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> {
                    val errorMap = Arguments.createMap()
                    errorMap.putString("code", "HARDWARE_UNAVAILABLE")
                    errorMap.putString("message", "Biometric hardware is currently unavailable")
                    onFailure.invoke(errorMap)
                }
                BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
                    val errorMap = Arguments.createMap()
                    errorMap.putString("code", "NO_BIOMETRICS_ENROLLED")
                    errorMap.putString("message", "No biometrics enrolled. Please set up fingerprint or face unlock")
                    onFailure.invoke(errorMap)
                }
                else -> {
                    val errorMap = Arguments.createMap()
                    errorMap.putString("code", "UNKNOWN_ERROR")
                    errorMap.putString("message", "Unknown biometric error")
                    onFailure.invoke(errorMap)
                }
            }
        }
    }

    private fun showBiometricPrompt(
        activity: FragmentActivity,
        onSuccess: Callback,
        onFailure: Callback
    ) {
        // main thread for BiometricPrompt
        Handler(Looper.getMainLooper()).post {
            val executor = ContextCompat.getMainExecutor(reactApplicationContext)
            val biometricPrompt = BiometricPrompt(activity, executor, object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                onSuccess.invoke()
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                super.onAuthenticationError(errorCode, errString)
                val errorMap = Arguments.createMap()
                errorMap.putString("code", "AUTHENTICATION_ERROR")
                errorMap.putString("message", errString.toString())
                errorMap.putInt("details", errorCode)
                onFailure.invoke(errorMap)
            }

            override fun onAuthenticationFailed() {
                super.onAuthenticationFailed()
                val errorMap = Arguments.createMap()
                errorMap.putString("code", "AUTHENTICATION_FAILED")
                errorMap.putString("message", "Biometric authentication failed")
                onFailure.invoke(errorMap)
            }
        })

            val promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle("Autenticación Biométrica")
                .setSubtitle("Usa tu huella dactilar para crear un equipo")
                .setNegativeButtonText("Cancelar")
                .build()

            biometricPrompt.authenticate(promptInfo)
        }
    }
}

data class BiometricAuthenticationError(
    val code: String,
    val message: String,
    val details: Any? = null
)