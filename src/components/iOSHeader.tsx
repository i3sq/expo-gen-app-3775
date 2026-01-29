import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IOSHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  transparent?: boolean;
}

/**
 * IOSHeader Component
 * 
 * A header component designed to mimic the iOS native navigation bar style.
 * Renamed from iOSHeader to IOSHeader to comply with React Hook naming conventions.
 */
const IOSHeader: React.FC<IOSHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightElement,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();
  const isRTL = I18nManager.isRTL;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        transparent ? styles.transparent : styles.withBackground,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSlot}>
          {showBackButton && (
            <TouchableOpacity
              onPress={onBackPress}
              activeOpacity={0.7}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isRTL ? 'chevron-forward' : 'chevron-back'}
                size={28}
                color="#007AFF"
              />
              <Text style={styles.backText}>{isRTL ? 'رجوع' : 'Back'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>

        <View style={styles.rightSlot}>
          {rightElement ? rightElement : <View style={{ width: 44 }} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 100,
  },
  withBackground: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  content: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  leftSlot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSlot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
    marginLeft: Platform.OS === 'ios' ? -4 : 0,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default IOSHeader;