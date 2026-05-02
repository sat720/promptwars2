'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/constants';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    }
    return 'en';
  });

  const changeLanguage = (code) => {
    setLanguage(code);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, code);
    // Dispatch event for components that are not in context if any
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: code }));
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
