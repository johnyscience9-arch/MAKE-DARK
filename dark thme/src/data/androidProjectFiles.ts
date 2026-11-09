export interface ProjectFile {
  path: string;
  name: string;
  category: 'manifest' | 'gradle' | 'kotlin' | 'resources' | 'ci_cd' | 'docs';
  description: string;
  language: 'xml' | 'kotlin' | 'groovy' | 'yaml' | 'markdown' | 'properties';
  content: string;
}

export const ANDROID_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'manifest',
    language: 'xml',
    description: 'Declares HOME and DEFAULT intent categories, low-RAM flags, and package change receivers.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.makedark.launcher">

    <!-- Query installed applications for the custom launcher app drawer -->
    <uses-permission android:name="android.permission.QUERY_ALL_PACKAGES"
        tools:ignore="QueryAllPackagesPermission" />

    <!-- Vibration feedback for long press on icons and widgets -->
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MakeDark.Launcher"
        android:hardwareAccelerated="true"
        android:largeHeap="false"
        tools:targetApi="34">

        <!-- Main Home Launcher Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:clearTaskOnLaunch="true"
            android:stateNotNeeded="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:windowSoftInputMode="adjustPan">

            <!-- Primary Launcher Intent Filters: Required for Android HOME launcher -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.HOME" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>

            <!-- App drawer entry if opened from another launcher during evaluation -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Broadcast receiver to dynamically update app drawer when packages change -->
        <receiver
            android:name=".receiver.PackageChangeReceiver"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.PACKAGE_ADDED" />
                <action android:name="android.intent.action.PACKAGE_REMOVED" />
                <action android:name="android.intent.action.PACKAGE_REPLACED" />
                <data android:scheme="package" />
            </intent-filter>
        </receiver>

    </application>

</manifest>`
  },
  {
    path: 'android/app/src/main/java/com/makedark/launcher/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Root launcher activity with edge-to-edge transparent system bars and back button handling.',
    content: `package com.makedark.launcher

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.Crossfade
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.core.view.WindowCompat
import com.makedark.launcher.data.AppInfo
import com.makedark.launcher.data.FolderModel
import com.makedark.launcher.ui.*
import com.makedark.launcher.ui.theme.MakeDarkLauncherTheme

enum class LauncherScreen {
    HOME,
    DRAWER,
    SETTINGS
}

class MainActivity : ComponentActivity() {

    private val viewModel: LauncherViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Edge-to-edge display for true AMOLED black bars
        WindowCompat.setDecorFitsSystemWindows(window, false)

        setContent {
            MakeDarkLauncherTheme {
                var currentScreen by remember { mutableStateOf(LauncherScreen.HOME) }
                var activeFolder by remember { mutableStateOf<FolderModel?>(null) }
                var activeShortcutApp by remember { mutableStateOf<AppInfo?>(null) }

                // Intercept back button: Launcher should never exit when at HOME
                DisposableEffect(currentScreen, activeFolder, activeShortcutApp) {
                    val callback = object : OnBackPressedCallback(true) {
                        override fun handleOnBackPressed() {
                            when {
                                activeShortcutApp != null -> activeShortcutApp = null
                                activeFolder != null -> activeFolder = null
                                currentScreen != LauncherScreen.HOME -> currentScreen = LauncherScreen.HOME
                                else -> {
                                    // At Home screen: do nothing (standard Android launcher behavior)
                                }
                            }
                        }
                    }
                    onBackPressedDispatcher.addCallback(callback)
                    onDispose { callback.remove() }
                }

                Box(modifier = Modifier.fillMaxSize()) {
                    Crossfade(
                        targetState = currentScreen,
                        animationSpec = tween(durationMillis = 200),
                        label = "LauncherScreenTransition"
                    ) { screen ->
                        when (screen) {
                            LauncherScreen.HOME -> {
                                HomeScreen(
                                    viewModel = viewModel,
                                    onOpenDrawer = { currentScreen = LauncherScreen.DRAWER },
                                    onOpenSettings = { currentScreen = LauncherScreen.SETTINGS },
                                    onOpenFolder = { activeFolder = it },
                                    onAppLongClick = { activeShortcutApp = it }
                                )
                            }
                            LauncherScreen.DRAWER -> {
                                AppDrawer(
                                    viewModel = viewModel,
                                    onCloseDrawer = { currentScreen = LauncherScreen.HOME },
                                    onAppLongClick = { activeShortcutApp = it }
                                )
                            }
                            LauncherScreen.SETTINGS -> {
                                SettingsScreen(
                                    viewModel = viewModel,
                                    onCloseSettings = { currentScreen = LauncherScreen.HOME }
                                )
                            }
                        }
                    }

                    // Contextual Dialogs
                    activeFolder?.let { folder ->
                        FolderDialog(
                            folder = folder,
                            viewModel = viewModel,
                            onDismiss = { activeFolder = null }
                        )
                    }

                    activeShortcutApp?.let { app ->
                        AppShortcutsDialog(
                            app = app,
                            viewModel = viewModel,
                            onDismiss = { activeShortcutApp = null }
                        )
                    }
                }
            }
        }
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/makedark/launcher/LauncherViewModel.kt',
    name: 'LauncherViewModel.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Handles background query of installed apps, search filtering, battery monitoring, and default launcher intent.',
    content: `package com.makedark.launcher

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
        val batteryFilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        application.registerReceiver(batteryReceiver, batteryFilter)

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

    private fun loadFolders() {
        val raw = prefs.getSerializedFolders()
        if (raw.isBlank()) {
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

    fun launchApp(context: Context, app: AppInfo) {
        try {
            val intent = Intent(Intent.ACTION_MAIN).apply {
                addCategory(Intent.CATEGORY_LAUNCHER)
                component = ComponentName(app.packageName, app.activityName)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
            }
            context.startActivity(intent)
        } catch (e: Exception) {
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
            val intent = Intent(Settings.ACTION_HOME_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        } catch (e: Exception) {
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
}`
  },
  {
    path: 'android/app/src/main/java/com/makedark/launcher/ui/HomeScreen.kt',
    name: 'HomeScreen.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Minimalist AMOLED clock widget, date banner, battery indicator, folder links, and favorites dock.',
    content: `package com.makedark.launcher.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BatteryChargingFull
import androidx.compose.material.icons.filled.BatteryFull
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.makedark.launcher.LauncherViewModel
import com.makedark.launcher.data.AppInfo
import com.makedark.launcher.data.FolderModel
import com.makedark.launcher.ui.theme.*
import kotlinx.coroutines.delay
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun HomeScreen(
    viewModel: LauncherViewModel,
    onOpenDrawer: () -> Unit,
    onOpenSettings: () -> Unit,
    onOpenFolder: (FolderModel) -> Unit,
    onAppLongClick: (AppInfo) -> Unit
) {
    val context = LocalContext.current
    val favoriteApps by viewModel.favoriteApps.collectAsState()
    val folders by viewModel.folders.collectAsState()
    val batteryPercent by viewModel.batteryPercent.collectAsState()
    val isCharging by viewModel.isCharging.collectAsState()
    val is24Hour by viewModel.is24HourClock.collectAsState()

    var currentTime by remember { mutableStateOf(System.currentTimeMillis()) }
    LaunchedEffect(Unit) {
        while (true) {
            currentTime = System.currentTimeMillis()
            delay(1000L)
        }
    }

    val timeFormat = remember(is24Hour) {
        if (is24Hour) SimpleDateFormat("HH:mm", Locale.getDefault())
        else SimpleDateFormat("hh:mm a", Locale.getDefault())
    }
    val dateFormat = remember { SimpleDateFormat("EEEE, MMMM d", Locale.getDefault()) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AmoledBlack)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(DarkCharcoal)
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Icon(
                        imageVector = if (isCharging) Icons.Default.BatteryChargingFull else Icons.Default.BatteryFull,
                        contentDescription = "Battery",
                        tint = if (isCharging) BatteryCharging else SubtleBlueAccent,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "$batteryPercent%",
                        color = TextPrimary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }

                IconButton(
                    onClick = onOpenSettings,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(DarkCharcoal)
                ) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = "Launcher Settings",
                        tint = TextSecondary,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(vertical = 32.dp)
            ) {
                Text(
                    text = timeFormat.format(Date(currentTime)),
                    color = TextPrimary,
                    fontSize = 58.sp,
                    fontWeight = FontWeight.Light,
                    letterSpacing = (-1).sp,
                    fontFamily = FontFamily.SansSerif
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = dateFormat.format(Date(currentTime)).uppercase(),
                    color = TextSecondary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Normal,
                    letterSpacing = 1.sp
                )
            }

            if (folders.isNotEmpty()) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp),
                    horizontalArrangement = Arrangement.Start
                ) {
                    folders.take(4).forEach { folder ->
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier
                                .weight(1f)
                                .clickable { onOpenFolder(folder) }
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(54.dp)
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(DarkCharcoal)
                                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Folder,
                                    contentDescription = folder.name,
                                    tint = SubtleBlueAccent,
                                    modifier = Modifier.size(26.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = folder.name,
                                color = TextPrimary,
                                fontSize = 11.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                }
            }

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp)
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .clickable { onOpenDrawer() }
                        .padding(vertical = 8.dp, horizontal = 16.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowUp,
                        contentDescription = "Swipe up for apps",
                        tint = TextMuted,
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = "APPS",
                        color = TextMuted,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        letterSpacing = 2.sp
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(24.dp))
                        .background(DarkCharcoal)
                        .border(1.dp, CardBorder, RoundedCornerShape(24.dp))
                        .padding(vertical = 12.dp, horizontal = 8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        val dockApps = favoriteApps.take(5)
                        if (dockApps.isEmpty()) {
                            Text(
                                text = "Long press any app in drawer to pin here",
                                color = TextSecondary,
                                fontSize = 12.sp,
                                modifier = Modifier.padding(vertical = 8.dp)
                            )
                        } else {
                            dockApps.forEach { app ->
                                HomeAppIcon(
                                    app = app,
                                    onClick = { viewModel.launchApp(context, app) },
                                    onLongClick = { onAppLongClick(app) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun HomeAppIcon(
    app: AppInfo,
    onClick: () -> Unit,
    onLongClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .width(56.dp)
            .combinedClickable(
                onClick = onClick,
                onLongClick = onLongClick
            )
    ) {
        Box(
            modifier = Modifier
                .size(46.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(SecondaryBackground)
                .border(1.dp, CardBorder, RoundedCornerShape(14.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = app.label.take(1).uppercase(),
                color = SubtleBlueAccent,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = app.label,
            color = TextPrimary,
            fontSize = 11.sp,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            textAlign = TextAlign.Center
        )
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/makedark/launcher/ui/AppDrawer.kt',
    name: 'AppDrawer.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Instant search filtering, category tabs, and LazyVerticalGrid with stable item keys.',
    content: `package com.makedark.launcher.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.makedark.launcher.LauncherViewModel
import com.makedark.launcher.data.AppInfo
import com.makedark.launcher.ui.theme.*

@Composable
fun AppDrawer(
    viewModel: LauncherViewModel,
    onCloseDrawer: () -> Unit,
    onAppLongClick: (AppInfo) -> Unit
) {
    val context = LocalContext.current
    val installedApps by viewModel.installedApps.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val gridColumns by viewModel.gridColumns.collectAsState()

    var selectedFilter by remember { mutableStateOf("ALL") }

    val filteredApps = remember(installedApps, searchQuery, selectedFilter) {
        installedApps.filter { app ->
            val matchesQuery = searchQuery.isBlank() || app.label.contains(searchQuery, ignoreCase = true)
            val matchesCategory = when (selectedFilter) {
                "FAVORITES" -> app.isFavorite
                "SYSTEM" -> app.isSystemApp
                "USER" -> !app.isSystemApp
                else -> true
            }
            matchesQuery && matchesCategory
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AmoledBlack)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp, bottom = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onCloseDrawer,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(DarkCharcoal)
                ) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back to Home",
                        tint = TextPrimary,
                        modifier = Modifier.size(18.dp)
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                Row(
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(DarkCharcoal)
                        .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                        .padding(horizontal = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = TextSecondary,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Box(modifier = Modifier.weight(1f)) {
                        if (searchQuery.isEmpty()) {
                            Text(
                                text = "Search \${installedApps.size} apps...",
                                color = TextMuted,
                                fontSize = 14.sp
                            )
                        }
                        BasicTextField(
                            value = searchQuery,
                            onValueChange = { viewModel.setSearchQuery(it) },
                            textStyle = TextStyle(
                                color = TextPrimary,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Normal
                            ),
                            cursorBrush = SolidColor(SubtleBlueAccent),
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    if (searchQuery.isNotEmpty()) {
                        IconButton(
                            onClick = { viewModel.setSearchQuery("") },
                            modifier = Modifier.size(24.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Clear",
                                tint = TextSecondary,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("ALL", "FAVORITES", "USER", "SYSTEM").forEach { category ->
                    val isSelected = selectedFilter == category
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isSelected) SubtleBlueAccent else DarkCharcoal)
                            .border(1.dp, if (isSelected) SubtleBlueAccent else CardBorder, RoundedCornerShape(8.dp))
                            .combinedClickable(
                                onClick = { selectedFilter = category }
                            )
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = category,
                            color = if (isSelected) AmoledBlack else TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    }
                }
            }

            if (filteredApps.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No apps found matching \\"\$searchQuery\\"",
                        color = TextSecondary,
                        fontSize = 13.sp
                    )
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(gridColumns),
                    modifier = Modifier
                        .fillMaxSize()
                        .weight(1f)
                        .padding(top = 8.dp),
                    contentPadding = PaddingValues(bottom = 24.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(
                        items = filteredApps,
                        key = { it.packageName }
                    ) { app ->
                        DrawerAppItem(
                            app = app,
                            onClick = {
                                viewModel.launchApp(context, app)
                            },
                            onLongClick = {
                                onAppLongClick(app)
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun DrawerAppItem(
    app: AppInfo,
    onClick: () -> Unit,
    onLongClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .fillMaxWidth()
            .combinedClickable(
                onClick = onClick,
                onLongClick = onLongClick
            )
            .padding(vertical = 4.dp)
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(DarkCharcoal)
                .border(1.dp, CardBorder, RoundedCornerShape(14.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = app.label.take(1).uppercase(),
                color = SubtleBlueAccent,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = app.label,
            color = TextPrimary,
            fontSize = 11.sp,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            textAlign = TextAlign.Center
        )
    }
}`
  },
  {
    path: 'android/app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'gradle',
    language: 'groovy',
    description: 'App module configuration targeting minSdk 28 (itel Vision 1 LTE / Android 9 Pie) with Compose BOM.',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.makedark.launcher"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.makedark.launcher"
        minSdk = 28 // itel Vision 1 LTE (Android 9 Pie compatibility)
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        ndk {
            abiFilters.addAll(listOf("armeabi-v7a", "arm64-v8a"))
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf(
            "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api",
            "-opt-in=androidx.compose.foundation.ExperimentalFoundationApi"
        )
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.10"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")

    val composeBom = platform("androidx.compose:compose-bom:2024.02.00")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.compose.foundation:foundation")

    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    implementation("io.coil-kt:coil-compose:2.5.0")

    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}`
  },
  {
    path: '.github/workflows/build-apk.yml',
    name: 'build-apk.yml',
    category: 'ci_cd',
    language: 'yaml',
    description: 'GitHub Actions workflow that checks out code, runs Gradle assembleDebug, and uploads APK artifact.',
    content: `name: Build MAKE DARK Launcher Debug APK

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    name: Build Android Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Grant Execute Permission for Gradle Wrapper
        run: |
          cd android
          chmod +x gradlew || true

      - name: Build Debug APK with Gradle
        run: |
          cd android
          ./gradlew assembleDebug --stacktrace --no-daemon

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: MakeDark-AMOLED-Launcher-v1.0.0-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 14`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    language: 'markdown',
    description: 'Detailed documentation, itel Vision 1 LTE hardware profile, battery calculations, and installation.',
    content: `# MAKE DARK – AMOLED Launcher for Android

A high-performance, minimalist, battery-saving Android Home Launcher specifically engineered for **AMOLED/OLED displays** and optimized for entry-level and low-RAM devices such as the **itel Vision 1 LTE (Android 9 Pie, API 28+)**.`
  }
];
