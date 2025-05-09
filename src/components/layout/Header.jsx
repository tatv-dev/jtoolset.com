// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Menu, X, Sun, Moon, MonitorSmartphone } from 'lucide-react';
import HeaderSearchBar from '@/components/ui/HeaderSearchBar';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400 md:hidden">
                {t('app.name')}
              </Link>
            </div>
          </div>

          {/* Mobile search and nav toggle */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <HeaderSearchBar className="w-64" /> 
            <LanguageSelector />
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-md ${
                  theme === 'light' 
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                title={t('header.theme.light')}
              >
                <Sun size={20} />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-md ${
                  theme === 'dark' 
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                title={t('header.theme.dark')}
              >
                <Moon size={20} />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-2 rounded-md ${
                  theme === 'system' 
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                title={t('header.theme.system')}
              >
                <MonitorSmartphone size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3">
            <HeaderSearchBar className="w-full" /> 
            <div className="flex justify-between items-center">
              <LanguageSelector />
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setTheme('light');
                    setIsMenuOpen(false);
                  }}
                  className={`p-2 rounded-md ${
                    theme === 'light' 
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Sun size={20} />
                </button>
                <button
                  onClick={() => {
                    setTheme('dark');
                    setIsMenuOpen(false);
                  }}
                  className={`p-2 rounded-md ${
                    theme === 'dark' 
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Moon size={20} />
                </button>
                <button
                  onClick={() => {
                    setTheme('system');
                    setIsMenuOpen(false);
                  }}
                  className={`p-2 rounded-md ${
                    theme === 'system' 
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <MonitorSmartphone size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}