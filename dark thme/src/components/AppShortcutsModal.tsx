import React from 'react';
import { Play, Star, FolderPlus, Info, Trash2, X } from 'lucide-react';
import { AppItem, FolderItem, IconPackId } from '../types/launcher';
import { AppIcon } from './AppIcon';

interface AppShortcutsModalProps {
  app: AppItem;
  folders: FolderItem[];
  iconPack: IconPackId;
  onClose: () => void;
  onLaunch: (app: AppItem) => void;
  onToggleFavorite: (appId: string) => void;
  onAddToFolder: (folderId: string, appId: string) => void;
  onShowAppInfo: (app: AppItem) => void;
  onUninstallApp: (app: AppItem) => void;
}

export const AppShortcutsModal: React.FC<AppShortcutsModalProps> = ({
  app,
  folders,
  iconPack,
  onClose,
  onLaunch,
  onToggleFavorite,
  onAddToFolder,
  onShowAppInfo,
  onUninstallApp
}) => {
  const [showFolderPicker, setShowFolderPicker] = React.useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-[#121212] border border-[#262626] rounded-3xl p-4 shadow-2xl text-white">
        {/* App Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
          <div className="flex items-center gap-2.5">
            <AppIcon iconName={app.iconName} label={app.name} iconPack={iconPack} size="sm" />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{app.name}</div>
              <div className="text-[10px] text-zinc-500 font-mono truncate">{app.packageName}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts Options */}
        <div className="pt-2 space-y-1">
          <button
            onClick={() => {
              onLaunch(app);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-zinc-200 hover:text-white hover:bg-[#1A1A1A] rounded-xl transition-colors cursor-pointer text-left"
          >
            <Play className="w-4 h-4 text-[#448AFF]" />
            <span>Open Application</span>
          </button>

          <button
            onClick={() => {
              onToggleFavorite(app.id);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-zinc-200 hover:text-white hover:bg-[#1A1A1A] rounded-xl transition-colors cursor-pointer text-left"
          >
            <Star
              className={`w-4 h-4 ${
                app.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'
              }`}
            />
            <span>{app.isFavorite ? 'Remove from Favorites' : 'Pin to Favorites'}</span>
          </button>

          {/* Add to Folder */}
          <div className="relative">
            <button
              onClick={() => setShowFolderPicker(!showFolderPicker)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-200 hover:text-white hover:bg-[#1A1A1A] rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <FolderPlus className="w-4 h-4 text-[#448AFF]" />
                <span>Add to Folder</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">{folders.length} available</span>
            </button>

            {showFolderPicker && (
              <div className="my-1 p-2 rounded-xl bg-[#1A1A1A] border border-[#2a2a2a] space-y-1">
                {folders.map((f) => {
                  const alreadyIn = f.appIds.includes(app.id);
                  return (
                    <button
                      key={f.id}
                      disabled={alreadyIn}
                      onClick={() => {
                        onAddToFolder(f.id, app.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-left ${
                        alreadyIn
                          ? 'opacity-40 text-zinc-500'
                          : 'text-zinc-200 hover:bg-[#262626] cursor-pointer'
                      }`}
                    >
                      <span>{f.name}</span>
                      {alreadyIn && <span className="text-[10px] text-zinc-500">already in</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onShowAppInfo(app);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-zinc-200 hover:text-white hover:bg-[#1A1A1A] rounded-xl transition-colors cursor-pointer text-left"
          >
            <Info className="w-4 h-4 text-zinc-400" />
            <span>App Info & Memory Stats</span>
          </button>

          {!app.isSystemApp && (
            <button
              onClick={() => {
                onUninstallApp(app);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer text-left"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Uninstall Application</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
