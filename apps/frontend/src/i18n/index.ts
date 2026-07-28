import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './locales/pt.json';
import enUS from './locales/en-US.json';

export const SUPPORTED_LANGUAGES = ['pt', 'en-US'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = 'language';

function isAppLanguage(value: string | null): value is AppLanguage {
  return value === 'pt' || value === 'en-US';
}

function getInitialLanguage(): AppLanguage {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isAppLanguage(stored)) return stored;
  return 'pt';
}

const initialLanguage = getInitialLanguage();

void i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    'en-US': { translation: enUS },
  },
  lng: initialLanguage,
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
});

document.documentElement.lang = initialLanguage;

export function setAppLanguage(lng: AppLanguage) {
  localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.lang = lng;
  void i18n.changeLanguage(lng);
}

export default i18n;
