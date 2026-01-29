import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Plus, Play, BookOpen, Layers } from 'lucide-react-native';
import { FAB, Portal, Provider as PaperProvider } from 'react-native-paper';

// Internal Imports
import { Anime } from '../types/anime';
import { RootStackParamList } from '../types/navigation';
import { useAnimeStore } from '../hooks/useAnimeStore';
import Colors from '../theme/colors';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 12;
const ITEM_WIDTH = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { animeList } = useAnimeStore();
  const [fabState, setFabState] = useState({ open: false });

  const onStateChange = ({ open }: { open: boolean }) => setFabState({ open });

  const renderAnimeItem = ({ item }: { item: Anime }) => (
    <TouchableOpacity
      style={styles.animeCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('AnimeDetails', { anime: item })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/150x210?text=No+Image' }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.seasons?.length || 0} مواسم</Text>
        </View>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.animeTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <BookOpen size={64} color={Colors.lightGray || '#CCC'} />
      <Text style={styles.emptyTitle}>المكتبة فارغة</Text>
      <Text style={styles.emptySubtitle}>ابدأ بإضافة الأنمي المفضل لديك الآن</Text>
    </View>
  );

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>المكتبة الخاصة بي</Text>
          <Text style={styles.headerSubtitle}>إدارة مجموعتك المفضلة</Text>
        </View>

        <FlatList
          data={animeList}
          renderItem={renderAnimeItem}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyState}
          key={`grid-${COLUMN_COUNT}`} // Forces re-render if column count changes
        />

        <Portal>
          <FAB.Group
            open={fabState.open}
            visible
            icon={fabState.open ? 'close' : 'plus'}
            actions={[
              {
                icon: () => <Play size={20} color={Colors.primary || '#6200ee'} />,
                label: 'إضافة حلقة',
                onPress: () => navigation.navigate('AddEpisodeModal' as any),
                labelStyle: styles.fabLabel,
              },
              {
                icon: () => <Layers size={20} color={Colors.primary || '#6200ee'} />,
                label: 'إضافة موسم',
                onPress: () => navigation.navigate('AddSeasonModal' as any),
                labelStyle: styles.fabLabel,
              },
              {
                icon: () => <Plus size={20} color={Colors.primary || '#6200ee'} />,
                label: 'إضافة أنمي جديد',
                onPress: () => navigation.navigate('AddAnimeModal' as any),
                labelStyle: styles.fabLabel,
              },
            ]}
            onStateChange={onStateChange}
            fabStyle={styles.fab}
            backdropColor="rgba(0,0,0,0.4)"
          />
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'right',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  listContent: {
    paddingHorizontal: SPACING / 2,
    paddingBottom: 100,
    flexGrow: 1,
  },
  animeCard: {
    width: ITEM_WIDTH,
    margin: SPACING / 2,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    width: '100%',
    height: ITEM_WIDTH * 1.4,
    backgroundColor: '#E1E1E1',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  titleContainer: {
    padding: 8,
    minHeight: 45,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  animeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    marginBottom: 10,
  },
  fabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
});

export default HomeScreen;