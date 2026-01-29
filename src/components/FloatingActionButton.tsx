import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface FloatingActionButtonProps {
  onAddAnime: () => void;
  onAddSeason: () => void;
  onAddEpisode: () => void;
}

const { width } = Dimensions.get('window');

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onAddAnime,
  onAddSeason,
  onAddEpisode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const handleAction = (action: () => void) => {
    toggleMenu();
    action();
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.container}>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay}>
            <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
            
            <View style={styles.menuContainer}>
              <Animated.View
                style={[
                  styles.actionsWrapper,
                  {
                    opacity,
                    transform: [{ translateY }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAction(onAddAnime)}
                >
                  <Text style={styles.actionLabel}>إضافة أنمي جديد</Text>
                  <View style={[styles.iconCircle, { backgroundColor: '#007AFF' }]}>
                    <Ionicons name="tv-outline" size={24} color="#FFF" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAction(onAddSeason)}
                >
                  <Text style={styles.actionLabel}>إضافة موسم</Text>
                  <View style={[styles.iconCircle, { backgroundColor: '#5856D6' }]}>
                    <Ionicons name="layers-outline" size={24} color="#FFF" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAction(onAddEpisode)}
                >
                  <Text style={styles.actionLabel}>إضافة حلقة</Text>
                  <View style={[styles.iconCircle, { backgroundColor: '#FF2D55' }]}>
                    <Ionicons name="play-outline" size={24} color="#FFF" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleMenu}
        style={[styles.fab, isOpen && styles.fabOpened]}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="add" size={32} color="#FFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: I18nManager.isRTL ? undefined : 20,
    left: I18nManager.isRTL ? 20 : undefined,
    zIndex: 999,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabOpened: {
    backgroundColor: '#333',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: I18nManager.isRTL ? 'flex-start' : 'flex-end',
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  menuContainer: {
    width: '100%',
    alignItems: I18nManager.isRTL ? 'flex-start' : 'flex-end',
  },
  actionsWrapper: {
    marginBottom: 20,
    alignItems: I18nManager.isRTL ? 'flex-start' : 'flex-end',
  },
  actionButton: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'right',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default FloatingActionButton;