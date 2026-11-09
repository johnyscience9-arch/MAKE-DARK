package com.makedark.launcher.ui

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

    // Live clock state updated every second
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
            // Top Bar: Battery & Quick Settings Trigger
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Battery Widget
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

                // Settings icon button
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

            // Center Widget: AMOLED Digital Clock & Date
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

            // Folders Container
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

            // Bottom Section: Favorites Dock & Swipe Up to Drawer
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp)
            ) {
                // Swipe Up Indicator
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

                // Dock Card (Dark Charcoal #121212)
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
            // First letter badge or cached icon
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
}
