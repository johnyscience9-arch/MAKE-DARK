import React from 'react';
import { Smartphone, Zap, Cpu, Battery, Gauge, Terminal, CheckCircle2 } from 'lucide-react';

export const DeviceBenchmarkView: React.FC = () => {
  return (
    <div className="w-full flex-1 bg-[#0d0d0d] rounded-2xl border border-[#222222] p-6 text-white overflow-y-auto no-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-[#448AFF] font-mono uppercase tracking-wider font-semibold">
              Hardware Profile &amp; AMOLED Power Diagnostics
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">itel Vision 1 LTE Optimization Matrix</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Engineered strictly for Android 9 Pie (API 28+) on entry-level Unisoc SC9863A SoC with 2GB RAM.
          </p>
        </div>

        {/* Spec Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#121212] border border-[#242424]">
            <div className="flex items-center gap-2 text-[#448AFF] mb-2">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">SoC &amp; Processor</span>
            </div>
            <div className="text-lg font-bold text-white">Unisoc SC9863A</div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              8x ARM Cortex-A55 cores (4x 1.6GHz + 4x 1.2GHz). PowerVR GE8322 GPU.
            </p>
            <div className="mt-3 text-[10px] text-zinc-500 font-mono">
              Optimization: Render on RenderThread; background work on Dispatchers.IO.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-[#242424]">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Gauge className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">RAM &amp; Heap Cap</span>
            </div>
            <div className="text-lg font-bold text-white">2 GB LPDDR4</div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Low RAM device classification. Dalvik max heap limit set to standard 192MB.
            </p>
            <div className="mt-3 text-[10px] text-zinc-500 font-mono">
              MAKE DARK allocation: ~26 MB peak memory footprint.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-[#242424]">
            <div className="flex items-center gap-2 text-[#448AFF] mb-2">
              <Battery className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Battery &amp; Display</span>
            </div>
            <div className="text-lg font-bold text-white">4000 mAh Li-Po</div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              6.088″ HD+ Waterdrop (720 × 1560, 19.5:9 aspect ratio).
            </p>
            <div className="mt-3 text-[10px] text-zinc-500 font-mono">
              Pure black (#000000) achieves 0 mW pixel emission.
            </div>
          </div>
        </div>

        {/* AMOLED Power Consumption Comparison Chart */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-[#262626]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">OLED/AMOLED Display Power Benchmarks</h3>
              <p className="text-xs text-zinc-400">Average sub-pixel emitter power consumption during active home screen</p>
            </div>
            <span className="text-xs font-mono text-[#448AFF] font-bold bg-[#1a2538] px-2.5 py-1 rounded-md">
              -68% Power Drain
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Stock Launcher (Light Theme)</span>
                <span className="text-zinc-400 font-mono">380 mW</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1c1c1c] overflow-hidden">
                <div className="h-full bg-red-400/80 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Dark Gray Launcher (#212121)</span>
                <span className="text-zinc-400 font-mono">220 mW</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1c1c1c] overflow-hidden">
                <div className="h-full bg-amber-400/80 rounded-full" style={{ width: '58%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white font-medium">MAKE DARK – AMOLED Launcher (#000000)</span>
                <span className="text-[#448AFF] font-mono font-bold">48 mW</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1c1c1c] overflow-hidden">
                <div className="h-full bg-[#448AFF] rounded-full shadow-[0_0_10px_rgba(68,138,255,0.5)]" style={{ width: '13%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ADB Setup Commands */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-[#262626]">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-[#448AFF]" />
            <h3 className="text-sm font-semibold text-white">ADB Command Reference (itel Vision 1 LTE)</h3>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#080808] border border-[#1f1f1f] text-zinc-300">
              <span className="text-zinc-500"># 1. Install debug APK directly to itel device:</span>
              <div className="text-[#448AFF] mt-1 select-all">adb install -r android/app/build/outputs/apk/debug/app-debug.apk</div>
            </div>

            <div className="p-3 rounded-xl bg-[#080808] border border-[#1f1f1f] text-zinc-300">
              <span className="text-zinc-500"># 2. Launch MAKE DARK as Home activity:</span>
              <div className="text-[#448AFF] mt-1 select-all">adb shell am start -n com.makedark.launcher/.MainActivity</div>
            </div>

            <div className="p-3 rounded-xl bg-[#080808] border border-[#1f1f1f] text-zinc-300">
              <span className="text-zinc-500"># 3. Open Android Default Apps Chooser:</span>
              <div className="text-[#448AFF] mt-1 select-all">adb shell am start -a android.settings.HOME_SETTINGS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
