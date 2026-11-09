package com.makedark.launcher.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.BatteryManager

/**
 * BroadcastReceiver for tracking battery percentage and charging status
 * with zero background polling overhead.
 */
class BatteryReceiver(
    private val onBatteryChanged: (percent: Int, isCharging: Boolean) -> Unit
) : BroadcastReceiver() {

    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BATTERY_CHANGED) {
            val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
            val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
            val percent = if (level != -1 && scale != -1) {
                (level * 100 / scale.toFloat()).toInt()
            } else {
                100
            }

            val status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
            val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                    status == BatteryManager.BATTERY_STATUS_FULL

            onBatteryChanged(percent, isCharging)
        }
    }
}
