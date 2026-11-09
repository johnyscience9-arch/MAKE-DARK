package com.makedark.launcher.ui.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val AmoledColorScheme = darkColorScheme(
    primary = SubtleBlueAccent,
    onPrimary = TextPrimary,
    background = AmoledBlack,
    onBackground = TextPrimary,
    surface = DarkCharcoal,
    onSurface = TextPrimary,
    surfaceVariant = SecondaryBackground,
    onSurfaceVariant = TextSecondary,
    outline = CardBorder
)

@Composable
fun MakeDarkLauncherTheme(
    content: @Composable () -> Unit
) {
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            window?.let {
                // Ensure true AMOLED black for status bar and navigation bar
                it.statusBarColor = AmoledBlack.toArgb()
                it.navigationBarColor = AmoledBlack.toArgb()
                val controller = WindowCompat.getInsetsController(it, view)
                controller.isAppearanceLightStatusBars = false
                controller.isAppearanceLightNavigationBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = AmoledColorScheme,
        content = content
    )
}
