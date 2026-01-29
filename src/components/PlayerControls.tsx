import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  title: string;
  isVisible: boolean;
  onPlayPause: () => void;
  onSeek: (value: number) => void;
  onSlidingStart: () => void;
  onSlidingComplete: (value: number) => void;
  onRewind: () => void;
  onForward: () => void;
  onToggleFullScreen: () => void;
  isFullScreen: boolean;
  onBack: () => void;
}

const { width } = Dimensions.get('window');

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  title,
  isVisible,
  onPlayPause,
  onSeek,
  onSlidingStart,
  onSlidingComplete,
  onRewind,
  onForward,
  onToggleFullScreen,
  isFullScreen,
  onBack,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, fadeAnim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { opacity: fadeAnim },
        isFullScreen && styles.fullScreenContainer
      ]}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={{ width: 40 }} /> 
      </View>

      {/* Center Controls */}
      <View style={styles.centerControls}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onRewind}>
          <Ionicons name="play-back" size={32} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playPauseButton} onPress={onPlayPause}>
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={42} 
            color="#FFF" 
            style={!isPlaying ? { marginLeft: 5 } : undefined}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onForward}>
          <Ionicons name="play-forward" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.sliderRow}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onValueChange={onSeek}
            onSlidingStart={onSlidingStart}
            onSlidingComplete={onSlidingComplete}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
            thumbTintColor="#007AFF"
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.iconButton} onPress={onToggleFullScreen}>
            <Ionicons 
              name={isFullScreen ? "contract-outline" : "expand-outline"} 
              size={24} 
              color="#FFF" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'space-between',
    paddingVertical: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  fullScreenContainer: {
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButton: {
    padding: 10,
  },
  bottomControls: {
    width: '100%',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  timeText: {
    color: '#FFF',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    minWidth: 40,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
});

export default PlayerControls;