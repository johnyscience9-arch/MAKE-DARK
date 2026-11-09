import React from 'react';
import { X, Trash2, Plus, Check } from 'lucide-react';
import { AppItem, FolderItem, IconPackId } from '../types/launcher';
import { AppIcon } from './AppIcon';

interface FolderModalProps {
  folder: FolderItem;
  allApps: AppItem[];
  iconPack: IconPackId;
  onClose: () => void;
  onLaunchApp: (app: AppItem) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onAddAppToFolder: (folderId: string, appId: string) => void;
  onRemoveAppFromFolder: (folderId: string, appId: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export const FolderModal: React.FC<FolderModalProps> = ({
  folder,
  allApps,
  iconPack,
  onClose,
  onLaunchApp,
  onRenameFolder,
  onAddAppToFolder,
  onRemoveAppFromFolder,
  onDeleteFolder
}) => {
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [folderName, setFolderName] = React.useState(folder.name);
  const [showAddList, setShowAddList] = React.useState(false);

  const folderApps = allApps.filter((app) => folder.appIds.includes(app.id));
  const availableAppsToAdd = allApps.filter((app) => !folder.appIds.includes(app.id));

  const handleSaveName = () => {
    if (folderName.trim()) {
      onRenameFolder(folder.id, folderName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#121212] border border-[#262626] rounded-3xl p-5 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
          {isEditingName ? (
            <div className="flex items-center gap-2 flex-1 mr-2">
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="bg-[#1A1A1A] border border-[#448AFF] rounded-lg px-2 py-1 text-sm text-white w-full focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-1 rounded-lg bg-[#448AFF] text-black cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-base font-semibold text-white hover:text-[#448AFF] transition-colors cursor-pointer text-left truncate max-w-[200px]"
              title="Click to rename folder"
            >
              {folder.name} <span className="text-xs font-normal text-zinc-500">(edit)</span>
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (confirm(`Delete folder "${folder.name}"?`)) {
                  onDeleteFolder(folder.id);
                  onClose();
                }
              }}
              title="Delete folder"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1A1A1A] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!showAddList ? (
          <div>
            <div className="py-4 min-h-[140px]">
              {folderApps.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  This folder is empty.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {folderApps.map((app) => (
                    <div key={app.id} className="flex flex-col items-center group relative">
                      <div
                        onClick={() => {
                          onLaunchApp(app);
                          onClose();
                        }}
                        className="cursor-pointer"
                      >
                        <AppIcon iconName={app.iconName} label={app.name} iconPack={iconPack} size="md" />
                      </div>
                      <span className="mt-1 text-[11px] font-medium text-zinc-300 truncate max-w-[60px] text-center">
                        {app.name}
                      </span>
                      {/* Remove from folder badge */}
                      <button
                        onClick={() => onRemoveAppFromFolder(folder.id, app.id)}
                        title="Remove from folder"
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1A1A1A] border border-[#333333] text-zinc-400 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add App Button */}
            <button
              onClick={() => setShowAddList(true)}
              className="w-full py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] border border-[#2a2a2a] text-xs font-medium text-[#448AFF] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Apps to Folder</span>
            </button>
          </div>
        ) : (
          <div className="py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400">Select app to add:</span>
              <button
                onClick={() => setShowAddList(false)}
                className="text-xs text-[#448AFF] hover:underline cursor-pointer"
              >
                Done
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1">
              {availableAppsToAdd.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onAddAppToFolder(folder.id, app.id)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <AppIcon iconName={app.iconName} label={app.name} iconPack={iconPack} size="sm" />
                    <div>
                      <div className="text-xs font-medium text-white">{app.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{app.packageName}</div>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-[#448AFF]" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
