'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/constants';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    setLanguage(saved);
  }, []);

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
