// src/components/ui/SidebarAds.jsx
import { AdUnit } from '@/lib/ads';
import { ADSENSE_CONFIG } from '@/lib/ads';

export default function SidebarAds() {
  // Kiểm tra xem đã cấu hình AdSense chưa
  if (!ADSENSE_CONFIG.CLIENT_ID || 
      ADSENSE_CONFIG.CLIENT_ID === 'ca-pub-XXXXXXXXXX') {
    return null;
  }

  return (
    <div className="hidden xl:block w-80 flex-shrink-0">
      <div className="sticky top-20 space-y-6">
        {/* Top Ad */}
        {/* <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
            Advertisement
          </div>
          <AdUnit 
            slot={ADSENSE_CONFIG.AD_SLOTS.SIDEBAR_TOP}
            format="vertical"
            responsive={true}
            className="min-h-[250px]"
          />
        </div> */}

        {/* Middle Ad - Large Rectangle */}
        {/* <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
            Advertisement
          </div>
          <AdUnit 
            slot={ADSENSE_CONFIG.AD_SLOTS.SIDEBAR_MIDDLE}
            format="rectangle"
            responsive={true}
            className="min-h-[250px]"
          />
        </div> */}

        {/* Bottom Ad - Skyscraper */}
        {/* <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
            Sponsored
          </div>
          <AdUnit 
            slot={ADSENSE_CONFIG.AD_SLOTS.SIDEBAR_BOTTOM}
            format="vertical"
            responsive={true}
            className="min-h-[600px]"
          />
        </div> */}
      </div>
    </div>
  );
}