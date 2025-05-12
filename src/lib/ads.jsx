// src/lib/ads.jsx
import { useState, useEffect } from 'react';
import Script from '@/components/ui/Script';

// Cấu hình Google AdSense
export const ADSENSE_CONFIG = {
  CLIENT_ID: 'ca-pub-1107241811700935', // Thay bằng Publisher ID của bạn
  AD_SLOTS: {
    // Sidebar Ads
    SIDEBAR_TOP: '2824339385',
    SIDEBAR_BOTTOM: '5935628003',
    
    // Mobile Ads
    MOBILE_TOP: 'MOBILE-TOP-SLOT-ID',
    MOBILE_MIDDLE: 'MOBILE-MIDDLE-SLOT-ID',
    MOBILE_BOTTOM: 'MOBILE-BOTTOM-SLOT-ID',
    
    // Tool Page Ads
    TOOL_PAGE_TOP: 'TOOL-PAGE-TOP-SLOT-ID',
    TOOL_PAGE_BOTTOM: '6186893531',
    
    // Footer Ads
    FOOTER_HORIZONTAL: 'FOOTER-HORIZONTAL-SLOT-ID'
  }
};

// Component quảng cáo chung
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

  // Không hiển thị quảng cáo nếu chưa được cấu hình
  if (!ADSENSE_CONFIG.CLIENT_ID || 
      ADSENSE_CONFIG.CLIENT_ID === 'ca-pub-XXXXXXXXXX' || 
      !slot) {
    return null;
  }

  // Render placeholder nếu không có slot
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
      >
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}

// Component Script Google AdSense
export function GoogleAdSenseScript() {
  // Không render script nếu chưa cấu hình
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
