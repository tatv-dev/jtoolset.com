// src/context/LanguageContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Lấy ngôn ngữ từ localStorage nếu có
    const storedLanguage = localStorage.getItem('language');
    
    if (storedLanguage) {
      setLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    } else {
      // Kiểm tra ngôn ngữ trình duyệt
      const browserLang = navigator.language || navigator.userLanguage;
      const lang = browserLang.startsWith('vi') ? 'vi' : 'en';
      setLanguage(lang);
      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  // Thay đổi ngôn ngữ
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