'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Get language from localStorage if available
    const storedLanguage = localStorage.getItem('language');
    
    if (storedLanguage) {
      setLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    } else {
      // Check browser language
      const browserLang = navigator.language || navigator.userLanguage;
      
      // Updated language detection to include Japanese
      const lang = browserLang.startsWith('ja') ? 'ja' : 
                  browserLang.startsWith('vi') ? 'vi' : 'en';
      
      setLanguage(lang);
      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  // Change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}