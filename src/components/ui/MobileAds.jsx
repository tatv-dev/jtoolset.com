// src/components/ui/MobileAds.jsx
import { AdUnit } from '@/lib/ads';

export default function MobileAds({ position = 'top' }) {
  const adSlots = {
    top: 'ca-pub-XXXXXXXXXX-MOBILE-TOP',
    middle: 'ca-pub-XXXXXXXXXX-MOBILE-MIDDLE',
    bottom: 'ca-pub-XXXXXXXXXX-MOBILE-BOTTOM'
  };

  return (
    <div className="xl:hidden w-full my-6">
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
          Advertisement
        </div>
        <AdUnit 
          slot={adSlots[position]}
          format="horizontal"
          responsive={true}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}