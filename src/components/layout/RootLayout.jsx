// src/components/layout/RootLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import NewsTicker from '../ui/NewsTicker';
import SidebarAds from '../ui/SidebarAds';
import { GoogleAdSenseScript } from '@/lib/ads'; // Import the AdSense script component

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-background text-gray-900 dark:text-dark-text transition-colors duration-200">
      {/* Add GoogleAdSenseScript here */}
      <GoogleAdSenseScript />
      
      {/* News Ticker - Top of the page */}
      {/* <NewsTicker /> */}
      
      {/* Header */}
      <Header />
      
      <div className="flex flex-1 w-full">
        {/* Sidebar Navigation */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 max-w-7xl">
            <Outlet />
          </main>
          
          {/* Right Sidebar Ads - Only visible on XL screens */}
          <SidebarAds />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}