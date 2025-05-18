// src/components/layout/MainContent.jsx
import { ADSENSE_CONFIG } from '@/lib/ads';
import SideAdUnit from '../ui/SideAdUnit';
import ModernMobileAd from '../ui/ModernMobileAd';

export default function MainContent({ children }) {
  return (
    <div className="flex justify-center w-full">
      {/* Left sidebar ad */}
      <SideAdUnit 
        position="left" 
        adSlot={ADSENSE_CONFIG.AD_SLOTS.SIDEBAR_LEFT || 'SIDEBAR-LEFT-SLOT-ID'} 
      />
      
      {/* Main content area */}
      <main className="max-w-4xl flex-1 px-4 md:px-8 py-6">
        {/* Mobile top ad */}
        <ModernMobileAd position="top" />
        
        {/* Content */}
        {children}
        
        {/* Mobile bottom ad */}
        <ModernMobileAd position="bottom" />
      </main>
      
      {/* Right sidebar ad */}
      <SideAdUnit 
        position="right" 
        adSlot={ADSENSE_CONFIG.AD_SLOTS.SIDEBAR_RIGHT || 'SIDEBAR-RIGHT-SLOT-ID'} 
      />
    </div>
  );
}