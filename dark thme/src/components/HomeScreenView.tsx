import React from 'react';
import { ChevronUp, Settings, FolderPlus, Folder, BatteryCharging, Battery, Sparkles } from 'lucide-react';
import { AppItem, FolderItem, IconPackId } from '../types/launcher';
import { AppIcon } from './AppIcon';

interface HomeScreenViewProps {
  favoriteApps: AppItem[];
  folders: FolderItem[];
  apps: AppItem[];
  iconPack: IconPackId;
  is24Hour: boolean;
  batteryPercent: number;
  isCharging: boolean;
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  onOpenFolder: (folder: FolderItem) => void;
  onCreateFolderPrompt: () => void;
  onLaunchApp: (app: AppItem) => void;
  onAppContextMenu: (e: React.MouseEvent, app: AppItem) => void;
}

export const HomeScreenView: React.FC<HomeScreenViewProps> = ({
  favoriteApps,
  folders,
  apps,
  iconPack,
  is24Hour,
  batteryPercent,
  isCharging,
  onOpenDrawer,
  onOpenSettings,
  onOpenFolder,
  onCreateFolderPrompt,
  onLaunchApp,
  onAppContextMenu
}) => {
  const [timeStr, setTimeStr] = React.useState('');
  const [dateStr, setDateStr] = React.useState('');

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

      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      setDateStr(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [is24Hour]);

  return (
    <div className="flex-1 flex flex-col justify-between px-4 pb-4 select-none relative z-10 overflow-hidden">
      {/* Top Quick Status & Settings Action */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 bg-[#121212]/90 border border-[#222222] px-3 py-1 rounded-full text-xs text-zinc-400">
          {isCharging ? (
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Battery className="w-3.5 h-3.5 text-[#448AFF]" />
          )}
          <span className="font-mono text-zinc-200">{batteryPercent}%</span>
          <span className="text-zinc-600">·</span>
          <span className="text-[11px] text-[#448AFF] font-medium">AMOLED 0% Drain</span>
        </div>

        <button
          onClick={onOpenSettings}
          title="Launcher Settings"
          className="w-8 h-8 rounded-full bg-[#121212] border border-[#222222] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#448AFF] transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Main Digital Clock Widget */}
      <div className="flex flex-col items-center justify-center text-center my-auto py-6">
        <div className="font-light tracking-tight text-white leading-none text-6xl md:text-7xl font-sans drop-shadow-sm select-none">
          {timeStr}
        </div>
        <div className="mt-3 text-xs md:text-sm font-medium tracking-[0.2em] text-zinc-400 uppercase">
          {dateStr}
        </div>

        {/* Minimalist Micro Info Strip */}
        <div className="mt-3 inline-flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
          <span>itel Vision 1 LTE</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#448AFF]">Pure Black Active</span>
        </div>
      </div>

      {/* Folders Row */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">Custom Folders</span>
          <button
            onClick={onCreateFolderPrompt}
            className="flex items-center gap-1 text-[11px] text-[#448AFF] hover:underline cursor-pointer"
          >
            <FolderPlus className="w-3 h-3" />
            <span>New Folder</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {folders.map((folder) => {
            const folderAppCount = folder.appIds.length;
            return (
              <button
                key={folder.id}
                onClick={() => onOpenFolder(folder)}
                className="flex flex-col items-center p-2 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#448AFF]/60 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-[#448AFF] group-hover:scale-105 transition-transform">
                  <Folder className="w-5 h-5 fill-[#448AFF]/20 text-[#448AFF]" />
                </div>
                <span className="mt-1.5 text-xs font-medium text-zinc-200 truncate max-w-full">
                  {folder.name}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {folderAppCount} {folderAppCount === 1 ? 'app' : 'apps'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Swipe up affordance */}
      <button
        onClick={onOpenDrawer}
        className="flex flex-col items-center justify-center py-1 text-zinc-500 hover:text-white transition-colors cursor-pointer group mb-1"
      >
        <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform text-[#448AFF]" />
        <span className="text-[10px] tracking-[0.25em] font-medium text-zinc-400 uppercase">Swipe for Apps</span>
      </button>

      {/* Favorite Apps Dock */}
      <div className="w-full bg-[#121212]/95 border border-[#262626] rounded-3xl p-2.5 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-around">
          {favoriteApps.slice(0, 5).map((app) => (
            <div
              key={app.id}
              onClick={() => onLaunchApp(app)}
              onContextMenu={(e) => onAppContextMenu(e, app)}
              className="flex flex-col items-center cursor-pointer group relative"
            >
              <AppIcon iconName={app.iconName} label={app.name} iconPack={iconPack} size="md" />
              <span className="mt-1 text-[11px] font-medium text-zinc-300 group-hover:text-white truncate max-w-[58px] text-center">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
