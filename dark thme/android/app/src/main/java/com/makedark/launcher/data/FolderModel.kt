package com.makedark.launcher.data

/**
 * Representation of a custom user-created folder on the home screen.
 */
data class FolderModel(
    val id: String,
    val name: String,
    val packageNames: List<String> = emptyList(),
    val iconColor: Long = 0xFF448AFF
)
