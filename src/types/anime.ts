export interface Episode {
  id: string;
  number: number;
  title?: string;
  videoUrl: string;
  duration?: number;
  thumbnailUrl?: string;
  createdAt: number;
}

export interface Season {
  id: string;
  animeId: string;
  number: number;
  title?: string;
  episodes: Episode[];
}

export interface Anime {
  id: string;
  title: string;
  description: string; // Arabic description
  imageUrl: string;
  rating?: number;
  releaseYear?: number;
  seasons: Season[];
  createdAt: number;
  updatedAt: number;
}

export interface AddAnimeDTO {
  title: string;
  description: string;
  imageUrl: string;
}

export interface AddSeasonDTO {
  animeId: string;
  number: number;
  title?: string;
}

export interface AddEpisodeDTO {
  animeId: string;
  seasonId: string;
  number: number;
  title?: string;
  videoUrl: string;
}

export type AnimeCollection = Record<string, Anime>;

export interface AppSettings {
  language: 'ar' | 'en';
  isRTL: boolean;
  theme: 'light' | 'dark' | 'system';
  autoPlayNext: boolean;
  playbackSpeed: number;
  qualityPreference: 'auto' | 'high' | 'low';
}

export interface AnimeContextState {
  animes: Anime[];
  loading: boolean;
  error: string | null;
  addAnime: (anime: AddAnimeDTO) => Promise<void>;
  addSeason: (season: AddSeasonDTO) => Promise<void>;
  addEpisode: (episode: AddEpisodeDTO) => Promise<void>;
  deleteAnime: (id: string) => Promise<void>;
  getAnimeById: (id: string) => Anime | undefined;
}

export interface SettingsContextState {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
}