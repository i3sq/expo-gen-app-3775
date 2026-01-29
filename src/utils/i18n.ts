import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';

/**
 * Translation resources for the application.
 * Covers Home, Details, Modals, and Settings.
 */
const resources = {
  en: {
    translation: {
      common: {
        save: 'Save',
        cancel: 'Cancel',
        add: 'Add',
        delete: 'Delete',
        edit: 'Edit',
        loading: 'Loading...',
        error: 'An error occurred',
      },
      home: {
        title: 'Anime Library',
        emptyState: 'No anime found. Tap the + button to add one!',
        searchPlaceholder: 'Search anime...',
      },
      detail: {
        seasons: 'Seasons',
        episodes: 'Episodes',
        noEpisodes: 'No episodes available for this season.',
        play: 'Play',
        description: 'Description',
      },
      modals: {
        addAnime: {
          title: 'Add New Anime',
          nameLabel: 'Anime Name',
          descriptionLabel: 'Description (Arabic)',
          imageLabel: 'Cover Image URL',
          placeholderName: 'e.g. One Piece',
          placeholderDesc: 'أدخل وصف الأنمي هنا...',
          placeholderImage: 'https://example.com/image.jpg',
        },
        addSeason: {
          title: 'Add Season',
          selectAnime: 'Select Anime',
          seasonNumber: 'Season Number',
        },
        addEpisode: {
          title: 'Add Episode',
          selectSeason: 'Select Season',
          episodeTitle: 'Episode Title',
          videoUrl: 'Video Link (HLS/MP4)',
          placeholderTitle: 'e.g. Episode 1',
        },
      },
      settings: {
        title: 'Settings',
        language: 'Language',
        darkMode: 'Dark Mode',
        rtlSupport: 'RTL Layout',
        about: 'About App',
        version: 'Version 1.0.0',
        clearData: 'Clear All Data',
        confirmClear: 'Are you sure you want to clear all your collection?',
      },
    },
  },
  ar: {
    translation: {
      common: {
        save: 'حفظ',
        cancel: 'إلغاء',
        add: 'إضافة',
        delete: 'حذف',
        edit: 'تعديل',
        loading: 'جاري التحميل...',
        error: 'حدث خطأ ما',
      },
      home: {
        title: 'مكتبة الأنمي',
        emptyState: 'لا يوجد أنمي. اضغط على زر + للإضافة!',
        searchPlaceholder: 'بحث عن أنمي...',
      },
      detail: {
        seasons: 'المواسم',
        episodes: 'الحلقات',
        noEpisodes: 'لا توجد حلقات متاحة لهذا الموسم.',
        play: 'تشغيل',
        description: 'الوصف',
      },
      modals: {
        addAnime: {
          title: 'إضافة أنمي جديد',
          nameLabel: 'اسم الأنمي',
          descriptionLabel: 'الوصف (بالعربية)',
          imageLabel: 'رابط صورة الغلاف',
          placeholderName: 'مثال: ون بيس',
          placeholderDesc: 'أدخل وصف الأنمي هنا...',
          placeholderImage: 'https://example.com/image.jpg',
        },
        addSeason: {
          title: 'إضافة موسم',
          selectAnime: 'اختر الأنمي',
          seasonNumber: 'رقم الموسم',
        },
        addEpisode: {
          title: 'إضافة حلقة',
          selectSeason: 'اختر الموسم',
          episodeTitle: 'عنوان الحلقة',
          videoUrl: 'رابط الفيديو (HLS/MP4)',
          placeholderTitle: 'مثال: الحلقة 1',
        },
      },
      settings: {
        title: 'الإعدادات',
        language: 'اللغة',
        darkMode: 'الوضع الليلي',
        rtlSupport: 'دعم من اليمين لليسار',
        about: 'حول التطبيق',
        version: 'الإصدار 1.0.0',
        clearData: 'مسح جميع البيانات',
        confirmClear: 'هل أنت متأكد من مسح جميع بيانات مجموعتك؟',
      },
    },
  },
};

/**
 * Detection logic to determine the initial language.
 * Defaults to device language if supported, otherwise English.
 */
const getInitialLanguage = (): string => {
  const deviceLanguage = Localization.getLocales()[0].languageCode;
  return deviceLanguage === 'ar' ? 'ar' : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

/**
 * Utility to toggle application language and handle RTL layouts.
 * Note: Changing RTL usually requires a native app reload in React Native.
 */
export const changeLanguage = (lng: 'en' | 'ar') => {
  i18n.changeLanguage(lng);
  
  const isRTL = lng === 'ar';
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    // In production, you might want to trigger a code-push restart or native reload
  }
};

export default i18n;