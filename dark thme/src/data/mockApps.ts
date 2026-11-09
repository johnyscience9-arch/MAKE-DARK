import { AppItem, FolderItem, WallpaperOption } from '../types/launcher';

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'phone',
    name: 'Phone',
    packageName: 'com.android.dialer',
    category: 'system',
    isFavorite: true,
    isSystemApp: true,
    iconName: 'Phone'
  },
  {
    id: 'messages',
    name: 'Messages',
    packageName: 'com.android.messaging',
    category: 'social',
    isFavorite: true,
    isSystemApp: true,
    iconName: 'MessageSquare'
  },
  {
    id: 'chrome',
    name: 'Chrome',
    packageName: 'com.android.chrome',
    category: 'tools',
    isFavorite: true,
    isSystemApp: true,
    iconName: 'Globe'
  },
  {
    id: 'camera',
    name: 'Camera',
    packageName: 'com.android.camera2',
    category: 'media',
    isFavorite: true,
    isSystemApp: true,
    iconName: 'Camera'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    packageName: 'com.whatsapp',
    category: 'social',
    isFavorite: true,
    isSystemApp: false,
    iconName: 'Send'
  },
  {
    id: 'photos',
    name: 'Gallery',
    packageName: 'com.android.gallery3d',
    category: 'media',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'Image'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    packageName: 'com.google.android.youtube',
    category: 'media',
    isFavorite: false,
    isSystemApp: false,
    iconName: 'PlayCircle'
  },
  {
    id: 'settings',
    name: 'Settings',
    packageName: 'com.android.settings',
    category: 'system',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'Settings'
  },
  {
    id: 'clock',
    name: 'Clock',
    packageName: 'com.android.deskclock',
    category: 'tools',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'Clock'
  },
  {
    id: 'calculator',
    name: 'Calculator',
    packageName: 'com.android.calculator2',
    category: 'tools',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'Calculator'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    packageName: 'com.android.calendar',
    category: 'productivity',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'Calendar'
  },
  {
    id: 'files',
    name: 'Files',
    packageName: 'com.google.android.apps.nbu.files',
    category: 'tools',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'FolderArchive'
  },
  {
    id: 'contacts',
    name: 'Contacts',
    packageName: 'com.android.contacts',
    category: 'social',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'Users'
  },
  {
    id: 'maps',
    name: 'Maps Go',
    packageName: 'com.google.android.apps.mapslite',
    category: 'tools',
    isFavorite: false,
    isSystemApp: false,
    iconName: 'MapPin'
  },
  {
    id: 'music',
    name: 'Music Player',
    packageName: 'com.android.music',
    category: 'media',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'Music'
  },
  {
    id: 'recorder',
    name: 'Sound Recorder',
    packageName: 'com.android.soundrecorder',
    category: 'tools',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'Mic'
  },
  {
    id: 'fm_radio',
    name: 'FM Radio',
    packageName: 'com.android.fmradio',
    category: 'media',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'Radio'
  },
  {
    id: 'notes',
    name: 'Notes',
    packageName: 'com.itel.notes',
    category: 'productivity',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'FileText'
  },
  {
    id: 'itel_care',
    name: 'Carlcare',
    packageName: 'com.carlcare.browser',
    category: 'tools',
    isFavorite: false,
    isSystemApp: true,
    iconName: 'LifeBuoy'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    packageName: 'org.telegram.messenger',
    category: 'social',
    isFavorite: false,
    isSystemApp: false,
    iconName: 'MessageCircle'
  }
];

export const INITIAL_FOLDERS: FolderItem[] = [
  {
    id: 'folder_essentials',
    name: 'Essentials',
    appIds: ['phone', 'messages', 'chrome', 'camera'],
    color: '#448AFF'
  },
  {
    id: 'folder_tools',
    name: 'Utility Tools',
    appIds: ['calculator', 'clock', 'files', 'recorder'],
    color: '#00E676'
  }
];

export const WALLPAPER_OPTIONS: WallpaperOption[] = [
  {
    id: 'pure_black',
    name: 'Pure Black (True AMOLED)',
    description: '100% #000000 pixels. Sub-pixels are completely unpowered. Maximum battery savings.',
    powerConsumption: '0 mW (Pixel Emitter Off)',
    previewClass: 'bg-black',
    bgStyle: '#000000'
  },
  {
    id: 'deep_void',
    name: 'Deep Void Gradient',
    description: 'Subtle vignette with dark charcoal radial center (#080808) fading to pitch black.',
    powerConsumption: '~4 mW (0.3% power)',
    previewClass: 'bg-radial from-[#121212] to-black',
    bgStyle: 'radial-gradient(circle at center, #121212 0%, #000000 85%)'
  },
  {
    id: 'eclipse_blue',
    name: 'Eclipse Blue Horizon',
    description: 'Minimalist low-contrast navy gradient with #448AFF micro-glow at the base.',
    powerConsumption: '~12 mW (0.9% power)',
    previewClass: 'bg-gradient-to-b from-black via-black to-[#051126]',
    bgStyle: 'linear-gradient(180deg, #000000 0%, #000000 70%, #06132b 100%)'
  },
  {
    id: 'geometric_obsidian',
    name: 'Geometric Obsidian',
    description: 'Ultra-thin 1px polygonal wireframe lines on a pure black background.',
    powerConsumption: '~8 mW (0.5% power)',
    previewClass: 'bg-black',
    bgStyle: 'radial-gradient(#1f1f1f 1px, transparent 1px), #000000'
  }
];
