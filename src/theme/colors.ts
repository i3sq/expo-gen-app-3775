export interface ColorPalette {
  primary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  white: string;
  black: string;
  overlay: string;
  tabBarBackground: string;
  headerBackground: string;
  buttonText: string;
  shadow: string;
}

const light: ColorPalette = {
  primary: '#007AFF', // iOS System Blue
  accent: '#5856D6', // iOS System Purple
  background: '#F2F2F7', // iOS Grouped Background Light
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93', // iOS System Gray
  border: '#C6C6C8',
  error: '#FF3B30', // iOS System Red
  success: '#34C759', // iOS System Green
  warning: '#FF9500', // iOS System Orange
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.4)',
  tabBarBackground: '#FFFFFF',
  headerBackground: '#F2F2F7',
  buttonText: '#FFFFFF',
  shadow: '#000000',
};

const dark: ColorPalette = {
  primary: '#0A84FF', // iOS System Blue Dark
  accent: '#5E5CE6', // iOS System Purple Dark
  background: '#000000', // iOS Deep Black
  card: '#1C1C1E', // iOS Secondary Background Dark
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  error: '#FF453A',
  success: '#32D74B',
  warning: '#FF9F0A',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.6)',
  tabBarBackground: '#1C1C1E',
  headerBackground: '#000000',
  buttonText: '#FFFFFF',
  shadow: '#000000',
};

export const Colors = {
  light,
  dark,
  // Helper to get raw iOS colors that don't change based on theme if needed
  static: {
    blue: '#007AFF',
    red: '#FF3B30',
    green: '#34C759',
    gray: '#8E8E93',
    indigo: '#5856D6',
    teal: '#5AC8FA',
    pink: '#FF2D55',
  }
};

export type ThemeType = 'light' | 'dark';

/**
 * Utility to get theme-specific colors
 * This is used primarily in the SettingsContext or components
 * that don't rely on the context directly for style definitions.
 */
export const getColors = (theme: ThemeType): ColorPalette => {
  return theme === 'dark' ? dark : light;
};