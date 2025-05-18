// src/components/ui/ModernMobileAd.jsx
import { useState, useEffect } from 'react';
import { AdUnit } from '@/lib/ads';
import { ADSENSE_CONFIG } from '@/lib/ads';
import { X } from 'lucide-react';

export default function ModernMobileAd({ position = 'top' }) {
  const [dismissed, setDismissed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Check if we're client-side
    setIsClient(true);
    
    // Check if this ad was previously dismissed
    const wasDismissed = localStorage.getItem(`mobile-ad-dismissed-${position}`);
    if (wasDismissed === 'true') {
      setDismissed(true);
    }
  }, [position]);

  // If no AdSense config or dismissed, don't show
  if (!ADSENSE_CONFIG.CLIENT_ID || 
      ADSENSE_CONFIG.CLIENT_ID === 'ca-pub-XXXXXXXXXX' || 
      dismissed) {
    return null;
  }

  const dismissAd = () => {
    setDismissed(true);
    localStorage.setItem(`mobile-ad-dismissed-${position}`, 'true');
  };

  // Determine which ad slot to use
  const adSlots = {
    top: ADSENSE_CONFIG.AD_SLOTS.MOBILE_TOP,
    middle: ADSENSE_CONFIG.AD_SLOTS.MOBILE_MIDDLE,
    bottom: ADSENSE_CONFIG.AD_SLOTS.MOBILE_BOTTOM
  };

  return (
    <div className="md:hidden w-full my-4">
      <div className="relative bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-2 overflow-hidden">
        {/* Dismiss button */}
        <button
          onClick={dismissAd}
          className="absolute top-1 right-1 p-1 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm z-10"
          aria-label="Dismiss ad"
        >
          <X size={12} />
        </button>

        {/* AdSense Unit */}
        {isClient && (
          <div className="pt-1">
            <AdUnit 
              slot={adSlots[position]}
              format="horizontal"
              responsive={true}
              className="min-h-[100px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}