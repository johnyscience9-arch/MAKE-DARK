package com.makedark.launcher.data

import android.graphics.drawable.Drawable

/**
 * Lightweight representation of an installed application.
 * Designed for minimum memory footprint on itel Vision 1 LTE (2GB RAM).
 */
data class AppInfo(
    val packageName: String,
    val activityName: String,
    val label: String,
    val isFavorite: Boolean = false,
    val folderId: String? = null,
    val isSystemApp: Boolean = false,
    // Icon is cached on demand or represented via resource to prevent Dalvik heap OOM
    @Transient val cachedIcon: Drawable? = null
)
