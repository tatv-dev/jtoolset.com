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

  // Chọn logo dựa trên theme
  const logoSrc = theme === 'dark' 
    ? '/logo-dark.png' 
    : (theme === 'light' 
      ? '/logo-light.png' 
      : '/logo-system.png');

  return (
    <header className="hidden md:block bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border flex-shrink-0 z-10 h-16">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-full items-center">
          {/* Logo and Quick Links */}
          <div className="flex items-center">
            <Link to="/" className="items-center pb-1 space-x-2 hidden lg:flex mr-4">
              <img 
                src={logoSrc}
                alt="JToolset Logo" 
                className="h-12 w-36"
              />
            </Link>
            
            {/* Quick Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              {/* <Link to="/" className="hidden xl:flex text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                {t('pages.pageList.home')}
              </Link> */}
              <Link to="/tools" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                {t('pages.pageList.tools')}
              </Link>
              <Link to="/about" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                {t('pages.pageList.about')}
              </Link>
              <Link to="/contact" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                {t('pages.pageList.contact')}
              </Link>
            </nav>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6 ml-4">
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
    </header>
  );
}