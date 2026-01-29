import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Types and Interfaces for the Storage Service
 */

export interface Episode {
  id: string;
  title: string;
  videoUrl: string;
  order: number;
}

export interface Season {
  id: string;
  number: number;
  episodes: Episode[];
}

export interface Anime {
  id: string;
  title: string;
  descriptionArabic: string;
  imageUrl: string;
  seasons: Season[];
  createdAt: number;
}

export interface UserSettings {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'system';
  autoPlay: boolean;
  qualityPreference: '720p' | '1080p' | '4K';
}

const STORAGE_KEYS = {
  ANIME_LIST: '@anime_library_data',
  SETTINGS: '@app_settings',
};

const DEFAULT_SETTINGS: UserSettings = {
  language: 'ar',
  theme: 'dark',
  autoPlay: true,
  qualityPreference: '1080p',
};

/**
 * Storage Service
 * Handles persistence for anime data and user settings
 */
export const storageService = {
  /**
   * Anime Data Operations
   */
  saveAnimeList: async (animeList: Anime[]): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(animeList);
      await AsyncStorage.setItem(STORAGE_KEYS.ANIME_LIST, jsonValue);
    } catch (error) {
      console.error('Error saving anime list:', error);
      throw new Error('Failed to save anime data');
    }
  },

  getAnimeList: async (): Promise<Anime[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ANIME_LIST);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading anime list:', error);
      return [];
    }
  },

  addAnime: async (anime: Anime): Promise<void> => {
    try {
      const currentList = await storageService.getAnimeList();
      const newList = [anime, ...currentList];
      await storageService.saveAnimeList(newList);
    } catch (error) {
      console.error('Error adding anime:', error);
      throw error;
    }
  },

  updateAnime: async (updatedAnime: Anime): Promise<void> => {
    try {
      const currentList = await storageService.getAnimeList();
      const newList = currentList.map((item) =>
        item.id === updatedAnime.id ? updatedAnime : item
      );
      await storageService.saveAnimeList(newList);
    } catch (error) {
      console.error('Error updating anime:', error);
      throw error;
    }
  },

  deleteAnime: async (id: string): Promise<void> => {
    try {
      const currentList = await storageService.getAnimeList();
      const newList = currentList.filter((item) => item.id !== id);
      await storageService.saveAnimeList(newList);
    } catch (error) {
      console.error('Error deleting anime:', error);
      throw error;
    }
  },

  /**
   * Settings Operations
   */
  saveSettings: async (settings: UserSettings): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  },

  getSettings: async (): Promise<UserSettings> => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  /**
   * Utility Operations
   */
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.ANIME_LIST, STORAGE_KEYS.SETTINGS]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};

export default storageService;