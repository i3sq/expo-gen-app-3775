import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Context Providers
import { AnimeProvider } from './src/context/AnimeContext';
import { SettingsProvider } from './src/context/SettingsContext';

// Navigation
import RootNavigator from './src/navigation';

/**
 * Ignore specific warning logs if necessary. 
 * In production-ready apps, we usually keep this minimal.
 */
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

/**
 * Root App Component
 * 
 * This file serves as the entry point of the application.
 * It sets up the necessary providers for theme, state, and navigation.
 * 
 * Hierarchy:
 * 1. GestureHandlerRootView: Required for react-navigation gestures.
 * 2. SafeAreaProvider: Manages safe area insets across the app.
 * 3. SettingsProvider: Manages user preferences (Language, Theme, etc.).
 * 4. AnimeProvider: Manages the global state for Anime, Seasons, and Episodes.
 * 5. RootNavigator: Handles the application routing logic.
 */
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SettingsProvider>
          <AnimeProvider>
            <StatusBar style="auto" translucent />
            <RootNavigator />
          </AnimeProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});