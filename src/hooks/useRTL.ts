import { useCallback } from 'react';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

/**
 * Custom hook to manage Right-to-Left (RTL) layout settings and directions.
 * This is a critical utility for the Arabic language support within the Anime Library app.
 */

export interface RTLHelpers {
  isRTL: boolean;
  toggleRTL: (shouldBeRTL: boolean) => Promise<void>;
  flexDirection: 'row' | 'row-reverse';
  textAlign: 'left' | 'right';
  writingDirection: 'ltr' | 'rtl';
  alignItems: 'flex-start' | 'flex-end';
  justifyContent: 'flex-start' | 'flex-end';
}

export const useRTL = (): RTLHelpers => {
  const isRTL = I18nManager.isRTL;

  /**
   * Updates the app's RTL status and reloads the application to apply layout changes.
   * Changing RTL layout requires an app restart in React Native to correctly re-calculate
   * the layout tree and shadow nodes.
   * 
   * @param shouldBeRTL - Boolean indicating if RTL (Arabic) should be enabled.
   */
  const toggleRTL = useCallback(async (shouldBeRTL: boolean) => {
    if (I18nManager.isRTL !== shouldBeRTL) {
      try {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
        
        // Use Expo Updates to restart the app immediately
        await Updates.reloadAsync();
      } catch (error) {
        console.error('[useRTL] Failed to toggle RTL layout:', error);
      }
    }
  }, []);

  /**
   * Returns 'row-reverse' for RTL environments to maintain logical visual order.
   */
  const getFlexDirection = (): 'row' | 'row-reverse' => {
    return isRTL ? 'row-reverse' : 'row';
  };

  /**
   * Returns 'right' for RTL (Arabic) and 'left' for LTR.
   */
  const getTextAlign = (): 'left' | 'right' => {
    return isRTL ? 'right' : 'left';
  };

  /**
   * Standardizes text writing direction for specific UI components.
   */
  const getWritingDirection = (): 'ltr' | 'rtl' => {
    return isRTL ? 'rtl' : 'ltr';
  };

  /**
   * Helper for aligning content in containers (e.g., Header text, Form labels).
   */
  const getAlignItems = (): 'flex-start' | 'flex-end' => {
    return isRTL ? 'flex-end' : 'flex-start';
  };

  /**
   * Helper for horizontal distribution logic.
   */
  const getJustifyContent = (): 'flex-start' | 'flex-end' => {
    return isRTL ? 'flex-end' : 'flex-start';
  };

  return {
    isRTL,
    toggleRTL,
    flexDirection: getFlexDirection(),
    textAlign: getTextAlign(),
    writingDirection: getWritingDirection(),
    alignItems: getAlignItems(),
    justifyContent: getJustifyContent(),
  };
};

export default useRTL;