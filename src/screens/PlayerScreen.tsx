import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  BackHandler,
  Platform,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'PlayerScreen'>;

const PlayerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<PlayerScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const { videoUrl, episodeTitle, animeTitle } = route.params;

  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatusSuccess | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const exitPlayer = useCallback(async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    navigation.goBack();
  }, [navigation]);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      // Only hide if video is playing
      if (status?.isPlaying) {
        setShowControls(false);
      }
    }, 4000);
  }, [status?.isPlaying]);

  useEffect(() => {
    const enableLandscape = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    enableLandscape();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      exitPlayer();
      return true;
    });

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      backHandler.remove();
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [exitPlayer]);

  const togglePlayPause = async () => {
    if (!videoRef.current || !status) return;
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    resetControlsTimer();
  };

  const handleSeek = async (value: number) => {
    if (!videoRef.current || !status?.durationMillis) return;
    const seekPosition = value * status.durationMillis;
    await videoRef.current.setPositionAsync(seekPosition);
    resetControlsTimer();
  };

  const skipForward = async () => {
    if (!videoRef.current || !status) return;
    const newPos = Math.min(status.positionMillis + 10000, status.durationMillis || 0);
    await videoRef.current.setPositionAsync(newPos);
    resetControlsTimer();
  };

  const skipBackward = async () => {
    if (!videoRef.current || !status) return;
    const newPos = Math.max(status.positionMillis - 10000, 0);
    await videoRef.current.setPositionAsync(newPos);
    resetControlsTimer();
  };

  const formatTime = (millis: number) => {
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleMainPress = () => {
    if (showControls) {
      setShowControls(false);
    } else {
      resetControlsTimer();
    }
  };

  const onPlaybackStatusUpdate = (s: AVPlaybackStatus) => {
    if (s.isLoaded) {
      setStatus(s);
      setIsBuffering(s.isBuffering);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        onLoadStart={() => setIsBuffering(true)}
      />

      <TouchableOpacity 
        activeOpacity={1} 
        style={styles.overlay} 
        onPress={handleMainPress}
      >
        {isBuffering && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#FF3B30" />
          </View>
        )}

        {showControls && (
          <View style={styles.controlsContainer}>
            {/* Header */}
            <View style={[
              styles.header, 
              { 
                paddingTop: Platform.OS === 'ios' ? Math.max(insets.top, 20) : 20, 
                paddingHorizontal: Math.max(insets.left, 20) 
              }
            ]}>
              <TouchableOpacity onPress={exitPlayer} style={styles.iconButton}>
                <Ionicons name="chevron-back" size={28} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.animeTitleText} numberOfLines={1}>{animeTitle}</Text>
                <Text style={styles.episodeTitleText} numberOfLines={1}>{episodeTitle}</Text>
              </View>
              <View style={{ width: 48 }} /> 
            </View>

            {/* Center Controls */}
            <View style={styles.centerControls}>
              <TouchableOpacity onPress={skipBackward} style={styles.iconButton}>
                <Ionicons name="play-back" size={36} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
                <Ionicons 
                  name={status?.isPlaying ? "pause" : "play"} 
                  size={50} 
                  color="#FFF" 
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={skipForward} style={styles.iconButton}>
                <Ionicons name="play-forward" size={36} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={[
              styles.footer, 
              { 
                paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : 20, 
                paddingHorizontal: Math.max(insets.left, 20) 
              }
            ]}>
              <Text style={styles.timeText}>
                {status ? formatTime(status.positionMillis) : '0:00'}
              </Text>
              
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={status && status.durationMillis ? status.positionMillis / status.durationMillis : 0}
                onSlidingComplete={handleSeek}
                minimumTrackTintColor="#FF3B30"
                maximumTrackTintColor="rgba(255,255,255,0.3)"
                thumbTintColor="#FF3B30"
              />

              <Text style={styles.timeText}>
                {status ? formatTime(status.durationMillis || 0) : '0:00'}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
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
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
  },
  centerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  animeTitleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  episodeTitleText: {
    color: '#DDD',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  iconButton: {
    padding: 10,
    minWidth: 48,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 15,
  },
  timeText: {
    color: '#FFF',
    fontSize: 14,
    fontVariant: ['tabular-nums'],
    minWidth: 45,
    textAlign: 'center',
  },
});

export default PlayerScreen;