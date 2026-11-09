package com.makedark.launcher

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
}
