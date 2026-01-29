import { TextStyle, Platform } from 'react-native';

/**
 * Typography system for the Anime Library App.
 * Follows iOS Human Interface Guidelines for font scales and weights.
 * Supports Arabic script rendering through system font prioritization.
 */

type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

interface TypographyStyles {
  largeTitle: TextStyle;
  title1: TextStyle;
  title2: TextStyle;
  title3: TextStyle;
  headline: TextStyle;
  body: TextStyle;
  callout: TextStyle;
  subheadline: TextStyle;
  footnote: TextStyle;
  caption1: TextStyle;
  caption2: TextStyle;
}

const fontWeights = {
  regular: '400' as FontWeight,
  medium: '500' as FontWeight,
  semibold: '600' as FontWeight,
  bold: '700' as FontWeight,
};

const baseFontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const Typography: TypographyStyles = {
  largeTitle: {
    fontFamily: baseFontFamily,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.37,
    textAlign: 'right', // Default for Arabic/RTL context
  },
  title1: {
    fontFamily: baseFontFamily,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.36,
    textAlign: 'right',
  },
  title2: {
    fontFamily: baseFontFamily,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.35,
    textAlign: 'right',
  },
  title3: {
    fontFamily: baseFontFamily,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.38,
    textAlign: 'right',
  },
  headline: {
    fontFamily: baseFontFamily,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.41,
    textAlign: 'right',
  },
  body: {
    fontFamily: baseFontFamily,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.41,
    textAlign: 'right',
  },
  callout: {
    fontFamily: baseFontFamily,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.32,
    textAlign: 'right',
  },
  subheadline: {
    fontFamily: baseFontFamily,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.24,
    textAlign: 'right',
  },
  footnote: {
    fontFamily: baseFontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.08,
    textAlign: 'right',
  },
  caption1: {
    fontFamily: baseFontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    textAlign: 'right',
  },
  caption2: {
    fontFamily: baseFontFamily,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.07,
    textAlign: 'right',
  },
};

/**
 * Helper to override weight or alignment for specific cases
 */
export const getFontWeight = (weight: keyof typeof fontWeights): FontWeight => fontWeights[weight];

export default Typography;