import React from 'react';
import {
  Smartphone,
  Code2,
  Cpu,
  Download,
  Settings,
  Sparkles,
  Zap,
  Check,
  RefreshCw,
  RotateCcw,
  Moon,
  Home
} from 'lucide-react';
import JSZip from 'jszip';
import { AppItem, FolderItem, IconPackId, ActiveTab } from './types/launcher';
import { INITIAL_APPS, INITIAL_FOLDERS, WALLPAPER_OPTIONS } from './data/mockApps';
import { ANDROID_PROJECT_FILES } from './data/androidProjectFiles';
import { PhoneFrame } from './components/PhoneFrame';
import { StatusBar } from './components/StatusBar';
import { HomeScreenView } from './components/HomeScreenView';
import { AppDrawerView } from './components/AppDrawerView';
import { FolderModal } from './components/FolderModal';
import { AppShortcutsModal } from './components/AppShortcutsModal';
import { SettingsModal } from './components/SettingsModal';
import { AppWindowModal } from './components/AppWindowModal';
import { AndroidProjectExplorer } from './components/AndroidProjectExplorer';
import { DeviceBenchmarkView } from './components/DeviceBenchmarkView';

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('simulator');

  // Phone Simulator States
  const [isScreenOn, setIsScreenOn] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [currentScreen, setCurrentScreen] = React.useState<'home' | 'drawer'>('home');

  // Launcher Customization States
  const [wallpaper, setWallpaper] = React.useState('pure_black');
  const [iconPack, setIconPack] = React.useState<IconPackId>('amoled_blue');
  const [gridColumns, setGridColumns] = React.useState(4);
  const [is24Hour, setIs24Hour] = React.useState(true);
  const [lowRamMode, setLowRamMode] = React.useState(true); // enabled by default for itel Vision 1 LTE

  // Battery Telemetry
  const [batteryPercent, setBatteryPercent] = React.useState(86);
  const [isCharging, setIsCharging] = React.useState(false);

  // App & Folder State
  const [apps, setApps] = React.useState<AppItem[]>(INITIAL_APPS);
  const [folders, setFolders] = React.useState<FolderItem[]>(INITIAL_FOLDERS);

  // Modals
  const [activeFolder, setActiveFolder] = React.useState<FolderItem | null>(null);
  const [activeAppShortcut, setActiveAppShortcut] = React.useState<AppItem | null>(null);
  const [activeLaunchedApp, setActiveLaunchedApp] = React.useState<AppItem | null>(null);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState('');
  const [showDefaultLauncherPrompt, setShowDefaultLauncherPrompt] = React.useState(false);
  const [isDefaultLauncher, setIsDefaultLauncher] = React.useState(false);

  // Fast Toast Message
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers for Favorite Apps
  const toggleFavorite = (appId: string) => {
    setApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, isFavorite: !app.isFavorite } : app))
    );
    showToast('Updated favorites');
  };

  // Handlers for Folders
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newF: FolderItem = {
      id: `folder_${Date.now()}`,
      name: newFolderName.trim(),
      appIds: [],
      color: '#448AFF'
    };
    setFolders((prev) => [...prev, newF]);
    setNewFolderName('');
    setShowCreateFolderModal(false);
    showToast(`Created folder "${newF.name}"`);
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name: newName } : f))
    );
    if (activeFolder && activeFolder.id === folderId) {
      setActiveFolder((prev) => (prev ? { ...prev, name: newName } : null));
    }
    showToast('Folder renamed');
  };

  const handleAddAppToFolder = (folderId: string, appId: string) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId && !f.appIds.includes(appId)) {
          return { ...f, appIds: [...f.appIds, appId] };
        }
        return f;
      })
    );
    if (activeFolder && activeFolder.id === folderId) {
      setActiveFolder((prev) =>
        prev && !prev.appIds.includes(appId) ? { ...prev, appIds: [...prev.appIds, appId] } : prev
      );
    }
    showToast('App added to folder');
  };

  const handleRemoveAppFromFolder = (folderId: string, appId: string) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          return { ...f, appIds: f.appIds.filter((id) => id !== appId) };
        }
        return f;
      })
    );
    if (activeFolder && activeFolder.id === folderId) {
      setActiveFolder((prev) =>
        prev ? { ...prev, appIds: prev.appIds.filter((id) => id !== appId) } : null
      );
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    setActiveFolder(null);
    showToast('Folder deleted');
  };

  const handleUninstallApp = (app: AppItem) => {
    if (confirm(`Uninstall ${app.name}?`)) {
      setApps((prev) => prev.filter((a) => a.id !== app.id));
      setFolders((prev) =>
        prev.map((f) => ({ ...f, appIds: f.appIds.filter((id) => id !== app.id) }))
      );
      showToast(`Uninstalled ${app.name}`);
    }
  };

  // Hardware button events
  const handleHomePress = () => {
    setActiveLaunchedApp(null);
    setActiveFolder(null);
    setActiveAppShortcut(null);
    setCurrentScreen('home');
  };

  const handleBackPress = () => {
    if (activeLaunchedApp) {
      setActiveLaunchedApp(null);
      return;
    }
    if (activeFolder) {
      setActiveFolder(null);
      return;
    }
    if (activeAppShortcut) {
      setActiveAppShortcut(null);
      return;
    }
    if (currentScreen === 'drawer') {
      setCurrentScreen('home');
      return;
    }
  };

  const selectedWallpaperObj =
    WALLPAPER_OPTIONS.find((w) => w.id === wallpaper) || WALLPAPER_OPTIONS[0];

  // Quick ZIP Download
  const downloadAllZip = async () => {
    const zip = new JSZip();
    ANDROID_PROJECT_FILES.forEach((f) => {
      zip.file(f.path, f.content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'make-dark-amoled-launcher.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded full Android Studio project (.zip)');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#448AFF] selection:text-black">
      {/* 1. Universal Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Nav Links) — Zone 3 (CTA) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-md sticky top-0 z-50">
        {/* Zone 1: Single Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#121212] border border-[#2a2a2a] flex items-center justify-center text-[#448AFF] shadow-sm">
            <Moon className="w-4 h-4 fill-[#448AFF]" />
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            MAKE DARK
          </span>
          <span className="hidden md:inline text-[11px] font-mono text-zinc-500 bg-[#161616] px-2 py-0.5 rounded border border-[#242424]">
            itel Vision 1 LTE
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-[#1e1e1e] text-white border border-[#333333]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Live Simulator
          </button>
          <button
            onClick={() => setActiveTab('project_code')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'project_code'
                ? 'bg-[#1e1e1e] text-white border border-[#333333]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Android Studio Project
          </button>
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'benchmarks'
                ? 'bg-[#1e1e1e] text-white border border-[#333333]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Specs &amp; Power
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={downloadAllZip}
            className="px-3.5 py-1.5 text-xs font-semibold text-black bg-[#448AFF] hover:bg-[#2979FF] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Android Project (.zip)</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* TAB 1: Live Phone Simulator */}
        {activeTab === 'simulator' && (
          <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 py-2">
            {/* Phone Display Shell */}
            <div className="flex flex-col items-center">
              <PhoneFrame
                isScreenOn={isScreenOn}
                onTogglePower={() => setIsScreenOn(!isScreenOn)}
                onHomePress={handleHomePress}
                onBackPress={handleBackPress}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              >
                {/* Phone Inner AMOLED Screen (Styled by current wallpaper) */}
                <div
                  className="flex-1 flex flex-col relative overflow-hidden"
                  style={{
                    background:
                      wallpaper === 'pure_black'
                        ? '#000000'
                        : selectedWallpaperObj.bgStyle
                  }}
                >
                  {/* Status Bar */}
                  <StatusBar
                    batteryPercent={batteryPercent}
                    isCharging={isCharging}
                    is24Hour={is24Hour}
                    lowRamMode={lowRamMode}
                    onBatteryClick={() => setIsCharging(!isCharging)}
                  />

                  {/* Active Screen Transition */}
                  {currentScreen === 'home' ? (
                    <HomeScreenView
                      favoriteApps={apps.filter((a) => a.isFavorite)}
                      folders={folders}
                      apps={apps}
                      iconPack={iconPack}
                      is24Hour={is24Hour}
                      batteryPercent={batteryPercent}
                      isCharging={isCharging}
                      onOpenDrawer={() => setCurrentScreen('drawer')}
                      onOpenSettings={() => setShowSettingsModal(true)}
                      onOpenFolder={(f) => setActiveFolder(f)}
                      onCreateFolderPrompt={() => setShowCreateFolderModal(true)}
                      onLaunchApp={(app) => setActiveLaunchedApp(app)}
                      onAppContextMenu={(e, app) => {
                        e.preventDefault();
                        setActiveAppShortcut(app);
                      }}
                    />
                  ) : (
                    <AppDrawerView
                      apps={apps}
                      iconPack={iconPack}
                      gridColumns={gridColumns}
                      onClose={() => setCurrentScreen('home')}
                      onLaunchApp={(app) => setActiveLaunchedApp(app)}
                      onAppContextMenu={(e, app) => {
                        e.preventDefault();
                        setActiveAppShortcut(app);
                      }}
                    />
                  )}

                  {/* App Launched Overlay */}
                  {activeLaunchedApp && (
                    <AppWindowModal
                      app={activeLaunchedApp}
                      iconPack={iconPack}
                      onClose={() => setActiveLaunchedApp(null)}
                    />
                  )}
                </div>
              </PhoneFrame>

              {/* Hardware hint underneath */}
              <div className="mt-3 text-center text-xs text-zinc-500 font-mono">
                Power button on right edge sleeps/wakes AMOLED panel
              </div>
            </div>

            {/* Right Side Control Center & Architecture Features */}
            <div className="w-full lg:max-w-md flex flex-col gap-4">
              {/* Quick Settings & Preset Strip */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#222222]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#448AFF]" />
                    <h3 className="text-sm font-semibold text-white">Launcher Quick Controls</h3>
                  </div>
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="text-xs text-[#448AFF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>All Settings</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Wallpaper Quick Switch */}
                  <div className="p-2.5 rounded-xl bg-[#1A1A1A] border border-[#262626]">
                    <div className="text-[11px] text-zinc-400 mb-1">AMOLED Wallpaper</div>
                    <select
                      value={wallpaper}
                      onChange={(e) => setWallpaper(e.target.value)}
                      className="w-full bg-[#121212] border border-[#333333] rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                    >
                      {WALLPAPER_OPTIONS.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Icon Pack Quick Switch */}
                  <div className="p-2.5 rounded-xl bg-[#1A1A1A] border border-[#262626]">
                    <div className="text-[11px] text-zinc-400 mb-1">Dark Icon Pack</div>
                    <select
                      value={iconPack}
                      onChange={(e) => setIconPack(e.target.value as IconPackId)}
                      className="w-full bg-[#121212] border border-[#333333] rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                    >
                      <option value="amoled_blue">AMOLED Blue</option>
                      <option value="monochrome">Monochrome</option>
                      <option value="stealth">Stealth Slate</option>
                      <option value="cyber_neon">Cyber Neon</option>
                    </select>
                  </div>

                  {/* Clock Format */}
                  <button
                    onClick={() => setIs24Hour(!is24Hour)}
                    className="p-2.5 rounded-xl bg-[#1A1A1A] border border-[#262626] hover:border-zinc-500 text-left cursor-pointer transition-colors"
                  >
                    <div className="text-[11px] text-zinc-400">Clock Format</div>
                    <div className="text-white font-medium mt-0.5">{is24Hour ? '24-Hour (14:30)' : '12-Hour (02:30 PM)'}</div>
                  </button>

                  {/* Low RAM Mode Toggle */}
                  <button
                    onClick={() => {
                      setLowRamMode(!lowRamMode);
                      showToast(lowRamMode ? 'Disabled Low RAM mode' : 'Enabled itel 2GB RAM optimization');
                    }}
                    className="p-2.5 rounded-xl bg-[#1A1A1A] border border-[#262626] hover:border-[#448AFF] text-left cursor-pointer transition-colors"
                  >
                    <div className="text-[11px] text-zinc-400">Low RAM Mode</div>
                    <div className={`font-medium mt-0.5 ${lowRamMode ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {lowRamMode ? 'Active (2GB RAM)' : 'Off (Standard)'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Default Home Launcher Demonstration Box */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#222222]">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-[#448AFF]" />
                  <h3 className="text-sm font-semibold text-white">Default Launcher Flow</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  In Android 9 Pie, users designate their default home screen via the system Home intent. Test the simulated Android home app selector:
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDefaultLauncherPrompt(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-xs font-medium text-white transition-colors cursor-pointer text-center"
                  >
                    Test "Set as Default" Prompt
                  </button>

                  {isDefaultLauncher && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1.5 rounded-xl">
                      <Check className="w-3.5 h-3.5" />
                      <span>Default Set</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Hardware Specifications Callout */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#222222] space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Target Device:</span>
                  <span className="text-white font-medium">itel Vision 1 LTE (L6005)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Compatibility:</span>
                  <span className="text-white font-medium">Android 9.0 Pie (API 28+)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>RAM Optimization:</span>
                  <span className="text-emerald-400 font-medium">2GB LPDDR4 Tuned (~26MB Heap)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Display Engine:</span>
                  <span className="text-[#448AFF] font-medium">AMOLED Pure Black (#000000)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Android Studio Project Code Inspector */}
        {activeTab === 'project_code' && (
          <div className="flex-1 flex flex-col min-h-[640px]">
            <AndroidProjectExplorer />
          </div>
        )}

        {/* TAB 3: Specs & Power Diagnostics */}
        {activeTab === 'benchmarks' && (
          <div className="flex-1 flex flex-col">
            <DeviceBenchmarkView />
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white border border-[#333333] px-4 py-2.5 rounded-xl text-xs font-medium shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-[#448AFF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal 1: Folder Management */}
      {activeFolder && (
        <FolderModal
          folder={activeFolder}
          allApps={apps}
          iconPack={iconPack}
          onClose={() => setActiveFolder(null)}
          onLaunchApp={(app) => setActiveLaunchedApp(app)}
          onRenameFolder={handleRenameFolder}
          onAddAppToFolder={handleAddAppToFolder}
          onRemoveAppFromFolder={handleRemoveAppFromFolder}
          onDeleteFolder={handleDeleteFolder}
        />
      )}

      {/* Modal 2: App Shortcuts Context Menu */}
      {activeAppShortcut && (
        <AppShortcutsModal
          app={activeAppShortcut}
          folders={folders}
          iconPack={iconPack}
          onClose={() => setActiveAppShortcut(null)}
          onLaunch={(app) => setActiveLaunchedApp(app)}
          onToggleFavorite={toggleFavorite}
          onAddToFolder={(fId, aId) => handleAddAppToFolder(fId, aId)}
          onShowAppInfo={(app) => showToast(`App Details: ${app.packageName} · 14MB RAM`)}
          onUninstallApp={handleUninstallApp}
        />
      )}

      {/* Modal 3: Launcher Settings */}
      {showSettingsModal && (
        <SettingsModal
          currentWallpaper={wallpaper}
          iconPack={iconPack}
          gridColumns={gridColumns}
          is24Hour={is24Hour}
          lowRamMode={lowRamMode}
          onClose={() => setShowSettingsModal(false)}
          onSelectWallpaper={(wp) => setWallpaper(wp)}
          onSelectIconPack={(pack) => setIconPack(pack)}
          onSetGridColumns={(cols) => setGridColumns(cols)}
          onToggle24Hour={() => setIs24Hour(!is24Hour)}
          onToggleLowRam={() => setLowRamMode(!lowRamMode)}
          onTriggerDefaultLauncherModal={() => {
            setShowSettingsModal(false);
            setShowDefaultLauncherPrompt(true);
          }}
        />
      )}

      {/* Modal 4: Create Folder Prompt */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xs bg-[#121212] border border-[#262626] rounded-3xl p-5 shadow-2xl text-white">
            <h3 className="text-sm font-semibold mb-2">Create New AMOLED Folder</h3>
            <p className="text-xs text-zinc-400 mb-3">Group your favorite applications on your home screen.</p>
            <input
              type="text"
              placeholder="Folder Name (e.g., Social, Tools)..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333333] focus:border-[#448AFF] rounded-xl px-3 py-2 text-xs text-white focus:outline-none mb-3"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setNewFolderName('');
                  setShowCreateFolderModal(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#448AFF] text-black disabled:opacity-40 cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Android System Default Launcher Prompt (Simulated Android 9 Home Chooser) */}
      {showDefaultLauncherPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#121212] border border-[#282828] rounded-3xl p-5 shadow-2xl text-white">
            <h3 className="text-base font-semibold text-white mb-1">Select a Home app</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Android 9.0 (itel Vision 1 LTE) Home Selector
            </p>

            <div className="space-y-2 mb-4">
              <div
                onClick={() => setIsDefaultLauncher(true)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                  isDefaultLauncher
                    ? 'bg-[#1A1A1A] border-[#448AFF]'
                    : 'bg-[#161616] border-[#262626] hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#000000] border border-[#333333] flex items-center justify-center text-[#448AFF]">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">MAKE DARK – AMOLED Launcher</div>
                    <div className="text-[10px] text-zinc-400">com.makedark.launcher</div>
                  </div>
                </div>
                {isDefaultLauncher && <Check className="w-4 h-4 text-[#448AFF]" />}
              </div>

              <div
                onClick={() => setIsDefaultLauncher(false)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                  !isDefaultLauncher
                    ? 'bg-[#1A1A1A] border-[#448AFF]'
                    : 'bg-[#161616] border-[#262626] hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1F1F1F] flex items-center justify-center text-zinc-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">itel OS Stock Launcher</div>
                    <div className="text-[10px] text-zinc-400">com.itel.launcher</div>
                  </div>
                </div>
                {!isDefaultLauncher && <Check className="w-4 h-4 text-[#448AFF]" />}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222222]">
              <button
                onClick={() => {
                  setShowDefaultLauncherPrompt(false);
                  showToast('Home app selected for this session');
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
              >
                JUST ONCE
              </button>
              <button
                onClick={() => {
                  setShowDefaultLauncherPrompt(false);
                  showToast(
                    isDefaultLauncher
                      ? 'MAKE DARK set as your default Home launcher'
                      : 'itel OS restored as default Home launcher'
                  );
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#448AFF] hover:bg-[#2979FF] text-black cursor-pointer shadow-md"
              >
                ALWAYS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
