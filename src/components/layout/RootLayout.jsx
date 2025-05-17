// src/components/layout/RootLayout.jsx
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MobileNav from './MobileNav';
import NewsTicker from '../ui/NewsTicker';
import SidebarAds from '../ui/SidebarAds';
import { GoogleAdSenseScript } from '@/lib/ads';
import { pageTransition } from '@/lib/animationUtils';

export default function RootLayout() {
  const location = useLocation();
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-dark-background text-gray-900 dark:text-dark-text transition-colors duration-200">
      {/* Add GoogleAdSenseScript here */}
      <GoogleAdSenseScript />
      
      {/* News Ticker - Top of the page */}
      {/* <NewsTicker /> */}
      
      {/* Header - Hidden on mobile, shown on desktop */}
      <Header />
      
      {/* Main layout container - fills remaining space */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation - Visible on desktop */}
        <Sidebar />
        
        {/* Main Content - Takes full space */}
        <main className="flex-1 p-4 md:p-6 md:pb-[150px] overflow-y-auto main-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={pageTransition}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Right Sidebar Ads - Fixed width */}
        {/* <SidebarAds /> */}
      </div>

      {/* Mobile Navigation - Only visible on small screens */}
      <MobileNav />
      
      {/* Footer - Overlay */}
      <Footer />
    </div>
  );
}