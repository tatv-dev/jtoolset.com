import { useState, useEffect } from 'react';
import { Sun, Moon, MonitorSmartphone, Globe } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function ModePicker() {
  const { theme, setTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest('.mode-picker-container') === null) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mode-picker-container relative">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Toggle settings"
      >
        <Globe size={20} />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-2">
            <div className="pb-2 mb-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                {t('header.theme.title')}
              </p>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => {
                    setTheme('light');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-md flex flex-col items-center justify-center ${
                    theme === 'light' 
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={t('header.theme.light')}
                >
                  <Sun size={16} />
                  <span className="text-xs mt-1">{t('header.theme.light')}</span>
                </button>
                <button
                  onClick={() => {
                    setTheme('dark');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-md flex flex-col items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={t('header.theme.dark')}
                >
                  <Moon size={16} />
                  <span className="text-xs mt-1">{t('header.theme.dark')}</span>
                </button>
                <button
                  onClick={() => {
                    setTheme('system');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-md flex flex-col items-center justify-center ${
                    theme === 'system' 
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={t('header.theme.system')}
                >
                  <MonitorSmartphone size={16} />
                  <span className="text-xs mt-1">{t('header.theme.system')}</span>
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                {t('common.language')}
              </p>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => {
                    changeLanguage('en');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-md flex items-center justify-center ${
                    language === 'en' 
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-sm">English</span>
                </button>
                <button
                  onClick={() => {
                    changeLanguage('vi');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-md flex items-center justify-center ${
                    language === 'vi' 
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-sm">Tiếng Việt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}