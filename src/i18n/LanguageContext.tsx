import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, Lang } from './translations';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations['ar'];
  dir: 'rtl' | 'ltr';
};

const LanguageContext = createContext<Ctx | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('souqi-lang') as Lang | null) : null;
    return stored ?? 'ar';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem('souqi-lang', lang);
  }, [lang, dir]);

  const setLang = (l: Lang) => setLangState(l);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
};
