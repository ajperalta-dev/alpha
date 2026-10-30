import { createContext, useContext } from 'react';
import type { Language, ServiceItem, TeamProfile, CaseStudyItem } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  services: ServiceItem[];
  team: TeamProfile[];
  caseStudies: CaseStudyItem[];
}
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
