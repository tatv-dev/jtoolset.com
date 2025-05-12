// src/pages/ContactPage.jsx
import { useState } from 'react';
import { Mail, Copy, Check } from 'lucide-react';
import Card from '../components/ui/Card';
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const emailAddress = "trinhvanta1804@gmail.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

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

      <div className="max-w-3xl mx-auto space-y-6">
        <Card 
          title={t('pages.contact.contactDetails')}
          icon={Mail}
          className="text-center" // Thêm lớp text-center vào Card
        >
          <div className="text-center"> {/* Đảm bảo nội dung được căn giữa */}
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {t('pages.contact.description')}
            </p>
            
            {/* Email Container */}
            <div className="w-full bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('pages.contact.emailLabel')}
              </h3>
              
              <div className="flex items-center justify-center flex-wrap gap-2">
                <a 
                  href={`mailto:${emailAddress}`}
                  className="text-xl sm:text-2xl font-medium text-primary-600 hover:text-primary-700 dark:hover:text-primary-500 transition-colors"
                >
                  {emailAddress}
                </a>
                
                <button
                  onClick={copyEmail}
                  className="ml-2 p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 bg-white dark:bg-gray-700 rounded-md transition-colors hover:shadow-sm"
                  aria-label="Copy email address"
                  title={copied ? t('common.copied') : t('common.copy')}
                >
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              
              {copied && (
                <div className="mt-3 text-green-600 dark:text-green-400 text-sm animate-pulse">
                  {t('common.copied')}!
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center"> {/* Căn giữa nội dung */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('pages.contact.responseTime')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}