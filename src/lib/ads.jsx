// src/lib/ads.jsx
import { useState, useEffect } from 'react';
import Script from '@/components/ui/Script';

// Cấu hình Google AdSense
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
    HEADER_HORIZONTAL: 'HEADER-HORIZONTAL-SLOT-ID',
    FOOTER_HORIZONTAL: '6186893531'
  }
};

// General ad component
export function AdUnit({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '' 
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't show ad if not configured
  if (!ADSENSE_CONFIG.CLIENT_ID || 
      ADSENSE_CONFIG.CLIENT_ID === 'ca-pub-XXXXXXXXXX' || 
      !slot) {
    return null;
  }

  // Render placeholder if not client-side
  if (!isClient) {
    return null;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
      <Script 
        id={`ad-unit-${slot}`} 
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`
        }}
      />
    </div>
  );
}

// Google AdSense Script Component
export function GoogleAdSenseScript() {
  // Don't render script if not configured
  if (!ADSENSE_CONFIG.CLIENT_ID || 
      ADSENSE_CONFIG.CLIENT_ID === 'ca-pub-XXXXXXXXXX') {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.CLIENT_ID}`}
    />
  );
}