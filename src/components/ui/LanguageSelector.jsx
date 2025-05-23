// src/components/ui/LanguageSelector.jsx
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <Globe size={18} className="text-gray-500 dark:text-gray-400" />
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent border-none focus:ring-0 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
        aria-label={t('common.language')}
      >
        <option value="en" className='dark:bg-primary-900'>English</option>
        <option value="vi" className='dark:bg-primary-900'>Tiếng Việt</option>
        <option value="ja" className='dark:bg-primary-900'>日本語</option>
        <option value="ko" className='dark:bg-primary-900'>한국어</option>
      </select>
    </div>
  );
}