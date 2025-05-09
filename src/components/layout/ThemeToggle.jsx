// src/components/layout/ThemeToggle.jsx
'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, MonitorSmartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('sidebar.theme')}
      </span>
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' && <Sun size={18} className="text-amber-500" />}
        {theme === 'dark' && <Moon size={18} className="text-indigo-400" />}
        {theme === 'system' && <MonitorSmartphone size={18} className="text-gray-500 dark:text-gray-400" />}
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {theme === 'light' 
            ? t('header.theme.light') 
            : theme === 'dark' 
              ? t('header.theme.dark') 
              : t('header.theme.system')}
        </span>
      </button>
    </div>
  );
}