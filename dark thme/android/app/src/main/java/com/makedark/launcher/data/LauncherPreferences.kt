package com.makedark.launcher.data

import android.content.Context
import android.content.SharedPreferences

/**
 * High-performance, low-RAM persistence layer using Android SharedPreferences.
 * Zero heavy ORM overhead, zero memory leaks.
 */
class LauncherPreferences(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREFS_NAME = "make_dark_launcher_prefs"
        private const val KEY_FAVORITES = "key_favorites"
        private const val KEY_FOLDERS_DATA = "key_folders_data"
        private const val KEY_ICON_PACK = "key_icon_pack"
        private const val KEY_GRID_SIZE = "key_grid_size"
        private const val KEY_CLOCK_24H = "key_clock_24h"
        private const val KEY_LOW_RAM_MODE = "key_low_ram_mode"
        private const val KEY_WALLPAPER_MODE = "key_wallpaper_mode"
        private const val KEY_HIDE_LABELS = "key_hide_labels"
    }

    fun getFavorites(): Set<String> {
        return prefs.getStringSet(KEY_FAVORITES, emptySet()) ?: emptySet()
    }

    fun saveFavorites(packageNames: Set<String>) {
        prefs.edit().putStringSet(KEY_FAVORITES, packageNames).apply()
    }

    fun addFavorite(packageName: String) {
        val current = getFavorites().toMutableSet()
        current.add(packageName)
        saveFavorites(current)
    }

    fun removeFavorite(packageName: String) {
        val current = getFavorites().toMutableSet()
        current.remove(packageName)
        saveFavorites(current)
    }

    fun getIconPack(): String {
        return prefs.getString(KEY_ICON_PACK, "amoled_blue") ?: "amoled_blue"
    }

    fun setIconPack(packId: String) {
        prefs.edit().putString(KEY_ICON_PACK, packId).apply()
    }

    fun getGridColumns(): Int {
        return prefs.getInt(KEY_GRID_SIZE, 4)
    }

    fun setGridColumns(cols: Int) {
        prefs.edit().putInt(KEY_GRID_SIZE, cols).apply()
    }

    fun is24HourClock(): Boolean {
        return prefs.getBoolean(KEY_CLOCK_24H, true)
    }

    fun set24HourClock(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_CLOCK_24H, enabled).apply()
    }

    fun isLowRamMode(): Boolean {
        return prefs.getBoolean(KEY_LOW_RAM_MODE, true) // enabled by default for itel Vision 1 LTE
    }

    fun setLowRamMode(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_LOW_RAM_MODE, enabled).apply()
    }

    fun getWallpaperMode(): String {
        return prefs.getString(KEY_WALLPAPER_MODE, "pure_black") ?: "pure_black"
    }

    fun setWallpaperMode(mode: String) {
        prefs.edit().putString(KEY_WALLPAPER_MODE, mode).apply()
    }

    fun isHideLabels(): Boolean {
        return prefs.getBoolean(KEY_HIDE_LABELS, false)
    }

    fun setHideLabels(hide: Boolean) {
        prefs.edit().putBoolean(KEY_HIDE_LABELS, hide).apply()
    }

    fun getSerializedFolders(): String {
        return prefs.getString(KEY_FOLDERS_DATA, "") ?: ""
    }

    fun saveSerializedFolders(data: String) {
        prefs.edit().putString(KEY_FOLDERS_DATA, data).apply()
    }
}
