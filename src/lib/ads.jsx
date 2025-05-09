// src/lib/ads.jsx
import { useState, useEffect } from 'react';
import Script from '@/components/ui/Script'; // Sử dụng component Script tùy chỉnh

// Google AdSense ID
const GOOGLE_ADSENSE_ID = 'ca-pub-XXXXXXXXXX'; // Thay bằng ID của bạn

export default function GoogleAdsScript() {
  if (!GOOGLE_ADSENSE_ID || GOOGLE_ADSENSE_ID === 'ca-pub-XXXXXXXXXX') {
    // Không render script nếu ID không được cấu hình
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_ID}`}
    />
  );
}

// Component để hiển thị quảng cáo
export function AdUnit({ slot, format = 'auto', responsive = true, className = '' }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (!GOOGLE_ADSENSE_ID || GOOGLE_ADSENSE_ID === 'ca-pub-XXXXXXXXXX') {
    // Render một placeholder thay vì quảng cáo thật
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center p-4 text-center text-gray-500 dark:text-gray-400 text-sm ${className}`}>
        <span>Ad Unit Placeholder</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={GOOGLE_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
      <Script id={`ad-unit-${slot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}