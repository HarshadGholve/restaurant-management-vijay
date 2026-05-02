import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'mr' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (mr: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');

  const toggleLang = () => setLang(prev => prev === 'mr' ? 'en' : 'mr');

  const t = (mr: string, en: string) => lang === 'mr' ? mr : en;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
};
