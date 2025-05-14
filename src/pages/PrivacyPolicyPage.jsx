// src/pages/PrivacyPolicyPage.jsx
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('pages.privacyPolicy.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('pages.privacyPolicy.subtitle')}
        </p>
      </div>

      <Card 
        title={t('pages.privacyPolicy.overview.title')}
        icon={ShieldCheck}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p>{t('pages.privacyPolicy.overview.description')}</p>
        </div>
      </Card>

      <Card 
        title={t('pages.privacyPolicy.dataCollection.title')}
      >
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('pages.privacyPolicy.dataCollection.subtitle')}</h3>
          <ul>
            {[1, 2, 3, 4].map((num) => (
              <li key={num}>{t(`pages.privacyPolicy.dataCollection.point${num}`)}</li>
            ))}
          </ul>
        </div>
      </Card>

      <Card 
        title={t('pages.privacyPolicy.cookies.title')}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p>{t('pages.privacyPolicy.cookies.description')}</p>
          <ul>
            {[1, 2, 3].map((num) => (
              <li key={num}>{t(`pages.privacyPolicy.cookies.point${num}`)}</li>
            ))}
          </ul>
        </div>
      </Card>

      <Card 
        title={t('pages.privacyPolicy.thirdParty.title')}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p>{t('pages.privacyPolicy.thirdParty.description')}</p>
          <ul>
            {['googleAnalytics', 'adSense', 'cloudServices'].map((service) => (
              <li key={service}>{t(`pages.privacyPolicy.thirdParty.${service}`)}</li>
            ))}
          </ul>
        </div>
      </Card>

      <Card 
        title={t('pages.privacyPolicy.userRights.title')}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p>{t('pages.privacyPolicy.userRights.description')}</p>
          <ul>
            {[1, 2, 3, 4].map((num) => (
              <li key={num}>{t(`pages.privacyPolicy.userRights.point${num}`)}</li>
            ))}
          </ul>
        </div>
      </Card>

      <Card 
        title={t('pages.privacyPolicy.contactInfo.title')}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p>{t('pages.privacyPolicy.contactInfo.description')}</p>
          <p>
            <strong>{t('pages.privacyPolicy.contactInfo.email')}</strong>: 
            <a href="mailto:contact@jtoolset.com" className="ml-2 text-primary-600 hover:underline">
              contact@jtoolset.com
            </a>
          </p>
        </div>
      </Card>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
        {t('pages.privacyPolicy.lastUpdated')}: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}