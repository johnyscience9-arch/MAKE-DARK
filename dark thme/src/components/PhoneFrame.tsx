import React from 'react';
import { Power, RotateCw, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isScreenOn: boolean;
  onTogglePower: () => void;
  onHomePress: () => void;
  onBackPress: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isScreenOn,
  onTogglePower,
  onHomePress,
  onBackPress,
  isFullscreen,
  onToggleFullscreen
}) => {
  if (isFullscreen) {
    return (
      <div className="w-full h-screen bg-black flex flex-col relative overflow-hidden">
        {/* Fullscreen AMOLED View */}
        <div className="flex-1 relative flex flex-col overflow-hidden bg-black">
          {isScreenOn ? children : (
            <div className="flex-1 bg-black flex items-center justify-center text-zinc-600 text-xs">
              <span>AMOLED Screen in Standby · Press Power to wake</span>
            </div>
          )}
        </div>

        {/* Minimal Android Nav Bar for Fullscreen */}
        <div className="h-10 bg-black border-t border-[#1a1a1a] flex items-center justify-around px-12 z-30">
          <button
            onClick={onBackPress}
            title="Android Back Button"
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-2"
          >
            <div className="w-0 h-0 border-y-6 border-y-transparent border-r-10 border-r-zinc-400" />
          </button>
          <button
            onClick={onHomePress}
            title="Android Home Button (Returns to MAKE DARK Launcher)"
            className="w-4 h-4 rounded-full border-2 border-zinc-400 hover:border-white transition-colors cursor-pointer"
          />
          <button
            onClick={() => {}}
            title="Android Recents Button"
            className="w-3.5 h-3.5 border-2 border-zinc-400 hover:border-white transition-colors cursor-pointer"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Phone Hardware Shell (itel Vision 1 LTE) */}
      <div className="relative w-[340px] sm:w-[375px] h-[720px] bg-[#111111] rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] border-4 border-[#222222]">
        {/* Physical buttons on right */}
        {/* Volume Rocker */}
        <div className="absolute -right-5 top-28 w-1.5 h-16 bg-[#2a2a2a] rounded-r-md border-y border-r border-[#3a3a3a]" />
        {/* Power Button */}
        <button
          onClick={onTogglePower}
          title="itel Vision 1 Power Button (Sleep / Wake)"
          className="absolute -right-5 top-48 w-1.5 h-10 bg-[#333333] hover:bg-[#448AFF] rounded-r-md border-y border-r border-[#444444] transition-colors cursor-pointer"
        />

        {/* Inner AMOLED Screen Housing */}
        <div className="relative w-full h-full bg-black rounded-[38px] overflow-hidden flex flex-col border border-[#1a1a1a]">
          {/* Top Bezel with Waterdrop Notch & Receiver */}
          <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-center z-40 pointer-events-none">
            {/* Earpiece speaker grill */}
            <div className="w-12 h-1 bg-[#262626] rounded-full mb-1" />
            {/* Waterdrop camera notch */}
            <div className="absolute top-0 w-16 h-4 bg-[#111111] rounded-b-xl flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#080808] border border-[#222222] relative">
                <div className="w-1 h-1 rounded-full bg-[#1e293b] absolute top-0.5 left-0.5" />
              </div>
            </div>
          </div>

          {/* Screen Content or AMOLED Off State */}
          <div className="flex-1 flex flex-col relative overflow-hidden bg-black pt-4">
            {isScreenOn ? (
              children
            ) : (
              <div
                onClick={onTogglePower}
                className="flex-1 bg-black flex flex-col items-center justify-center text-zinc-600 text-xs text-center p-6 cursor-pointer select-none"
              >
                <Power className="w-8 h-8 text-zinc-700 mb-2" />
                <p className="font-mono text-[11px] text-zinc-500">AMOLED Panel Off</p>
                <p className="text-[10px] text-zinc-700 mt-1">Tap screen or click power button to wake</p>
              </div>
            )}
          </div>

          {/* Android Navigation Bar (Bottom) */}
          <div className="h-8 bg-black border-t border-[#161616] flex items-center justify-around px-8 z-30 select-none">
            {/* Back Button */}
            <button
              onClick={onBackPress}
              title="Android Back Button"
              className="p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer active:scale-90"
            >
              <div className="w-0 h-0 border-y-5 border-y-transparent border-r-8 border-r-zinc-400" />
            </button>

            {/* Home Button (Returns to Launcher) */}
            <button
              onClick={onHomePress}
              title="Android Home Button (Returns to MAKE DARK Launcher)"
              className="w-3.5 h-3.5 rounded-full border-2 border-zinc-400 hover:border-[#448AFF] transition-colors cursor-pointer active:scale-90"
            />

            {/* Recents Button */}
            <button
              onClick={() => {}}
              title="Android Recents / Multitasking"
              className="w-3 h-3 border-2 border-zinc-400 hover:border-white transition-colors cursor-pointer active:scale-90"
            />
          </div>
        </div>

        {/* itel branding watermark at bottom chin (subtle) */}
        <div className="absolute bottom-1 left-0 right-0 text-center pointer-events-none">
          <span className="text-[8px] font-sans font-semibold tracking-widest text-zinc-700 uppercase">
            itel · Vision 1 LTE
          </span>
        </div>
      </div>
    </div>
  );
};
