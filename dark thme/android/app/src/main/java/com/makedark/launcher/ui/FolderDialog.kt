package com.makedark.launcher.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.makedark.launcher.LauncherViewModel
import com.makedark.launcher.data.AppInfo
import com.makedark.launcher.data.FolderModel
import com.makedark.launcher.ui.theme.*

@Composable
fun FolderDialog(
    folder: FolderModel,
    viewModel: LauncherViewModel,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current
    val installedApps by viewModel.installedApps.collectAsState()
    var showAddAppsSheet by remember { mutableStateOf(false) }

    val folderApps = remember(installedApps, folder.packageNames) {
        installedApps.filter { folder.packageNames.contains(it.packageName) }
    }

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
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = folder.name,
                        color = TextPrimary,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Row {
                        IconButton(
                            onClick = {
                                viewModel.deleteFolder(folder.id)
                                onDismiss()
                            },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = "Delete Folder",
                                tint = DangerRed,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        IconButton(
                            onClick = onDismiss,
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Close",
                                tint = TextSecondary,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Folder Apps Grid
                if (folderApps.isEmpty()) {
                    Text(
                        text = "This folder is empty. Tap '+' to add apps.",
                        color = TextSecondary,
                        fontSize = 13.sp,
                        modifier = Modifier.padding(vertical = 16.dp)
                    )
                } else {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        folderApps.take(4).forEach { app ->
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier
                                    .width(60.dp)
                                    .clickable {
                                        viewModel.launchApp(context, app)
                                        onDismiss()
                                    }
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(46.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(SecondaryBackground)
                                        .border(1.dp, CardBorder, RoundedCornerShape(12.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = app.label.take(1).uppercase(),
                                        color = SubtleBlueAccent,
                                        fontSize = 16.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = app.label,
                                    color = TextPrimary,
                                    fontSize = 10.sp,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Add apps button
                Button(
                    onClick = { showAddAppsSheet = true },
                    colors = ButtonDefaults.buttonColors(containerColor = SecondaryBackground),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Add Apps",
                        tint = SubtleBlueAccent,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Add App to Folder", color = TextPrimary, fontSize = 13.sp)
                }
            }
        }
    }

    if (showAddAppsSheet) {
        val nonFolderApps = installedApps.filter { !folder.packageNames.contains(it.packageName) }
        Dialog(onDismissRequest = { showAddAppsSheet = false }) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 400.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(DarkCharcoal)
                    .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Text(
                        text = "Select App to Add",
                        color = TextPrimary,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    LazyRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(nonFolderApps) { app ->
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier
                                    .width(60.dp)
                                    .clickable {
                                        viewModel.addAppToFolder(folder.id, app.packageName)
                                        showAddAppsSheet = false
                                    }
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(44.dp)
                                        .clip(CircleShape)
                                        .background(SecondaryBackground),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = app.label.take(1).uppercase(),
                                        color = SubtleBlueAccent,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = app.label,
                                    color = TextPrimary,
                                    fontSize = 10.sp,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
