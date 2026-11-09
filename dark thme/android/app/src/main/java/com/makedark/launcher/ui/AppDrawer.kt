package com.makedark.launcher.ui

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
            // Top Search Bar
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

                // Search Input Box
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
                                text = "Search ${installedApps.size} apps...",
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

            // Category Filter Segmented Tabs
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

            // Apps Grid
            if (filteredApps.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No apps found matching \"$searchQuery\"",
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
}
