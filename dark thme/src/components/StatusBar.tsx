import React from 'react';
import { Wifi, Battery, BatteryCharging, Zap } from 'lucide-react';

interface StatusBarProps {
  batteryPercent: number;
  isCharging: boolean;
  is24Hour: boolean;
  lowRamMode: boolean;
  onBatteryClick?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  batteryPercent,
  isCharging,
  is24Hour,
  lowRamMode,
  onBatteryClick
}) => {
  const [timeStr, setTimeStr] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (is24Hour) {
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        setTimeStr(`${h}:${m}`);
      } else {
        let h = now.getHours();
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        const m = String(now.getMinutes()).padStart(2, '0');
        setTimeStr(`${h}:${m} ${ampm}`);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [is24Hour]);

  return (
    <div className="w-full flex items-center justify-between px-5 pt-3 pb-1 text-xs select-none text-zinc-300 font-mono tracking-tight z-30">
      {/* Time & Carrier */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[13px] text-white tracking-normal">{timeStr}</span>
        <span className="hidden sm:inline-block text-[10px] text-zinc-500 uppercase font-sans font-medium">itel 4G</span>
      </div>

      {/* Right System Indicators */}
      <div className="flex items-center gap-2">
        {lowRamMode && (
          <span
            title="Low RAM Optimization Active (itel Vision 1 LTE 2GB RAM)"
            className="flex items-center gap-0.5 text-[10px] text-[#448AFF] font-sans font-medium"
          >
            <Zap className="w-3 h-3 fill-[#448AFF]" />
            <span className="hidden sm:inline">LOW RAM</span>
          </span>
        )}

        {/* 4G VoLTE */}
        <span className="text-[10px] font-bold tracking-tighter text-zinc-400">VoLTE</span>

        {/* WiFi */}
        <Wifi className="w-3.5 h-3.5 text-zinc-300" />

        {/* Battery widget */}
        <button
          onClick={onBatteryClick}
          title="Click to simulate charging/battery levels"
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          <span className="text-[11px] font-medium text-white">{batteryPercent}%</span>
          {isCharging ? (
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          ) : (
            <Battery
              className={`w-4 h-4 ${
                batteryPercent < 20 ? 'text-red-400' : batteryPercent < 50 ? 'text-amber-400' : 'text-zinc-300'
              }`}
            />
          )}
        </button>
      </div>
    </div>
  );
};
