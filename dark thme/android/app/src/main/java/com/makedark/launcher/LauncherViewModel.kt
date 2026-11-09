package com.makedark.launcher

import android.app.Application
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.makedark.launcher.data.AppInfo
import com.makedark.launcher.data.FolderModel
import com.makedark.launcher.data.LauncherPreferences
import com.makedark.launcher.receiver.BatteryReceiver
import com.makedark.launcher.receiver.PackageChangeReceiver
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

class LauncherViewModel(application: Application) : AndroidViewModel(application) {

    private val prefs = LauncherPreferences(application)
    private val packageManager: PackageManager = application.packageManager

    private val _installedApps = MutableStateFlow<List<AppInfo>>(emptyList())
    val installedApps: StateFlow<List<AppInfo>> = _installedApps.asStateFlow()

    private val _favoriteApps = MutableStateFlow<List<AppInfo>>(emptyList())
    val favoriteApps: StateFlow<List<AppInfo>> = _favoriteApps.asStateFlow()

    private val _folders = MutableStateFlow<List<FolderModel>>(emptyList())
    val folders: StateFlow<List<FolderModel>> = _folders.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _batteryPercent = MutableStateFlow(100)
    val batteryPercent: StateFlow<Int> = _batteryPercent.asStateFlow()

    private val _isCharging = MutableStateFlow(false)
    val isCharging: StateFlow<Boolean> = _isCharging.asStateFlow()

    private val _iconPack = MutableStateFlow(prefs.getIconPack())
    val iconPack: StateFlow<String> = _iconPack.asStateFlow()

    private val _gridColumns = MutableStateFlow(prefs.getGridColumns())
    val gridColumns: StateFlow<Int> = _gridColumns.asStateFlow()

    private val _lowRamMode = MutableStateFlow(prefs.isLowRamMode())
    val lowRamMode: StateFlow<Boolean> = _lowRamMode.asStateFlow()

    private val _is24HourClock = MutableStateFlow(prefs.is24HourClock())
    val is24HourClock: StateFlow<Boolean> = _is24HourClock.asStateFlow()

    private val _wallpaperMode = MutableStateFlow(prefs.getWallpaperMode())
    val wallpaperMode: StateFlow<String> = _wallpaperMode.asStateFlow()

    private val batteryReceiver = BatteryReceiver { percent, charging ->
        _batteryPercent.value = percent
        _isCharging.value = charging
    }

    init {
        // Register battery receiver dynamically
        val batteryFilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        application.registerReceiver(batteryReceiver, batteryFilter)

        // Set package change callback
        PackageChangeReceiver.onPackageChangedListener = {
            reloadApps()
        }

        loadFolders()
        reloadApps()
    }

    fun reloadApps() {
        viewModelScope.launch(Dispatchers.IO) {
            val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
                addCategory(Intent.CATEGORY_LAUNCHER)
            }

            val resolveInfos = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                packageManager.queryIntentActivities(
                    mainIntent,
                    PackageManager.ResolveInfoFlags.of(0L)
                )
            } else {
                packageManager.queryIntentActivities(mainIntent, 0)
            }

            val favoritesSet = prefs.getFavorites()
            val selfPackage = getApplication<Application>().packageName

            val apps = resolveInfos
                .filter { it.activityInfo.packageName != selfPackage }
                .map { info ->
                    val pkgName = info.activityInfo.packageName
                    val actName = info.activityInfo.name
                    val appLabel = info.loadLabel(packageManager).toString()
                    val isFavorite = favoritesSet.contains(pkgName)

                    AppInfo(
                        packageName = pkgName,
                        activityName = actName,
                        label = appLabel,
                        isFavorite = isFavorite,
                        isSystemApp = (info.activityInfo.applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_SYSTEM) != 0
                    )
                }
                .sortedBy { it.label.lowercase() }

            withContext(Dispatchers.Main) {
                _installedApps.value = apps
                _favoriteApps.value = apps.filter { it.isFavorite }
            }
        }
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun toggleFavorite(packageName: String) {
        val currentFavorites = prefs.getFavorites().toMutableSet()
        if (currentFavorites.contains(packageName)) {
            currentFavorites.remove(packageName)
        } else {
            currentFavorites.add(packageName)
        }
        prefs.saveFavorites(currentFavorites)

        _installedApps.value = _installedApps.value.map {
            if (it.packageName == packageName) it.copy(isFavorite = currentFavorites.contains(packageName)) else it
        }
        _favoriteApps.value = _installedApps.value.filter { it.isFavorite }
    }

    // Folder Management
    private fun loadFolders() {
        val raw = prefs.getSerializedFolders()
        if (raw.isBlank()) {
            // Seed a default "Essentials" folder
            _folders.value = listOf(
                FolderModel(
                    id = "folder_essentials",
                    name = "Essentials",
                    packageNames = emptyList(),
                    iconColor = 0xFF448AFF
                )
            )
            return
        }

        try {
            val jsonArray = JSONArray(raw)
            val list = mutableListOf<FolderModel>()
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                val pkgs = mutableListOf<String>()
                val arr = obj.optJSONArray("packageNames")
                if (arr != null) {
                    for (j in 0 until arr.length()) {
                        pkgs.add(arr.getString(j))
                    }
                }
                list.add(
                    FolderModel(
                        id = obj.getString("id"),
                        name = obj.getString("name"),
                        packageNames = pkgs,
                        iconColor = obj.optLong("iconColor", 0xFF448AFF)
                    )
                )
            }
            _folders.value = list
        } catch (e: Exception) {
            _folders.value = emptyList()
        }
    }

    private fun persistFolders(list: List<FolderModel>) {
        val jsonArray = JSONArray()
        list.forEach { folder ->
            val obj = JSONObject().apply {
                put("id", folder.id)
                put("name", folder.name)
                put("iconColor", folder.iconColor)
                val pkgs = JSONArray()
                folder.packageNames.forEach { pkgs.put(it) }
                put("packageNames", pkgs)
            }
            jsonArray.put(obj)
        }
        prefs.saveSerializedFolders(jsonArray.toString())
        _folders.value = list
    }

    fun createFolder(name: String) {
        val newFolder = FolderModel(
            id = UUID.randomUUID().toString(),
            name = name.ifBlank { "New Folder" },
            packageNames = emptyList(),
            iconColor = 0xFF448AFF
        )
        persistFolders(_folders.value + newFolder)
    }

    fun deleteFolder(folderId: String) {
        persistFolders(_folders.value.filter { it.id != folderId })
    }

    fun addAppToFolder(folderId: String, packageName: String) {
        val updated = _folders.value.map { folder ->
            if (folder.id == folderId && !folder.packageNames.contains(packageName)) {
                folder.copy(packageNames = folder.packageNames + packageName)
            } else {
                folder
            }
        }
        persistFolders(updated)
    }

    fun removeAppFromFolder(folderId: String, packageName: String) {
        val updated = _folders.value.map { folder ->
            if (folder.id == folderId) {
                folder.copy(packageNames = folder.packageNames - packageName)
            } else {
                folder
            }
        }
        persistFolders(updated)
    }

    // Settings actions
    fun setIconPack(packId: String) {
        prefs.setIconPack(packId)
        _iconPack.value = packId
    }

    fun setGridColumns(cols: Int) {
        prefs.setGridColumns(cols)
        _gridColumns.value = cols
    }

    fun setLowRamMode(enabled: Boolean) {
        prefs.setLowRamMode(enabled)
        _lowRamMode.value = enabled
    }

    fun set24HourClock(enabled: Boolean) {
        prefs.set24HourClock(enabled)
        _is24HourClock.value = enabled
    }

    fun setWallpaperMode(mode: String) {
        prefs.setWallpaperMode(mode)
        _wallpaperMode.value = mode
    }

    // Launch Actions
    fun launchApp(context: Context, app: AppInfo) {
        try {
            val intent = Intent(Intent.ACTION_MAIN).apply {
                addCategory(Intent.CATEGORY_LAUNCHER)
                component = ComponentName(app.packageName, app.activityName)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            // Fallback to getLaunchIntentForPackage
            val fallback = context.packageManager.getLaunchIntentForPackage(app.packageName)
            fallback?.let { context.startActivity(it) }
        }
    }

    fun openAppInfo(context: Context, packageName: String) {
        try {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.parse("package:$packageName")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        } catch (_: Exception) {}
    }

    fun requestUninstall(context: Context, packageName: String) {
        try {
            val intent = Intent(Intent.ACTION_DELETE).apply {
                data = Uri.parse("package:$packageName")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        } catch (_: Exception) {}
    }

    fun openDefaultLauncherSettings(context: Context) {
        try {
            // Standard Android intent to choose default home launcher
            val intent = Intent(Settings.ACTION_HOME_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            // Fallback for Android 9 / vendor skins like itel
            try {
                val fallback = Intent(Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                context.startActivity(fallback)
            } catch (e2: Exception) {
                val generalSettings = Intent(Settings.ACTION_SETTINGS).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                context.startActivity(generalSettings)
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        try {
            getApplication<Application>().unregisterReceiver(batteryReceiver)
        } catch (_: Exception) {}
    }
}
