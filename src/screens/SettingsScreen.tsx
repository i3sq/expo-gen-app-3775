import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Share,
  I18nManager,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';

// Assuming these hooks exist based on the file structure provided
// If context isn't fully set up yet, these provide a template for the actual implementation
import { useSettings } from '../context/SettingsContext';
import { useRTL } from '../hooks/useRTL';

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  isLast?: boolean;
  color?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  value,
  onPress,
  showSwitch,
  switchValue,
  onSwitchChange,
  isLast,
  color = '#007AFF',
}) => {
  const { isRTL } = useRTL();

  return (
    <TouchableOpacity
      style={[styles.row, isLast && styles.noBorder, isRTL ? styles.rowRTL : styles.rowLTR]}
      onPress={onPress}
      disabled={showSwitch}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }, isRTL ? styles.iconMarginRTL : styles.iconMarginLTR]}>
        <Ionicons name={icon} size={20} color="#FFF" />
      </View>
      <View style={[styles.rowContent, isRTL ? styles.rowContentRTL : styles.rowContentLTR]}>
        <Text style={[styles.rowTitle, isRTL ? styles.textRight : styles.textLeft]}>{title}</Text>
        <View style={[styles.rowRight, isRTL ? styles.rowRightRTL : styles.rowRightLTR]}>
          {value && <Text style={styles.rowValue}>{value}</Text>}
          {showSwitch ? (
            <Switch
              value={switchValue}
              onValueChange={onSwitchChange}
              trackColor={{ false: '#D1D1D6', true: '#34C759' }}
              ios_backgroundColor="#D1D1D6"
            />
          ) : (
            <Ionicons
              name={isRTL ? 'chevron-back' : 'chevron-forward'}
              size={18}
              color="#C7C7CC"
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SettingsScreen: React.FC = () => {
  const { isRTL } = useRTL();
  const { 
    isDarkMode, 
    toggleDarkMode, 
    notificationsEnabled, 
    setNotificationsEnabled,
    autoPlay,
    setAutoPlay 
  } = useSettings();

  const handleToggleRTL = async () => {
    Alert.alert(
      isRTL ? 'تغيير اللغة' : 'Change Language',
      isRTL 
        ? 'سيتم إعادة تشغيل التطبيق لتطبيق التغييرات.' 
        : 'The app will restart to apply changes.',
      [
        { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isRTL ? 'موافق' : 'OK',
          onPress: async () => {
            const nextRTL = !I18nManager.isRTL;
            I18nManager.allowRTL(nextRTL);
            I18nManager.forceRTL(nextRTL);
            await Updates.reloadAsync();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      isRTL ? 'مسح التخزين المؤقت' : 'Clear Cache',
      isRTL ? 'هل أنت متأكد من مسح جميع الملفات المؤقتة؟' : 'Are you sure you want to clear all temporary files?',
      [
        { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { 
          text: isRTL ? 'مسح' : 'Clear', 
          style: 'destructive', 
          onPress: () => Alert.alert(isRTL ? 'تم المسح بنجاح' : 'Cache cleared successfully') 
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: isRTL 
          ? 'تحقق من تطبيق مكتبة الأنمي الخاص بي! تطبيق رائع لمتابعة الأنمي المفضل لديك.'
          : 'Check out my Anime Library app! A great way to track your favorite anime.',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => 
      Alert.alert(isRTL ? 'خطأ' : 'Error', isRTL ? 'لا يمكن فتح الرابط حالياً' : 'Cannot open link right now')
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <Text style={[styles.headerTitle, isDarkMode && styles.textWhite, isRTL ? styles.textRight : styles.textLeft]}>
          {isRTL ? 'الإعدادات' : 'Settings'}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL ? styles.textRight : styles.textLeft]}>
            {isRTL ? 'تفضيلات العرض' : 'Display Preferences'}
          </Text>
          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <SettingRow
              icon="moon"
              title={isRTL ? "الوضع الليلي" : "Dark Mode"}
              showSwitch
              switchValue={isDarkMode}
              onSwitchChange={toggleDarkMode}
              color="#5856D6"
            />
            <SettingRow
              icon="language"
              title={isRTL ? "تغيير اتجاه اللغة (RTL/LTR)" : "Toggle Language Direction"}
              onPress={handleToggleRTL}
              color="#007AFF"
            />
            <SettingRow
              icon="play-circle"
              title={isRTL ? "التشغيل التلقائي" : "Auto Play"}
              showSwitch
              switchValue={autoPlay}
              onSwitchChange={setAutoPlay}
              isLast
              color="#FF9500"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL ? styles.textRight : styles.textLeft]}>
            {isRTL ? 'التنبيهات والمكتبة' : 'Notifications & Library'}
          </Text>
          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <SettingRow
              icon="notifications"
              title={isRTL ? "تنبيهات الحلقات الجديدة" : "New Episode Notifications"}
              showSwitch
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
              color="#FF3B30"
            />
            <SettingRow
              icon="trash-outline"
              title={isRTL ? "مسح التخزين المؤقت" : "Clear Cache"}
              value="124 MB"
              onPress={handleClearCache}
              isLast
              color="#8E8E93"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL ? styles.textRight : styles.textLeft]}>
            {isRTL ? 'حول التطبيق' : 'About App'}
          </Text>
          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <SettingRow
              icon="share-social"
              title={isRTL ? "مشاركة التطبيق" : "Share App"}
              onPress={handleShare}
              color="#34C759"
            />
            <SettingRow
              icon="star"
              title={isRTL ? "تقييم التطبيق" : "Rate App"}
              onPress={() => openLink('https://apps.apple.com')}
              color="#FFCC00"
            />
            <SettingRow
              icon="shield-checkmark"
              title={isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
              onPress={() => openLink('https://example.com/privacy')}
              color="#5AC8FA"
            />
            <SettingRow
              icon="information-circle"
              title={isRTL ? "إصدار التطبيق" : "App Version"}
              value="1.0.0"
              isLast
              color="#AF52DE"
            />
          </View>
        </View>

        <TouchableOpacity 
            style={[styles.logoutButton, isDarkMode && styles.cardDark]}
            onPress={() => Alert.alert(isRTL ? 'خروج' : 'Logout', isRTL ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully')}
        >
          <Text style={styles.logoutText}>{isRTL ? 'تسجيل الخروج' : 'Logout'}</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          {isRTL ? 'صنع بكل حب لمحبي الأنمي ❤️' : 'Made with love for Anime fans ❤️'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerDark: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#2C2C2E',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
  },
  textWhite: {
    color: '#FFF',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    marginHorizontal: 10,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardDark: {
    backgroundColor: '#1C1C1E',
  },
  row: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },
  rowLTR: {
    flexDirection: 'row',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconMarginRTL: {
    marginLeft: 0,
    marginRight: 0,
    marginLeft: 12,
  },
  iconMarginLTR: {
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContentRTL: {
    flexDirection: 'row-reverse',
  },
  rowContentLTR: {
    flexDirection: 'row',
  },
  rowTitle: {
    fontSize: 17,
    color: '#000',
  },
  rowRight: {
    alignItems: 'center',
  },
  rowRightRTL: {
    flexDirection: 'row-reverse',
  },
  rowRightLTR: {
    flexDirection: 'row',
  },
  rowValue: {
    fontSize: 17,
    color: '#8E8E93',
    marginHorizontal: 8,
  },
  logoutButton: {
    marginTop: 35,
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 17,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#8E8E93',
    fontSize: 13,
  },
});

export default SettingsScreen;