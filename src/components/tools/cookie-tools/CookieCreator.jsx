// src/components/tools/cookie-tools/CookieCreator.jsx
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function CookieCreator() {
  const { t } = useTranslation();
  const [cookie, setCookie] = useState({
    name: '',
    value: '',
    domain: window.location.hostname,
    path: '/',
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    secure: false,
    httpOnly: false,
    sameSite: 'Lax'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCookie(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const createCookie = () => {
    try {
      const cookieString = `${cookie.name}=${encodeURIComponent(cookie.value)}; ` +
        `domain=${cookie.domain}; ` +
        `path=${cookie.path}; ` +
        `expires=${new Date(cookie.expires).toUTCString()}; ` +
        `${cookie.secure ? 'secure; ' : ''}` +
        `${cookie.httpOnly ? 'httpOnly; ' : ''}` +
        `sameSite=${cookie.sameSite}`;

      document.cookie = cookieString;
      alert(t('tools.cookie-tools.cookieCreated'));
    } catch (error) {
      alert(t('tools.cookie-tools.cookieCreateError'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.cookie-tools.cookieName')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={cookie.name}
            onChange={handleInputChange}
            placeholder={t('tools.cookie-tools.cookieNamePlaceholder')}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
        
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.cookie-tools.cookieValue')}
          </label>
          <input
            type="text"
            id="value"
            name="value"
            value={cookie.value}
            onChange={handleInputChange}
            placeholder={t('tools.cookie-tools.cookieValuePlaceholder')}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.cookie-tools.domain')}
          </label>
          <input
            type="text"
            id="domain"
            name="domain"
            value={cookie.domain}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
        
        <div>
          <label htmlFor="path" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.cookie-tools.path')}
          </label>
          <input
            type="text"
            id="path"
            name="path"
            value={cookie.path}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="expires" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.cookie-tools.expires')}
          </label>
          <input
            type="date"
            id="expires"
            name="expires"
            value={cookie.expires}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
        
        <div>
          <label htmlFor="sameSite" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.cookie-tools.sameSite')}
          </label>
          <select
            id="sameSite"
            name="sameSite"
            value={cookie.sameSite}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="Lax">Lax</option>
            <option value="Strict">Strict</option>
            <option value="None">None</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="secure"
            name="secure"
            checked={cookie.secure}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="secure" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            {t('tools.cookie-tools.secure')}
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="httpOnly"
            name="httpOnly"
            checked={cookie.httpOnly}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="httpOnly" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            {t('tools.cookie-tools.httpOnly')}
          </label>
        </div>
      </div>

      <div className="mt-4">
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={createCookie}
          className="w-full"
        >
          {t('tools.cookie-tools.createCookie')}
        </Button>
      </div>

      <div className="text-sm bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-md p-3 text-yellow-700 dark:text-yellow-500">
        <strong>{t('common.warning')}:</strong> {t('tools.cookie-tools.cookieWarning')}
      </div>
    </div>
  );
}