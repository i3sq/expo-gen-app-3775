import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

type ThemeMode = 'light' | 'dark' | 'system';
type Language = 'ar' | 'en';
type VideoQuality = 'Auto' | '1080p' | '720p' | '480p';

interface SettingsState {
  theme: ThemeMode;
  language: Language;
  autoPlay: boolean;
  qualityPreference: VideoQuality;
  isLoaded: boolean;
}

interface SettingsContextType extends SettingsState {
  setTheme: (theme: ThemeMode) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  setAutoPlay: (enabled: boolean) => Promise<void>;
  setQualityPreference: (quality: VideoQuality) => Promise<void>;
}

const SETTINGS_STORAGE_KEY = '@anime_app_settings';

const defaultSettings: SettingsState = {
  theme: 'system',
  language: 'ar',
  autoPlay: true,
  qualityPreference: 'Auto',
  isLoaded: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings({ ...parsed, isLoaded: true });
        
        // Ensure RTL state matches the saved language
        const isRtl = parsed.language === 'ar';
        if (I18nManager.isRTL !== isRtl) {
          I18nManager.allowRTL(isRtl);
          I18nManager.forceRTL(isRtl);
          // In some cases, a reload is needed here, but we avoid it during initial mount to prevent loops
        }
      } else {
        setSettings((prev) => ({ ...prev, isLoaded: true }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSettings((prev) => ({ ...prev, isLoaded: true }));
    }
  };

  const saveSettings = async (updatedSettings: SettingsState) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const setTheme = async (theme: ThemeMode) => {
    const newSettings = { ...settings, theme };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const setLanguage = async (language: Language) => {
    const newSettings = { ...settings, language };
    setSettings(newSettings);
    await saveSettings(newSettings);

    const isRtl = language === 'ar';
    if (I18nManager.isRTL !== isRtl) {
      I18nManager.allowRTL(isRtl);
      I18nManager.forceRTL(isRtl);
      // Essential for RTL changes in React Native to take effect
      setTimeout(() => {
        Updates.reloadAsync();
      }, 100);
    }
  };

  const setAutoPlay = async (autoPlay: boolean) => {
    const newSettings = { ...settings, autoPlay };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const setQualityPreference = async (qualityPreference: VideoQuality) => {
    const newSettings = { ...settings, qualityPreference };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const value: SettingsContextType = {
    ...settings,
    setTheme,
    setLanguage,
    setAutoPlay,
    setQualityPreference,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const useThemeColor = () => {
  const { theme } = useSettings();
  const systemColorScheme = Appearance.getColorScheme();
  
  const currentTheme = theme === 'system' ? systemColorScheme : theme;
  const isDark = currentTheme === 'dark';

  return {
    isDark,
    colors: {
      background: isDark ? '#000000' : '#F2F2F7',
      card: isDark ? '#1C1C1E' : '#FFFFFF',
      text: isDark ? '#FFFFFF' : '#000000',
      subtext: isDark ? '#8E8E93' : '#3C3C43',
      primary: '#0A84FF',
      border: isDark ? '#38383A' : '#C6C6C8',
      tabBar: isDark ? '#121212' : '#FFFFFF',
      danger: '#FF453A',
      success: '#32D74B'
    }
  };
};