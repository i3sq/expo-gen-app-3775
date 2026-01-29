import { useContext, useCallback } from 'react';
import { AnimeContext, Anime, Season, Episode } from '../context/AnimeContext';

/**
 * Custom hook to interact with the Anime Store.
 * Provides methods to manage the anime collection, seasons, and episodes.
 */
export const useAnimeStore = () => {
  const context = useContext(AnimeContext);

  if (!context) {
    throw new Error('useAnimeStore must be used within an AnimeProvider');
  }

  const { animes, setAnimes, isLoading } = context;

  /**
   * Adds a new anime to the collection.
   */
  const addAnime = useCallback(async (name: string, description: string, imageUrl: string) => {
    const newAnime: Anime = {
      id: Date.now().toString(),
      title: name,
      description: description,
      imageUrl: imageUrl,
      seasons: [],
    };

    const updatedAnimes = [...animes, newAnime];
    await setAnimes(updatedAnimes);
  }, [animes, setAnimes]);

  /**
   * Adds a season to an existing anime.
   */
  const addSeason = useCallback(async (animeId: string, seasonNumber: number) => {
    const updatedAnimes = animes.map((anime) => {
      if (anime.id === animeId) {
        const newSeason: Season = {
          id: `${animeId}-s${seasonNumber}-${Date.now()}`,
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

    await setAnimes(updatedAnimes);
  }, [animes, setAnimes]);

  /**
   * Adds an episode to a specific season of an anime.
   */
  const addEpisode = useCallback(async (
    animeId: string, 
    seasonId: string, 
    title: string, 
    videoUrl: string
  ) => {
    const updatedAnimes = animes.map((anime) => {
      if (anime.id === animeId) {
        const updatedSeasons = anime.seasons.map((season) => {
          if (season.id === seasonId) {
            const newEpisode: Episode = {
              id: `${seasonId}-e${Date.now()}`,
              title: title,
              videoUrl: videoUrl,
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

    await setAnimes(updatedAnimes);
  }, [animes, setAnimes]);

  /**
   * Retrieves a specific anime by its ID.
   */
  const getAnimeById = useCallback((id: string): Anime | undefined => {
    return animes.find((anime) => anime.id === id);
  }, [animes]);

  /**
   * Removes an anime from the collection.
   */
  const deleteAnime = useCallback(async (id: string) => {
    const updatedAnimes = animes.filter((anime) => anime.id !== id);
    await setAnimes(updatedAnimes);
  }, [animes, setAnimes]);

  /**
   * Updates existing anime details.
   */
  const updateAnime = useCallback(async (id: string, updates: Partial<Omit<Anime, 'id' | 'seasons'>>) => {
    const updatedAnimes = animes.map((anime) => {
      if (anime.id === id) {
        return { ...anime, ...updates };
      }
      return anime;
    });
    await setAnimes(updatedAnimes);
  }, [animes, setAnimes]);

  return {
    animes,
    isLoading,
    addAnime,
    addSeason,
    addEpisode,
    getAnimeById,
    deleteAnime,
    updateAnime,
  };
};

export default useAnimeStore;