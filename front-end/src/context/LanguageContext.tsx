import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import { translations, type Lang, type TranslationKey } from '@/lib/translations';

const STORAGE_KEY = 'invoice-lang';

function getInitialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'es' || stored === 'pt') return stored;
  const browser = navigator.language.slice(0, 2).toLowerCase();
  if (browser === 'es') return 'es';
  if (browser === 'pt') return 'pt';
  return 'en';
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => translations[lang][key] ?? translations.en[key] ?? key,
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
