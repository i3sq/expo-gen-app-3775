import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './RootNavigator';

/**
 * Custom iOS-inspired theme for the application.
 * Follows Apple Human Interface Guidelines for colors and spacing.
 */
const AnimeLibraryTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF', // iOS System Blue
    background: '#F2F2F7', // iOS Secondary System Background
    card: '#FFFFFF', // White cards/headers
    text: '#000000',
    border: '#C6C6C8', // iOS Separator color
    notification: '#FF3B30', // iOS System Red
  },
};

/**
 * Root Navigation Entry Point.
 * Wraps the application in the necessary providers for navigation,
 * safe area handling, and global styling.
 */
const AppNavigationProvider: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={AnimeLibraryTheme}>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigationProvider;