export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  category: 'social' | 'tools' | 'system' | 'media' | 'productivity';
  isFavorite: boolean;
  isSystemApp: boolean;
  iconName: string;
}

export interface FolderItem {
  id: string;
  name: string;
  appIds: string[];
  color: string;
}

export type IconPackId = 'amoled_blue' | 'monochrome' | 'stealth' | 'cyber_neon';

export interface WallpaperOption {
  id: string;
  name: string;
  description: string;
  powerConsumption: string;
  previewClass: string;
  bgStyle: string;
}

export type ActiveTab = 'simulator' | 'project_code' | 'benchmarks';
