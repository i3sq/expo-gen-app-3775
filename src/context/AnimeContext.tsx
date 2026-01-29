import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Episode {
  id: string;
  seasonId: string;
  animeId: string;
  title: string;
  videoUrl: string;
}

export interface Season {
  id: string;
  animeId: string;
  number: number;
  episodes: Episode[];
}

export interface Anime {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  seasons: Season[];
}

interface AnimeContextType {
  animeList: Anime[];
  addAnime: (name: string, description: string, imageUrl: string) => Promise<void>;
  addSeason: (animeId: string, seasonNumber: number) => Promise<void>;
  addEpisode: (animeId: string, seasonId: string, title: string, videoUrl: string) => Promise<void>;
  deleteAnime: (animeId: string) => Promise<void>;
  isLoading: boolean;
}

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

const STORAGE_KEY = '@anime_collection_v1';

export const AnimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setAnimeList(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load anime data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (data: Anime[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save anime data:', error);
    }
  };

  const addAnime = async (name: string, description: string, imageUrl: string) => {
    const newAnime: Anime = {
      id: Date.now().toString(),
      name,
      description,
      imageUrl,
      seasons: [],
    };
    const updatedList = [...animeList, newAnime];
    setAnimeList(updatedList);
    await saveData(updatedList);
  };

  const addSeason = async (animeId: string, seasonNumber: number) => {
    const updatedList = animeList.map((anime) => {
      if (anime.id === animeId) {
        const newSeason: Season = {
          id: `${animeId}-S${seasonNumber}-${Date.now()}`,
          animeId,
          number: seasonNumber,
          episodes: [],
        };
        return {
          ...anime,
          seasons: [...anime.seasons, newSeason].sort((a, b) => a.number - b.number),
        };
      }
      return anime;
    });
    setAnimeList(updatedList);
    await saveData(updatedList);
  };

  const addEpisode = async (animeId: string, seasonId: string, title: string, videoUrl: string) => {
    const updatedList = animeList.map((anime) => {
      if (anime.id === animeId) {
        const updatedSeasons = anime.seasons.map((season) => {
          if (season.id === seasonId) {
            const newEpisode: Episode = {
              id: `${seasonId}-E${season.episodes.length + 1}-${Date.now()}`,
              seasonId,
              animeId,
              title,
              videoUrl,
            };
            return {
              ...season,
              episodes: [...season.episodes, newEpisode],
            };
          }
          return season;
        });
        return { ...anime, seasons: updatedSeasons };
      }
      return anime;
    });
    setAnimeList(updatedList);
    await saveData(updatedList);
  };

  const deleteAnime = async (animeId: string) => {
    const updatedList = animeList.filter((anime) => anime.id !== animeId);
    setAnimeList(updatedList);
    await saveData(updatedList);
  };

  return (
    <AnimeContext.Provider
      value={{
        animeList,
        addAnime,
        addSeason,
        addEpisode,
        deleteAnime,
        isLoading,
      }}
    >
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnime = () => {
  const context = useContext(AnimeContext);
  if (context === undefined) {
    throw new Error('useAnime must be used within an AnimeProvider');
  }
  return context;
};