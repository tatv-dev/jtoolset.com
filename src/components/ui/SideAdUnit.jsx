// src/components/ui/SideAdUnit.jsx
import { useState, useEffect } from 'react';
import { AdUnit } from '@/lib/ads';
import { ADSENSE_CONFIG } from '@/lib/ads';
import { X, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SideAdUnit({ position = 'left', adSlot }) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Check if we're client-side
    setIsClient(true);
    
    // Check if this ad was previously dismissed
    const wasDismissed = localStorage.getItem(`ad-dismissed-${position}`);
    if (wasDismissed === 'true') {
      setDismissed(true);
    }
  }, [position]);

  // If no AdSense config or dismissed, don't show
  if (!ADSENSE_CONFIG.CLIENT_ID || 
      ADSENSE_CONFIG.CLIENT_ID === 'ca-pub-XXXXXXXXXX' || 
      !adSlot ||
      dismissed) {
    return null;
  }

  const dismissAd = () => {
    setDismissed(true);
    localStorage.setItem(`ad-dismissed-${position}`, 'true');
  };

  return (
    <div className={`hidden xl:block sticky top-24 ${position === 'left' ? 'mr-6' : 'ml-6'}`}>
      <div className="relative bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
        {/* Ad Controls */}
        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm"
            title={t('common.adInfo')}
          >
            <Info size={14} />
          </button>
          <button
            onClick={dismissAd}
            className="p-1 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm"
            title={t('common.dismissAd')}
          >
            <X size={14} />
          </button>
        </div>

        {/* Info tooltip */}
        {showInfo && (
          <div className="absolute top-10 right-2 w-48 p-2 bg-white dark:bg-gray-800 shadow-lg rounded-md text-xs text-gray-600 dark:text-gray-300 z-20">
            {t('common.adsHelp', 'Ads help us keep this service free for everyone.')}
          </div>
        )}

        {/* AdSense Placeholder */}
        <div className="w-64 flex items-center justify-center">
          {isClient ? (
            <AdUnit 
              slot={adSlot}
              format="vertical"
              responsive={true}
              className="min-h-[600px] w-64"
            />
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 w-full h-[600px] flex items-center justify-center text-gray-500">
              <p className="text-sm">Advertisement</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}