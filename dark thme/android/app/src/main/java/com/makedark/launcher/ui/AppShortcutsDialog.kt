package com.makedark.launcher.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.StarBorder
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.makedark.launcher.LauncherViewModel
import com.makedark.launcher.data.AppInfo
import com.makedark.launcher.ui.theme.*

@Composable
fun AppShortcutsDialog(
    app: AppInfo,
    viewModel: LauncherViewModel,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current

    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(DarkCharcoal)
                .border(1.dp, CardBorder, RoundedCornerShape(20.dp))
                .padding(20.dp)
        ) {
            Column {
                // App header
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(SecondaryBackground),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = app.label.take(1).uppercase(),
                            color = SubtleBlueAccent,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = app.label,
                            color = TextPrimary,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = app.packageName,
                            color = TextSecondary,
                            fontSize = 11.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Action buttons
                ShortcutRow(
                    icon = Icons.Default.PlayArrow,
                    label = "Open Application",
                    onClick = {
                        viewModel.launchApp(context, app)
                        onDismiss()
                    }
                )

                ShortcutRow(
                    icon = if (app.isFavorite) Icons.Default.Star else Icons.Default.StarBorder,
                    label = if (app.isFavorite) "Remove from Favorites" else "Add to Favorites",
                    onClick = {
                        viewModel.toggleFavorite(app.packageName)
                        onDismiss()
                    }
                )

                ShortcutRow(
                    icon = Icons.Default.Info,
                    label = "App Info & Permissions",
                    onClick = {
                        viewModel.openAppInfo(context, app.packageName)
                        onDismiss()
                    }
                )

                if (!app.isSystemApp) {
                    ShortcutRow(
                        icon = Icons.Default.Delete,
                        label = "Uninstall App",
                        isDestructive = true,
                        onClick = {
                            viewModel.requestUninstall(context, app.packageName)
                            onDismiss()
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun ShortcutRow(
    icon: ImageVector,
    label: String,
    isDestructive: Boolean = false,
    onClick: () -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .clickable(onClick = onClick)
            .padding(vertical = 10.dp, horizontal = 8.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = if (isDestructive) DangerRed else SubtleBlueAccent,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = label,
            color = if (isDestructive) DangerRed else TextPrimary,
            fontSize = 14.sp
        )
    }
}
