package com.makedark.launcher.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.makedark.launcher.LauncherViewModel
import com.makedark.launcher.ui.theme.*

@Composable
fun SettingsScreen(
    viewModel: LauncherViewModel,
    onCloseSettings: () -> Unit
) {
    val context = LocalContext.current
    val gridColumns by viewModel.gridColumns.collectAsState()
    val is24Hour by viewModel.is24HourClock.collectAsState()
    val lowRamMode by viewModel.lowRamMode.collectAsState()
    val iconPack by viewModel.iconPack.collectAsState()
    val wallpaperMode by viewModel.wallpaperMode.collectAsState()

    var showRestoreHelp by remember { mutableStateOf(false) }

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
                .verticalScroll(rememberScrollState())
        ) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp, bottom = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onCloseSettings,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(DarkCharcoal)
                ) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        tint = TextPrimary,
                        modifier = Modifier.size(18.dp)
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = "Launcher Settings",
                    color = TextPrimary,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }

            // Default Launcher Card
            Card(
                colors = CardDefaults.cardColors(containerColor = DarkCharcoal),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = "Home",
                            tint = SubtleBlueAccent,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "Default Launcher",
                            color = TextPrimary,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Set MAKE DARK as your default home app so pressing the home button returns here.",
                        color = TextSecondary,
                        fontSize = 13.sp,
                        lineHeight = 18.sp
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = { viewModel.openDefaultLauncherSettings(context) },
                        colors = ButtonDefaults.buttonColors(containerColor = SubtleBlueAccent),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Select as Default Launcher", color = TextPrimary, fontWeight = FontWeight.SemiBold)
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    TextButton(
                        onClick = { showRestoreHelp = !showRestoreHelp },
                        modifier = Modifier.align(Alignment.CenterHorizontally)
                    ) {
                        Text(
                            text = if (showRestoreHelp) "Hide restore instructions" else "How to restore previous launcher?",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )
                    }
                    if (showRestoreHelp) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(SecondaryBackground)
                                .padding(10.dp)
                        ) {
                            Text(
                                text = "To switch back to your stock launcher on itel Vision 1 LTE:\n1. Open Android Settings > Apps & notifications.\n2. Tap Default apps > Home app.\n3. Choose your previous launcher (e.g. itel OS Launcher).",
                                color = TextSecondary,
                                fontSize = 12.sp,
                                lineHeight = 16.sp
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // AMOLED Theme & Wallpapers Section
            SettingsSectionTitle("DISPLAY & AMOLED")
            SettingsCard {
                SettingsOptionRow(
                    title = "Pure Black AMOLED Theme",
                    subtitle = "Always active (#000000) for 0% sub-pixel power consumption",
                    trailing = {
                        Text("ACTIVE", color = SubtleBlueAccent, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                )
                Divider(color = CardBorder, thickness = 0.5.dp)
                SettingsOptionRow(
                    title = "Wallpaper Mode",
                    subtitle = if (wallpaperMode == "pure_black") "Pure Black (OLED Saver)" else "Deep Void",
                    onClick = {
                        val next = if (wallpaperMode == "pure_black") "deep_void" else "pure_black"
                        viewModel.setWallpaperMode(next)
                    }
                )
                Divider(color = CardBorder, thickness = 0.5.dp)
                SettingsOptionRow(
                    title = "Clock Format",
                    subtitle = if (is24Hour) "24-Hour (14:30)" else "12-Hour (02:30 PM)",
                    onClick = { viewModel.set24HourClock(!is24Hour) }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // App Drawer & Grid
            SettingsSectionTitle("APP DRAWER & GRID")
            SettingsCard {
                SettingsOptionRow(
                    title = "Grid Columns",
                    subtitle = "$gridColumns Apps per row",
                    onClick = {
                        val nextCols = if (gridColumns == 4) 5 else 4
                        viewModel.setGridColumns(nextCols)
                    }
                )
                Divider(color = CardBorder, thickness = 0.5.dp)
                SettingsOptionRow(
                    title = "Dark Icon Pack",
                    subtitle = when (iconPack) {
                        "amoled_blue" -> "AMOLED Minimal Blue"
                        "monochrome" -> "Monochrome Pitch Black"
                        else -> "Stealth Slate"
                    },
                    onClick = {
                        val next = when (iconPack) {
                            "amoled_blue" -> "monochrome"
                            "monochrome" -> "stealth"
                            else -> "amoled_blue"
                        }
                        viewModel.setIconPack(next)
                    }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // itel Vision 1 LTE Optimization Section
            SettingsSectionTitle("DEVICE OPTIMIZATIONS (itel Vision 1 LTE)")
            SettingsCard {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp, horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Low RAM Optimization", color = TextPrimary, fontSize = 14.sp)
                        Text(
                            "Disables heavy blur effects and optimizes Dalvik bitmap allocations for 2GB RAM devices.",
                            color = TextSecondary,
                            fontSize = 11.sp,
                            lineHeight = 15.sp
                        )
                    }
                    Switch(
                        checked = lowRamMode,
                        onCheckedChange = { viewModel.setLowRamMode(it) },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = AmoledBlack,
                            checkedTrackColor = SubtleBlueAccent,
                            uncheckedThumbColor = TextMuted,
                            uncheckedTrackColor = DarkCharcoal
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Device Specs Note
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "MAKE DARK v1.0.0",
                    color = TextPrimary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "Target: itel Vision 1 LTE · Android 9 (API 28+)",
                    color = TextSecondary,
                    fontSize = 11.sp
                )
                Text(
                    text = "No root · No telemetry · Pure AMOLED performance",
                    color = TextMuted,
                    fontSize = 10.sp
                )
            }
        }
    }
}

@Composable
fun SettingsSectionTitle(title: String) {
    Text(
        text = title,
        color = TextSecondary,
        fontSize = 11.sp,
        fontWeight = FontWeight.SemiBold,
        letterSpacing = 1.sp,
        modifier = Modifier.padding(start = 4.dp, bottom = 6.dp)
    )
}

@Composable
fun SettingsCard(content: @Composable ColumnScope.() -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = DarkCharcoal),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, CardBorder, RoundedCornerShape(16.dp)),
        content = content
    )
}

@Composable
fun SettingsOptionRow(
    title: String,
    subtitle: String,
    onClick: (() -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .let { if (onClick != null) it.clickable(onClick = onClick) else it }
            .padding(vertical = 12.dp, horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, color = TextPrimary, fontSize = 14.sp)
            Spacer(modifier = Modifier.height(2.dp))
            Text(subtitle, color = TextSecondary, fontSize = 12.sp)
        }
        if (trailing != null) {
            trailing()
        } else if (onClick != null) {
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                tint = TextSecondary,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}
