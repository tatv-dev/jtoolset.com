// src/components/tools/cookie-tools/CookiePolicyGenerator.jsx
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function CookiePolicyGenerator({ 
  policySettings, 
  setPolicySettings, 
  generateCookiePolicy 
}) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {t('tools.cookie-tools.policy.title')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="policy-company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.cookie-tools.policy.companyName')}
          </label>
          <input
            type="text"
            id="policy-company"
            value={policySettings.companyName}
            onChange={(e) => setPolicySettings({...policySettings, companyName: e.target.value})}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="policy-website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.cookie-tools.policy.websiteUrl')}
          </label>
          <input
            type="text"
            id="policy-website"
            value={policySettings.website}
            onChange={(e) => setPolicySettings({...policySettings, website: e.target.value})}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="policy-lifespan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.cookie-tools.policy.cookieLifespan')}
          </label>
          <input
            type="text"
            id="policy-lifespan"
            value={policySettings.cookieLifespan}
            onChange={(e) => setPolicySettings({...policySettings, cookieLifespan: e.target.value})}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="policy-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.cookie-tools.policy.lastUpdated')}
          </label>
          <input
            type="date"
            id="policy-date"
            value={policySettings.lastUpdated}
            onChange={(e) => setPolicySettings({...policySettings, lastUpdated: e.target.value})}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          {t('tools.cookie-tools.policy.cookieTypes')}
        </h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="policy-essential"
            checked={policySettings.usesEssential}
            onChange={(e) => setPolicySettings({...policySettings, usesEssential: e.target.checked})}
            className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
          />
          <label htmlFor="policy-essential" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            {t('tools.cookie-tools.policy.essential')}
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="policy-functional"
            checked={policySettings.usesFunctional}
            onChange={(e) => setPolicySettings({...policySettings, usesFunctional: e.target.checked})}
            className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
          />
          <label htmlFor="policy-functional" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            {t('tools.cookie-tools.policy.functional')}
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="policy-analytics"
            checked={policySettings.usesAnalytics}
            onChange={(e) => setPolicySettings({...policySettings, usesAnalytics: e.target.checked})}
            className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
          />
          <label htmlFor="policy-analytics" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            {t('tools.cookie-tools.policy.analytics')}
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="policy-marketing"
            checked={policySettings.usesMarketing}
            onChange={(e) => setPolicySettings({...policySettings, usesMarketing: e.target.checked})}
            className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
          />
          <label htmlFor="policy-marketing" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            {t('tools.cookie-tools.policy.marketing')}
          </label>
        </div>
      </div>
      
      <div className="pt-3">
        <Button
          variant="primary"
          onClick={generateCookiePolicy}
        >
          {t('tools.cookie-tools.policy.generateButton')}
        </Button>
      </div>
      
      <div className="text-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-md p-3 text-blue-700 dark:text-blue-500">
        <strong>{t('tools.cookie-tools.policy.disclaimer.title')}:</strong> {t('tools.cookie-tools.policy.disclaimer.text')}
      </div>
    </div>
  );
}