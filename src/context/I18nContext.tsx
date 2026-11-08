import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  translations,
  TranslationKey,
} from '../i18n/translations';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;
  languages: typeof SUPPORTED_LANGUAGES;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'chronos_lang_pref_v1';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY) as SupportedLanguage;
    if (saved && ['en', 'nl', 'de', 'fr', 'es'].includes(saved)) {
      return saved;
    }
    // Default is strictly English as requested by user
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_LANG_KEY, lang);
  };

  // Sync HTML lang attribute, title, and SEO meta tags when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    const currentTranslations = translations[language] || translations.en;
    
    // Update Document Title
    document.title = currentTranslations.appTitle;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', currentTranslations.appDescription);
    }

    // Update OpenGraph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', currentTranslations.appTitle);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', currentTranslations.appDescription);
    }

    // Update OpenGraph Locale
    const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale && currentLangObj) {
      ogLocale.setAttribute('content', currentLangObj.locale);
    }

    // Update Twitter Title & Description
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) {
      twTitle.setAttribute('content', currentTranslations.appTitle);
    }
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) {
      twDesc.setAttribute('content', currentTranslations.appDescription);
    }
  }, [language]);

  const t = (key: TranslationKey): string => {
    const langDict = translations[language] || translations.en;
    return (langDict as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
