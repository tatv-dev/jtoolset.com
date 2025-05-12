// src/components/ui/MobileAds.jsx
import { AdUnit } from '@/lib/ads';
import { ADSENSE_CONFIG } from '@/lib/ads';

export default function MobileAds({ position = 'top' }) {
  // Kiểm tra xem đã cấu hình AdSense chưa
  if (!ADSENSE_CONFIG.CLIENT_ID || 
      ADSENSE_CONFIG.CLIENT_ID === 'ca-pub-XXXXXXXXXX') {
    return null;
  }

  const adSlots = {
    top: ADSENSE_CONFIG.AD_SLOTS.MOBILE_TOP,
    middle: ADSENSE_CONFIG.AD_SLOTS.MOBILE_MIDDLE,
    bottom: ADSENSE_CONFIG.AD_SLOTS.MOBILE_BOTTOM
  };

  return (
    <div className="xl:hidden w-full my-6">
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
        {/* <AdUnit 
          slot={adSlots[position]}
          format="horizontal"
          responsive={true}
          className="min-h-[100px]"
        /> */}
      </div>
    </div>
  );
}