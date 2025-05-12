// src/pages/ContactPage.jsx
import { Mail, Github } from 'lucide-react';
import Card from '../components/ui/Card';
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('pages.contact.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('pages.contact.subtitle')}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card 
          title={t('pages.contact.contactDetails')}
          icon={Mail}
        >
          <div className="prose dark:prose-invert text-center">
            <p>{t('pages.contact.description')}</p>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('pages.contact.emailLabel')}
                </h3>
                <a 
                  href="mailto:trinhvanta1804@gmail.com" 
                  className="text-2xl text-primary-600 hover:text-primary-700 dark:hover:text-primary-500 transition-colors"
                >
                  trinhvanta1804@gmail.com
                </a>
              </div>

              <div className="flex items-center space-x-4">
                <a 
                  href="https://github.com/tatv-dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                >
                  <Github className="mr-2" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="prose dark:prose-invert text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('pages.contact.responseTime')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}