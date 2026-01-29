import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

/**
 * Utility class to manage Right-to-Left (RTL) layout logic and app restarts.
 * Specifically tailored for Arabic language support in React Native.
 */
export const RTLHelper = {
  /**
   * Returns whether the current device/app state is in RTL mode.
   */
  isRTL: I18nManager.isRTL,

  /**
   * Forces the app into RTL or LTR mode.
   * This triggers an app reload via Expo Updates to ensure the native layout engine
   * correctly applies the change across all components.
   * 
   * @param shouldBeRTL - Boolean indicating if the layout should be Right-to-Left.
   */
  async forceRTL(shouldBeRTL: boolean): Promise<void> {
    try {
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);

        // A small delay ensures the I18nManager settings are persisted before reload
        setTimeout(async () => {
          await Updates.reloadAsync();
        }, 200);
      }
    } catch (error) {
      console.error('Failed to set RTL layout:', error);
    }
  },

  /**
   * Helper to return style values based on RTL status.
   * Useful for properties that don't support 'start'/'end' or require manual flipping.
   * 
   * @param ltrValue - Value to use in Left-to-Right mode.
   * @param rtlValue - Value to use in Right-to-Left mode.
   */
  select<T>(ltrValue: T, rtlValue: T): T {
    return this.isRTL ? rtlValue : ltrValue;
  },

  /**
   * Returns 'row' or 'row-reverse' based on the current layout direction.
   * Primarily used for custom components where standard flex behavior isn't sufficient.
   */
  getFlexDirection(): 'row' | 'row-reverse' {
    return this.isRTL ? 'row-reverse' : 'row';
  },

  /**
   * Returns the correct textAlign property for text blocks.
   * Defaults to 'right' for Arabic/RTL contexts.
   */
  getTextAlign(defaultAlign: 'left' | 'center' | 'right' = 'left'): 'left' | 'center' | 'right' {
    if (defaultAlign === 'center') return 'center';
    return this.isRTL ? 'right' : 'left';
  },

  /**
   * Handles degree rotations for icons (like back arrows).
   * 
   * @param degree - The base rotation in degrees.
   */
  getRotation(degree: number): string {
    const finalDegree = this.isRTL ? degree * -1 : degree;
    return `${finalDegree}deg`;
  },

  /**
   * Determines if the back button icon should be flipped.
   * In RTL, the "back" chevron should point right.
   */
  getBackIconName(iosIcon: string = 'chevron-back', androidIcon: string = 'arrow-back'): string {
    // Note: Expo/VectorIcons often handle this automatically if using 'start'/'end' 
    // but this helper provides explicit control if needed.
    return this.isRTL ? 'chevron-forward' : iosIcon;
  }
};

/**
 * Common RTL styles to be spread into StyleSheet objects if needed.
 */
export const rtlStyles = {
  textAlign: RTLHelper.select<'left' | 'right'>('left', 'right'),
  flexDirection: RTLHelper.getFlexDirection(),
};

export default RTLHelper;