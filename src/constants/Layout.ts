import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const isSmallDevice = width < 375;

/**
 * Grid Layout calculation for the 3-column anime list
 */
const GRID_PADDING = 16;
const GRID_SPACING = 12;
const COLUMN_COUNT = 3;
const TOTAL_SPACING = GRID_PADDING * 2 + (COLUMN_COUNT - 1) * GRID_SPACING;
const ITEM_WIDTH = Math.floor((width - TOTAL_SPACING) / COLUMN_COUNT);
const ITEM_HEIGHT = ITEM_WIDTH * 1.5; // Standard 2:3 aspect ratio for anime posters

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',

  // Spacing system
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    huge: 48,
  },

  // Corner radius
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 999,
  },

  // Grid system specifically for the HomeScreen
  grid: {
    columnCount: COLUMN_COUNT,
    itemWidth: ITEM_WIDTH,
    itemHeight: ITEM_HEIGHT,
    padding: GRID_PADDING,
    gap: GRID_SPACING,
  },

  // Component heights
  header: {
    height: Platform.OS === 'ios' ? 44 : 56,
    largeTitleHeight: 52,
  },
  tabBar: {
    height: Platform.OS === 'ios' ? 88 : 64,
  },

  // Shadows
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  // Video Player specific
  player: {
    aspectRatio: 16 / 9,
    controlsHeight: 50,
  },
};

export default Layout;