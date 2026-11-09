import React from 'react';
import {
  X,
  Home,
  RotateCcw,
  Palette,
  LayoutGrid,
  Clock,
  Cpu,
  Check,
  ShieldCheck,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { IconPackId, WallpaperOption } from '../types/launcher';
import { WALLPAPER_OPTIONS } from '../data/mockApps';

interface SettingsModalProps {
  currentWallpaper: string;
  iconPack: IconPackId;
  gridColumns: number;
  is24Hour: boolean;
  lowRamMode: boolean;
  onClose: () => void;
  onSelectWallpaper: (wpId: string) => void;
  onSelectIconPack: (pack: IconPackId) => void;
  onSetGridColumns: (cols: number) => void;
  onToggle24Hour: () => void;
  onToggleLowRam: () => void;
  onTriggerDefaultLauncherModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentWallpaper,
  iconPack,
  gridColumns,
  is24Hour,
  lowRamMode,
  onClose,
  onSelectWallpaper,
  onSelectIconPack,
  onSetGridColumns,
  onToggle24Hour,
  onToggleLowRam,
  onTriggerDefaultLauncherModal
}) => {
  const [showRestoreGuide, setShowRestoreGuide] = React.useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#121212] border border-[#262626] rounded-3xl p-5 shadow-2xl text-white max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[#448AFF]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Launcher Settings</h2>
              <p className="text-[10px] text-zinc-500 font-mono">MAKE DARK v1.0.0 · itel Vision 1 LTE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Default Launcher & Android Integration */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#1A1A1A] border border-[#2a2a2a]">
          <div className="flex items-center gap-2 mb-1.5">
            <Home className="w-4 h-4 text-[#448AFF]" />
            <span className="text-xs font-semibold text-white">Android HOME Integration</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
            Register MAKE DARK as your primary home app so tapping the hardware Home button returns here.
          </p>

          <button
            onClick={onTriggerDefaultLauncherModal}
            className="w-full py-2 px-3 rounded-xl bg-[#448AFF] hover:bg-[#2979FF] text-black text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <span>Set as Default Home Launcher</span>
          </button>

          <button
            onClick={() => setShowRestoreGuide(!showRestoreGuide)}
            className="w-full mt-2 text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center justify-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showRestoreGuide ? 'Hide restore instructions' : 'How to restore previous launcher?'}</span>
          </button>

          {showRestoreGuide && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-[#121212] border border-[#282828] text-[11px] text-zinc-300 space-y-1.5 font-sans leading-relaxed">
              <div className="font-semibold text-white flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-[#448AFF]" />
                <span>Revert to Stock itel Launcher:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-zinc-400">
                <li>Open Android <strong>Settings</strong> &gt; <strong>Apps &amp; notifications</strong>.</li>
                <li>Tap <strong>Default apps</strong> &gt; <strong>Home app</strong>.</li>
                <li>Select <strong>itel OS Launcher</strong> (or previous home app).</li>
              </ol>
              <p className="text-[10px] text-zinc-500 pt-1">
                * Zero root access required. MAKE DARK does not alter system partitions.
              </p>
            </div>
          )}
        </div>

        {/* Section 2: AMOLED Wallpapers */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <Palette className="w-3.5 h-3.5 text-[#448AFF]" />
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">AMOLED Wallpapers</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {WALLPAPER_OPTIONS.map((wp) => {
              const isSelected = currentWallpaper === wp.id;
              return (
                <button
                  key={wp.id}
                  onClick={() => onSelectWallpaper(wp.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A1A] border-[#448AFF] shadow-[0_0_12px_rgba(68,138,255,0.15)]'
                      : 'bg-[#121212] border-[#242424] hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white truncate">{wp.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#448AFF] shrink-0" />}
                  </div>
                  <div className="text-[10px] text-zinc-500 line-clamp-2 leading-tight">
                    {wp.description}
                  </div>
                  <div className="mt-1.5 text-[9px] font-mono text-[#448AFF]">
                    {wp.powerConsumption}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Icon Packs */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#448AFF]" />
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Dark Icon Pack</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'amoled_blue', name: 'AMOLED Minimal Blue', accent: '#448AFF' },
              { id: 'monochrome', name: 'OLED Monochrome', accent: '#FFFFFF' },
              { id: 'stealth', name: 'Stealth Matte Slate', accent: '#A1A1AA' },
              { id: 'cyber_neon', name: 'Cyber Neon Cyan', accent: '#22d3ee' }
            ].map((pack) => {
              const isSelected = iconPack === pack.id;
              return (
                <button
                  key={pack.id}
                  onClick={() => onSelectIconPack(pack.id as IconPackId)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A1A] border-[#448AFF]'
                      : 'bg-[#121212] border-[#242424] hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-black/40"
                      style={{ backgroundColor: pack.accent }}
                    />
                    <span className="text-xs font-medium text-zinc-200">{pack.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#448AFF]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Grid and Clock */}
        <div className="mt-4 p-3 rounded-2xl bg-[#161616] border border-[#262626] space-y-3">
          {/* Grid columns */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-zinc-400" />
              <div>
                <div className="text-xs font-medium text-white">Drawer Grid Columns</div>
                <div className="text-[10px] text-zinc-500">4 or 5 applications per horizontal row</div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-[#1F1F1F] p-1 rounded-lg">
              <button
                onClick={() => onSetGridColumns(4)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono ${
                  gridColumns === 4 ? 'bg-[#448AFF] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                4x
              </button>
              <button
                onClick={() => onSetGridColumns(5)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono ${
                  gridColumns === 5 ? 'bg-[#448AFF] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                5x
              </button>
            </div>
          </div>

          <div className="h-px bg-[#222222]" />

          {/* Clock format */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <div>
                <div className="text-xs font-medium text-white">Clock Format</div>
                <div className="text-[10px] text-zinc-500">{is24Hour ? '24-Hour (14:30)' : '12-Hour (02:30 PM)'}</div>
              </div>
            </div>
            <button
              onClick={onToggle24Hour}
              className="px-3 py-1 rounded-lg bg-[#1F1F1F] text-xs font-mono text-[#448AFF] hover:bg-[#282828] cursor-pointer"
            >
              {is24Hour ? '24H' : '12H'}
            </button>
          </div>

          <div className="h-px bg-[#222222]" />

          {/* Low RAM Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#448AFF]" />
              <div>
                <div className="text-xs font-medium text-white">Low RAM Mode (itel Vision 1 LTE)</div>
                <div className="text-[10px] text-zinc-500">Prevents heavy memory allocations on 2GB RAM</div>
              </div>
            </div>
            <button
              onClick={onToggleLowRam}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                lowRamMode ? 'bg-[#448AFF]' : 'bg-[#2b2b2b]'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-transform ${
                  lowRamMode ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Device specs banner */}
        <div className="mt-4 text-center text-[10px] text-zinc-600 font-mono">
          Target: itel Vision 1 LTE · SC9863A Octa-Core · Android 9 (API 28+)
        </div>
      </div>
    </div>
  );
};
