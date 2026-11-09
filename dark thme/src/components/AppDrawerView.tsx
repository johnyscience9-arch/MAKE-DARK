import React from 'react';
import { ArrowLeft, Search, X, Star } from 'lucide-react';
import { AppItem, IconPackId } from '../types/launcher';
import { AppIcon } from './AppIcon';

interface AppDrawerViewProps {
  apps: AppItem[];
  iconPack: IconPackId;
  gridColumns: number;
  onClose: () => void;
  onLaunchApp: (app: AppItem) => void;
  onAppContextMenu: (e: React.MouseEvent, app: AppItem) => void;
}

export const AppDrawerView: React.FC<AppDrawerViewProps> = ({
  apps,
  iconPack,
  gridColumns,
  onClose,
  onLaunchApp,
  onAppContextMenu
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('all');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'social', label: 'Social' },
    { id: 'tools', label: 'Tools' },
    { id: 'media', label: 'Media' },
    { id: 'system', label: 'System' }
  ];

  // Filter apps
  const filteredApps = React.useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.packageName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        activeCategory === 'all'
          ? true
          : activeCategory === 'favorites'
          ? app.isFavorite
          : app.category === activeCategory;

      return matchesSearch && matchesCat;
    });
  }, [apps, searchQuery, activeCategory]);

  return (
    <div className="flex-1 flex flex-col bg-[#000000] px-4 pt-1 pb-4 select-none relative z-20 overflow-hidden">
      {/* Top Search Header */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-[#121212] border border-[#222222] flex items-center justify-center text-zinc-300 hover:text-white hover:border-[#448AFF] transition-colors cursor-pointer shrink-0"
          title="Back to Home Screen"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Search input field */}
        <div className="flex-1 h-10 rounded-xl bg-[#121212] border border-[#262626] focus-within:border-[#448AFF] flex items-center px-3 gap-2 transition-colors">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={`Search ${apps.length} apps...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs (Segmented Button Controls) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#448AFF] text-black font-semibold'
                  : 'bg-[#121212] text-zinc-400 hover:text-zinc-200 border border-[#222222]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Apps Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
        {filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-xs">
            <p>No apps match "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-2 text-[#448AFF] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-y-4 gap-x-2 py-2 ${
              gridColumns === 5 ? 'grid-cols-5' : 'grid-cols-4'
            }`}
          >
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => onLaunchApp(app)}
                onContextMenu={(e) => onAppContextMenu(e, app)}
                className="flex flex-col items-center group cursor-pointer relative"
              >
                <div className="relative">
                  <AppIcon
                    iconName={app.iconName}
                    label={app.name}
                    iconPack={iconPack}
                    size={gridColumns === 5 ? 'sm' : 'md'}
                  />
                  {app.isFavorite && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 text-[#448AFF] fill-[#448AFF]" />
                    </div>
                  )}
                </div>
                <span className="mt-1.5 text-[11px] font-medium text-zinc-300 group-hover:text-white truncate max-w-[64px] text-center">
                  {app.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 text-center text-[10px] text-zinc-600 font-mono">
        Showing {filteredApps.length} of {apps.length} apps · Right-click/hold for shortcuts
      </div>
    </div>
  );
};
