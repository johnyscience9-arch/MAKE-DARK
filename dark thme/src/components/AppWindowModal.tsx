import React from 'react';
import { X, ArrowLeft, ExternalLink, ShieldAlert, Cpu } from 'lucide-react';
import { AppItem, IconPackId } from '../types/launcher';
import { AppIcon } from './AppIcon';

interface AppWindowModalProps {
  app: AppItem;
  iconPack: IconPackId;
  onClose: () => void;
}

export const AppWindowModal: React.FC<AppWindowModalProps> = ({
  app,
  iconPack,
  onClose
}) => {
  return (
    <div className="absolute inset-0 z-40 bg-[#000000] text-white flex flex-col animate-in fade-in zoom-in-95 duration-150">
      {/* App Titlebar */}
      <div className="h-12 bg-[#121212] border-b border-[#222222] px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1A1A1A] transition-colors cursor-pointer"
            title="Press Back to return to MAKE DARK Launcher"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <AppIcon iconName={app.iconName} label={app.name} iconPack={iconPack} size="sm" />
          <div>
            <h3 className="text-xs font-semibold text-white truncate max-w-[150px]">{app.name}</h3>
            <p className="text-[9px] text-zinc-500 font-mono truncate max-w-[150px]">{app.packageName}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-xs px-2.5 py-1 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-[#448AFF] font-mono cursor-pointer"
        >
          HOME
        </button>
      </div>

      {/* Simulated App Screen Body */}
      <div className="flex-1 p-5 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#121212] border border-[#262626] flex items-center justify-center shadow-lg">
          <AppIcon iconName={app.iconName} label={app.name} iconPack={iconPack} size="lg" />
        </div>

        <div className="max-w-xs">
          <h2 className="text-lg font-bold text-white mb-1">{app.name} Launched</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            On the itel Vision 1 LTE, MAKE DARK invokes <code className="text-[#448AFF] font-mono text-[11px]">Intent.ACTION_MAIN</code> with <code className="text-[#448AFF] font-mono text-[11px]">FLAG_ACTIVITY_NEW_TASK</code> to launch this package with zero memory leaks.
          </p>
        </div>

        {/* Memory telemetry box */}
        <div className="w-full max-w-xs p-3 rounded-2xl bg-[#121212] border border-[#222222] text-left text-xs font-mono space-y-1 text-zinc-400">
          <div className="flex justify-between">
            <span>Package:</span>
            <span className="text-white text-[11px] truncate max-w-[140px]">{app.packageName}</span>
          </div>
          <div className="flex justify-between">
            <span>Category:</span>
            <span className="text-[#448AFF] uppercase">{app.category}</span>
          </div>
          <div className="flex justify-between">
            <span>RAM Allocated:</span>
            <span className="text-emerald-400 font-semibold">14.2 MB (Low Overhead)</span>
          </div>
          <div className="flex justify-between">
            <span>Display Engine:</span>
            <span className="text-zinc-300">Pure AMOLED (#000000)</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="py-2 px-6 rounded-xl bg-[#448AFF] hover:bg-[#2979FF] text-black font-semibold text-xs transition-colors cursor-pointer shadow-lg"
        >
          Return to MAKE DARK Launcher
        </button>
      </div>
    </div>
  );
};
