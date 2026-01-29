import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  View,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimeGridItemProps {
  id: string;
  title: string;
  imageUrl: string;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
// Calculate width for 3 items per row with 10px spacing
const ITEM_MARGIN = 8;
const ITEM_WIDTH = (width - (ITEM_MARGIN * 4)) / 3;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5; // Classic poster aspect ratio

const AnimeGridItem: React.FC<AnimeGridItemProps> = ({
  title,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        >
          <Text 
            style={styles.title} 
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginHorizontal: ITEM_MARGIN / 2,
    marginVertical: ITEM_MARGIN,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // Android Elevation
    elevation: 5,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E', // Dark iOS background
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right', // Support for Arabic/RTL
    writingDirection: 'rtl',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    lineHeight: 16,
  },
});

export default AnimeGridItem;