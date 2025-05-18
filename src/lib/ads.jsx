// src/lib/ads.jsx
import { useState, useEffect, useRef } from 'react';
import Script from '@/components/ui/Script';

// AdSense configuration
export const ADSENSE_CONFIG = {
  CLIENT_ID: 'ca-pub-1107241811700935',
  AD_SLOTS: {
    // Sidebar Ads
    SIDEBAR_LEFT: '2824339385',
    SIDEBAR_RIGHT: '5935628003',
    
    // Mobile Ads
    MOBILE_TOP: '2568795300',
    MOBILE_MIDDLE: '1109379561',
    MOBILE_BOTTOM: '9454757535',
    
    // Tool Page Ads
    TOOL_PAGE_TOP: '1109379561',
    TOOL_PAGE_BOTTOM: '9454757535',
    
    // Header & Footer Ads
    HEADER_HORIZONTAL: '4648997888',
    FOOTER_HORIZONTAL: '6186893531'
  }
};

// Improved AdUnit component with better lifecycle management 
export function AdUnit({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '' 
}) {
  const adRef = useRef(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);
  const [adId] = useState(`ad-${Math.random().toString(36).substring(2, 9)}`);

  // Only proceed if we have valid configuration
  if (!ADSENSE_CONFIG.CLIENT_ID || 
      ADSENSE_CONFIG.CLIENT_ID === 'ca-pub-XXXXXXXXXX' || 
      !slot) {
    return null;
  }

  useEffect(() => {
    // Skip if already loaded or if we're not in the browser
    if (isAdLoaded || typeof window === 'undefined') return;
    
    // Check if adsbygoogle is available
    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
    }

    // Make sure the ad container has a size before attempting to load
    const loadAd = () => {
      try {
        if (adRef.current) {
          // Check if the ad container has dimensions
          const { offsetWidth, offsetHeight } = adRef.current;
          
          // Only load ad if the container has dimensions
          if (offsetWidth > 0) {
            // Define a push function that handles errors
            const push = () => {
              try {
                // Create a new adsbygoogle push for this specific ad
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                setIsAdLoaded(true);
              } catch (err) {
                console.error('AdSense push error:', err);
                setAdFailed(true);
              }
            };
            
            // Give time for the DOM to fully render
            setTimeout(push, 100);
          } else {
            // If container has no width, retry in a short time
            setTimeout(loadAd, 200);
          }
        }
      } catch (err) {
        console.error('AdSense error:', err);
        setAdFailed(true);
      }
    };

    // Start the ad loading process
    loadAd();

    // Cleanup function
    return () => {
      // Mark as unloaded when component unmounts
      setIsAdLoaded(false);
    };
  }, [slot, isAdLoaded]);

  // Render a placeholder if the ad fails
  if (adFailed) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs`} 
           style={{ minHeight: '100px' }}>
        Ad unavailable
      </div>
    );
  }

  return (
    <div className={className} style={{ minHeight: format === 'vertical' ? '250px' : '90px' }}>
      <ins
        id={adId}
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '100%',
          height: format === 'vertical' ? '600px' : '100%',
          overflow: 'hidden'
        }}
        data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// Modified mobile ad component with better dimensions
export function ModernMobileAd({ position = 'top' }) {
  const [dismissed, setDismissed] = useState(false);
  const adContainerRef = useRef(null);
  
  useEffect(() => {
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
    <div className="md:hidden w-full my-4" ref={adContainerRef}>
      <div className="relative bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-2 overflow-hidden">
        {/* Ad label for compliance */}
        <div className="text-xs text-gray-500 text-center mb-1">Advertisement</div>
        
        {/* Dismiss button */}
        <button
          onClick={dismissAd}
          className="absolute top-1 right-1 p-1 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm z-10"
          aria-label="Dismiss ad"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* AdSense Unit */}
        <div className="pt-1">
          <AdUnit 
            slot={adSlots[position]}
            format="horizontal"
            responsive={true}
            className="min-h-[100px] w-full"
          />
        </div>
      </div>
    </div>
  );
}

// Improved SideAdUnit component
export function SideAdUnit({ position = 'left', adSlot }) {
  const [dismissed, setDismissed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const adContainerRef = useRef(null);

  useEffect(() => {
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
    <div className={`hidden xl:block sticky top-24 ${position === 'left' ? 'mr-6' : 'ml-6'}`} ref={adContainerRef}>
      <div className="relative bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
        {/* Ad label for compliance */}
        <div className="text-xs text-gray-500 text-center pt-2">Advertisement</div>
        
        {/* Ad Controls */}
        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm"
            title="Ad Information"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
          <button
            onClick={dismissAd}
            className="p-1 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm"
            title="Dismiss Ad"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Info tooltip */}
        {showInfo && (
          <div className="absolute top-10 right-2 w-48 p-2 bg-white dark:bg-gray-800 shadow-lg rounded-md text-xs text-gray-600 dark:text-gray-300 z-20">
            Ads help us keep this service free for everyone.
          </div>
        )}

        {/* AdSense Component */}
        <div className="w-64 p-2">
          <AdUnit 
            slot={adSlot}
            format="vertical"
            responsive={true}
            className="min-h-[600px] w-64"
          />
        </div>
      </div>
    </div>
  );
}

// Google AdSense Script Component with improved loading
export function GoogleAdSenseScript() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  useEffect(() => {
    // Set up error handling for AdSense
    const handleAdError = (e) => {
      console.error('AdSense error:', e);
    };
    
    window.addEventListener('error', handleAdError);
    
    return () => {
      window.removeEventListener('error', handleAdError);
    };
  }, []);
  
  // Don't render script if not configured
  if (!ADSENSE_CONFIG.CLIENT_ID || 
      ADSENSE_CONFIG.CLIENT_ID === 'ca-pub-XXXXXXXXXX') {
    return null;
  }

  const handleScriptLoad = () => {
    setScriptLoaded(true);
    console.log('AdSense script loaded successfully');
  };

  const handleScriptError = (e) => {
    console.error('AdSense script failed to load:', e);
  };

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.CLIENT_ID}`}
      onLoad={handleScriptLoad}
      onError={handleScriptError}
    />
  );
}