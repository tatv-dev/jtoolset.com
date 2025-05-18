// src/components/layout/Footer.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Coffee, Github, ExternalLink } from 'lucide-react';
import { AdUnit } from '@/lib/ads';
import { ADSENSE_CONFIG } from '@/lib/ads';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [showDonate, setShowDonate] = useState(false);

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Ad Banner */}
        {/* {ADSENSE_CONFIG.CLIENT_ID && ADSENSE_CONFIG.CLIENT_ID !== 'ca-pub-XXXXXXXXXX' && (
          <div className="mb-8 py-2 flex justify-center">
            <AdUnit 
              slot={ADSENSE_CONFIG.AD_SLOTS.FOOTER_HORIZONTAL}
              format="horizontal"
              responsive={true}
              className="min-h-[90px]"
            />
          </div>
        )} */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              {t('app.name')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('common.desc')}
            </p>
            
            <div className="flex items-center space-x-4 mt-4">
              <button 
                onClick={() => setShowDonate(!showDonate)}
                className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <Heart size={16} className="mr-1" />
                <span>{t('common.support')}</span>
              </button>
              
              <a 
                href="https://github.com/tatv-dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <Github size={16} className="mr-1" />
                <span>GitHub</span>
              </a>
            </div>
            
            {/* Donate options */}
            {showDonate && (
              <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm animate-fade-in">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.donateText', 'If you find our tools helpful, consider buying us a coffee!')}
                </p>
                <a 
                  href="/donate.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <Coffee size={14} className="mr-1" />
                  <span>Donate</span>
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </div>
            )}
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t('common.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/about', label: 'About' },
                { path: '/contact', label: 'Contact' },
              ].map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {t(`pages.pageList.${item.label.toLowerCase()}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t('common.legalInfo')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy-policy"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {t('pages.privacyPolicy.title')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {t('common.termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} JToolset. {t('common.allRightsReserved')}
          </p>
          <div className="mt-4 md:mt-0">
            
          </div>
        </div>
      </div>
    </footer>
  );
}