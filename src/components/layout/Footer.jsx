// src/components/layout/Footer.jsx
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { AdUnit } from '@/lib/ads';
import { ADSENSE_CONFIG } from '@/lib/ads';

export default function Footer() { 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`hidden md:block fixed bottom-0 left-0 right-0 z-20 transition-transform duration-300 ${
      isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-0px)]'
    }`}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -top-10 left-72 transform -translate-x-1/2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-t-lg px-4 py-2 flex items-center space-x-2 shadow-lg"
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {/* Footer content */}
      <footer className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Ad placement */}
          <div className="text-center">
            {ADSENSE_CONFIG.CLIENT_ID && ADSENSE_CONFIG.CLIENT_ID !== 'ca-pub-XXXXXXXXXX' ? (
              <AdUnit 
                slot={ADSENSE_CONFIG.AD_SLOTS.TOOL_PAGE_BOTTOM}
                format="horizontal"
                responsive={true}
                className="min-h-[87px]"
              />
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">Ad space - 728x90</p>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}