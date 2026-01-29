export interface AppSettings {
  language: 'ar' | 'en';
  isRTL: boolean;
  theme: 'light' | 'dark' | 'system';
  autoPlay: boolean;
  qualityPreference: '720p' | '1080p' | 'Auto';
}

/**
 * Global application configuration constants.
 * Used across the app for storage keys, UI defaults, and player settings.
 */
export const Config = {
  app: {
    name: 'Anime Library',
    displayNameArabic: 'مكتبة الأنمي',
    version: '1.0.0',
  },
  storage: {
    animeDataKey: '@anime_library_store_v1',
    settingsKey: '@anime_library_settings_v1',
    historyKey: '@anime_library_history_v1',
  },
  defaults: {
    settings: {
      language: 'ar',
      isRTL: true,
      theme: 'system',
      autoPlay: true,
      qualityPreference: 'Auto',
    } as AppSettings,
    animeCover: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=1000&auto=format&fit=crop',
  },
  ui: {
    gridColumns: 3,
    cardAspectRatio: 2 / 3, // Standard poster ratio
    animationDuration: 250,
    springConfig: {
      damping: 20,
      stiffness: 90,
      mass: 1,
    },
    shadows: {
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    },
  },
  player: {
    seekInterval: 10, // seconds to skip forward/back
    playbackSpeeds: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
    hideControlsTimeout: 3000, // milliseconds
    aspectRatios: {
      square: 1,
      standard: 4 / 3,
      widescreen: 16 / 9,
    },
  },
  localization: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    rtlLocales: ['ar'],
  },
} as const;

/**
 * Type helper for extracting Config properties
 */
export type ConfigType = typeof Config;

export default Config;