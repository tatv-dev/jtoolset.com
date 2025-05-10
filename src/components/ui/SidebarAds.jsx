// src/components/ui/SidebarAds.jsx
import { AdUnit } from '@/lib/ads';

export default function SidebarAds() {
  // Các slot khác nhau cho các vị trí quảng cáo
  const adSlots = {
    top: 'ca-pub-XXXXXXXXXX-SLOT1',
    middle: 'ca-pub-XXXXXXXXXX-SLOT2',
    bottom: 'ca-pub-XXXXXXXXXX-SLOT3'
  };

  return (
    <div className="hidden xl:block w-80 flex-shrink-0">
      <div className="sticky top-20 space-y-6">
        {/* Top Ad */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
            Advertisement
          </div>
          <AdUnit 
            slot={adSlots.top}
            format="vertical"
            responsive={true}
            className="min-h-[250px]"
          />
        </div>

        {/* Middle Ad - Large Rectangle */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
            Advertisement
          </div>
          <AdUnit 
            slot={adSlots.middle}
            format="rectangle"
            responsive={true}
            className="min-h-[250px]"
          />
        </div>

        {/* Bottom Ad - Skyscraper */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
            Sponsored
          </div>
          <AdUnit 
            slot={adSlots.bottom}
            format="vertical"
            responsive={true}
            className="min-h-[600px]"
          />
        </div>
      </div>
    </div>
  );
}