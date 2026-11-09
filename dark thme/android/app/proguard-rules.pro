# Proguard rules for MAKE DARK – AMOLED Launcher
# Optimized for low memory footprints on itel Vision 1 LTE

-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.compose.runtime.Composable *;
}

# Preserve AppModel and preference serialization
-keep class com.makedark.launcher.data.** { *; }

# Coil image loading rules
-dontwarn io.coilkt.**

# Optimize coroutines
-dontwarn kotlinx.coroutines.**
