import { Colors } from './colors';
import { Typography } from './typography';
import { Platform, ViewStyle } from 'react-native';

/**
 * Spacing constants following a 4pt or 8pt grid system.
 * Used for margins, paddings, and layout gaps.
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  huge: 64,
};

/**
 * Border radius constants for a consistent iOS-style look.
 * iOS typically uses slightly larger, smoother corner radii.
 */
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

/**
 * Shadow presets for iOS and Android.
 * Focused on the "Soft UI" look prevalent in modern iOS apps.
 */
export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  } as ViewStyle,
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  } as ViewStyle,
};

/**
 * Layout constants for consistent screen structure.
 */
export const Layout = {
  windowPadding: Spacing.md,
  headerHeight: Platform.OS === 'ios' ? 44 : 56,
  tabBarHeight: 60,
  cardAspectRatio: 2 / 3, // Standard for anime/movie posters
};

/**
 * The Unified Theme Object
 * This serves as the single source of truth for the app's visual design.
 */
export const theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  layout: Layout,
} as const;

/**
 * Theme type definition for use with TypeScript and styled-components (if added later).
 */
export type AppTheme = typeof theme;

/**
 * Helper to get a specific opacity version of a hex color.
 * Useful for iOS-style translucent backgrounds.
 */
export const getOpacityColor = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default theme;
export * from './colors';
export * from './typography';