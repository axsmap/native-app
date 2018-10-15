import i18n from 'i18next';
import Expo from 'expo';

import en from './locales/en';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: cb =>
    Expo.DangerZone.Localization.getCurrentLocaleAsync().then(lng => {
      cb(lng);
    }),
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n.use(languageDetector).init({
  fallbackLng: 'en',
  resources: {
    en,
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    }
  }
});

export default i18n;
