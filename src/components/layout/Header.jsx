// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Menu, X, Sun, Moon, MonitorSmartphone, Wrench } from 'lucide-react';
import HeaderSearchBar from '@/components/ui/HeaderSearchBar';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border flex-shrink-0 z-10 h-16">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-full items-center">
          {/* Logo and Quick Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="JToolset Logo" 
                className="h-12"
              />
            </Link>
            
            {/* Quick Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                {t('pages.pageList.home')}
              </Link>
              <Link to="/tools" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                {t('pages.pageList.tools')}
              </Link>
              <Link to="/about" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                {t('pages.pageList.about')}
              </Link>
              <Link to="/contact" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                {t('pages.pageList.contact')}
              </Link>
            </nav>
          </div>

          {/* Mobile menu toggle */}
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
        <div className="md:hidden bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border">
          <div className="px-4 pt-2 pb-3 space-y-3">
            {/* Mobile Quick Links */}
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('pages.pageList.home')}
              </Link>
              <Link 
                to="/tools" 
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('pages.pageList.tools')}
              </Link>
              <Link 
                to="/about" 
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('pages.pageList.about')}
              </Link>
            </nav>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <HeaderSearchBar className="w-full mb-3" /> 
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
        </div>
      )}
    </header>
  );
}