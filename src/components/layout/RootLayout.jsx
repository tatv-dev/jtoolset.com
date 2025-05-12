// src/components/layout/RootLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import NewsTicker from '../ui/NewsTicker';
import SidebarAds from '../ui/SidebarAds';
import { GoogleAdSenseScript } from '@/lib/ads';

export default function RootLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-dark-background text-gray-900 dark:text-dark-text transition-colors duration-200">
      {/* Add GoogleAdSenseScript here */}
      <GoogleAdSenseScript />
      
      {/* News Ticker - Top of the page */}
      {/* <NewsTicker /> */}
      
      {/* Header - Fixed height */}
      <Header />
      
      {/* Main layout container - fills remaining space */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation - Fixed width, own scroll */}
        <Sidebar />
        
        {/* Main Content - Chiếm toàn bộ không gian còn lại */}
        <main className="flex-1 p-4 md:p-6 md:pb-[150px] overflow-y-auto main-scroll">
          <Outlet />
        </main>
        
        {/* Right Sidebar Ads - Fixed width */}
        {/* <SidebarAds /> */}
      </div>
      
      {/* Footer - Overlay */}
      <Footer />
    </div>
  );
}