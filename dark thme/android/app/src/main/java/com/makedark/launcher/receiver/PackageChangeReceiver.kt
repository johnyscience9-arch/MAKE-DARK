package com.makedark.launcher.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Listens for package installation, update, or removal events
 * to refresh the app drawer dynamically.
 */
class PackageChangeReceiver : BroadcastReceiver() {

    companion object {
        var onPackageChangedListener: (() -> Unit)? = null
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        when (intent?.action) {
            Intent.ACTION_PACKAGE_ADDED,
            Intent.ACTION_PACKAGE_REMOVED,
            Intent.ACTION_PACKAGE_REPLACED -> {
                onPackageChangedListener?.invoke()
            }
        }
    }
}
