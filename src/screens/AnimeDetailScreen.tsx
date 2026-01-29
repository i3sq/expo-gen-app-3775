import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Assuming these types are defined in your types folder
import { Anime, Season, Episode } from '../types/anime';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'AnimeDetail'>;
type DetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AnimeDetail'>;

const AnimeDetailScreen: React.FC = () => {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const route = useRoute<DetailScreenRouteProp>();
  const { anime } = route.params;

  // Initialize selected season to the first available season
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(
    anime.seasons && anime.seasons.length > 0 ? anime.seasons[0].id : ''
  );

  // Memoize active season to avoid unnecessary re-calculations
  const activeSeason = useMemo(() => 
    anime.seasons.find((s) => s.id === selectedSeasonId),
    [anime.seasons, selectedSeasonId]
  );

  const handlePlayEpisode = (episode: Episode) => {
    navigation.navigate('VideoPlayer', {
      videoUrl: episode.videoUrl,
      title: episode.title,
    });
  };

  const renderSeasonTab = ({ item }: { item: Season }) => {
    const isSelected = selectedSeasonId === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.seasonTab,
          isSelected && styles.activeSeasonTab,
        ]}
        onPress={() => setSelectedSeasonId(item.id)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.seasonTabText,
            isSelected && styles.activeSeasonTabText,
          ]}
        >
          الموسم {item.number}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Image Section */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: anime.imageUrl }} 
            style={styles.coverImage} 
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          
          <SafeAreaView edges={['top']} style={styles.headerControls}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              accessibilityLabel="Back"
            >
              <Ionicons 
                name={I18nManager.isRTL ? "chevron-forward" : "chevron-back"} 
                size={28} 
                color="#FFF" 
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Info Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{anime.title}</Text>
          
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>HD</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>+13</Text>
            </View>
            <Text style={styles.seasonCount}>
              {anime.seasons.length} مواسم
            </Text>
          </View>

          <Text style={styles.description}>{anime.descriptionAr}</Text>

          {/* Seasons Selector */}
          <View style={styles.seasonsSection}>
            <FlatList
              data={anime.seasons}
              renderItem={renderSeasonTab}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              inverted={I18nManager.isRTL}
              contentContainerStyle={styles.seasonListContent}
            />
          </View>

          {/* Episodes List */}
          <View style={styles.episodesSection}>
            {activeSeason?.episodes.map((episode, index) => (
              <TouchableOpacity
                key={episode.id}
                style={styles.episodeCard}
                onPress={() => handlePlayEpisode(episode)}
                activeOpacity={0.8}
              >
                <View style={styles.episodeThumbnailContainer}>
                  <Image
                    source={{ uri: episode.thumbnail || anime.imageUrl }}
                    style={styles.episodeThumbnail}
                  />
                  <View style={styles.playIconOverlay}>
                    <Ionicons name="play" size={20} color="#FFF" />
                  </View>
                </View>
                <View style={styles.episodeInfo}>
                  <Text style={styles.episodeNumber}>الحلقة {index + 1}</Text>
                  <Text style={styles.episodeTitle} numberOfLines={1}>
                    {episode.title}
                  </Text>
                </View>
                <TouchableOpacity style={styles.downloadButton}>
                  <Ionicons name="download-outline" size={22} color="#8E8E93" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: width,
    height: width * 1.3,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerControls: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#121212',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -40,
    paddingTop: 30,
    paddingHorizontal: 20,
    minHeight: 500,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'right',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 18,
  },
  badge: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seasonCount: {
    color: '#8E8E93',
    fontSize: 14,
  },
  description: {
    color: '#D1D1D6',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 30,
  },
  seasonsSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingBottom: 15,
  },
  seasonListContent: {
    paddingRight: 0,
  },
  seasonTab: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 25,
    marginLeft: 12,
    backgroundColor: '#262626',
  },
  activeSeasonTab: {
    backgroundColor: '#E50914',
  },
  seasonTabText: {
    color: '#8E8E93',
    fontSize: 15,
    fontWeight: '700',
  },
  activeSeasonTabText: {
    color: '#FFF',
  },
  episodesSection: {
    paddingBottom: 50,
  },
  episodeCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  episodeThumbnailContainer: {
    width: 110,
    height: 65,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  episodeThumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeInfo: {
    flex: 1,
    marginRight: 15,
    alignItems: 'flex-start',
  },
  episodeNumber: {
    color: '#E50914',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'right',
  },
  episodeTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  downloadButton: {
    padding: 5,
  },
});

export default AnimeDetailScreen;