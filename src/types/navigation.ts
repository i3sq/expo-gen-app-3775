import { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Navigation Parameter List for the main application stack.
 * Defines the parameters expected by each screen in the app.
 */
export type RootStackParamList = {
  /**
   * Home Screen: Displays the grid of anime titles.
   * No parameters required.
   */
  Home: undefined;

  /**
   * Anime Detail Screen: Displays detailed information about a specific anime.
   * @param animeId - The unique identifier of the anime to display.
   */
  AnimeDetail: {
    animeId: string;
  };

  /**
   * Player Screen: The video playback interface.
   * @param animeId - The ID of the anime the episode belongs to.
   * @param episodeId - The unique identifier for the specific episode.
   * @param videoUrl - The direct URI for the video file.
   * @param episodeTitle - The display name for the episode (e.g., "Episode 1").
   * @param animeTitle - The name of the anime for display in controls.
   */
  Player: {
    animeId: string;
    episodeId: string;
    videoUrl: string;
    episodeTitle: string;
    animeTitle: string;
  };

  /**
   * Settings Screen: App preferences and customization.
   * No parameters required.
   */
  Settings: undefined;
};

/**
 * Helper types for screen component props.
 * These can be used in screen components to type the 'navigation' and 'route' props.
 */
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type AnimeDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'AnimeDetail'>;
export type PlayerScreenProps = NativeStackScreenProps<RootStackParamList, 'Player'>;
export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

/**
 * Global declaration for React Navigation to provide type safety for useNavigation hook.
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}