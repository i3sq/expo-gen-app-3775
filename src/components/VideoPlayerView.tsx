import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoPlayerViewProps {
  uri: string;
  title: string;
  onClose: () => void;
}

const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({ uri, title, onClose }) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set orientation to landscape when player opens
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    lockOrientation();

    return () => {
      // Revert orientation when component unmounts
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useEffect(() => {
    if (showControls) {
      resetControlsTimer();
    }
  }, [showControls]);

  const resetControlsTimer = () => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  };

  const toggleControls = () => {
    setShowControls((prev) => !prev);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = async () => {
    if (!videoRef.current || !status?.isLoaded) return;
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    resetControlsTimer();
  };

  const handleSeek = async (value: number) => {
    if (!videoRef.current || !status?.isLoaded) return;
    const seekPosition = value * status.durationMillis!;
    await videoRef.current.setPositionAsync(seekPosition);
    resetControlsTimer();
  };

  const handleSkipForward = async () => {
    if (!videoRef.current || !status?.isLoaded) return;
    const newPosition = status.positionMillis + 10000;
    await videoRef.current.setPositionAsync(Math.min(newPosition, status.durationMillis!));
    resetControlsTimer();
  };

  const handleSkipBackward = async () => {
    if (!videoRef.current || !status?.isLoaded) return;
    const newPosition = status.positionMillis - 10000;
    await videoRef.current.setPositionAsync(Math.max(newPosition, 0));
    resetControlsTimer();
  };

  const onPlaybackStatusUpdate = (newStatus: AVPlaybackStatus) => {
    setStatus(newStatus);
    if (newStatus.isLoaded) {
      setIsBuffering(newStatus.isBuffering);
    }
  };

  const isLoaded = status?.isLoaded;
  const progress = isLoaded && status.durationMillis ? status.positionMillis / status.durationMillis : 0;

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <TouchableWithoutFeedback onPress={toggleControls}>
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            source={{ uri }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            progressUpdateIntervalMillis={500}
          />

          {isBuffering && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}

          {showControls && (
            <View style={styles.overlay}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                  <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
                <View style={{ width: 40 }} />
              </View>

              {/* Center Controls */}
              <View style={styles.centerControls}>
                <TouchableOpacity onPress={handleSkipBackward} style={styles.controlButton}>
                  <Ionicons name="play-back" size={36} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
                  <Ionicons
                    name={isLoaded && status.isPlaying ? 'pause' : 'play'}
                    size={50}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSkipForward} style={styles.controlButton}>
                  <Ionicons name="play-forward" size={36} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Footer / Progress Bar */}
              <View style={styles.footer}>
                <Text style={styles.timeText}>
                  {isLoaded ? formatTime(status.positionMillis) : '0:00'}
                </Text>
                <Slider
                  style={styles.slider}
                  value={progress}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                  thumbTintColor="#FFFFFF"
                  onSlidingComplete={handleSeek}
                  onValueChange={() => {
                    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
                  }}
                />
                <Text style={styles.timeText}>
                  {isLoaded && status.durationMillis ? formatTime(status.durationMillis) : '0:00'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: Platform.OS === 'ios' ? 40 : 20,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerButton: {
    padding: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
  },
  controlButton: {
    padding: 10,
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontVariant: ['tabular-nums'],
    minWidth: 45,
    textAlign: 'center',
  },
});

export default VideoPlayerView;