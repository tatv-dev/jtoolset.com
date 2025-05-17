// src/components/layout/RootLayout.jsx
import { useEffect } from 'react';
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
  
  // Adjust padding for fixed header
  useEffect(() => {
    // Update the layout to account for the fixed header
    document.body.classList.add('has-fixed-header');
    
    return () => {
      document.body.classList.remove('has-fixed-header');
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gray-50 dark:bg-dark-background text-gray-900 dark:text-dark-text transition-colors duration-200">
      {/* Add GoogleAdSenseScript here */}
      <GoogleAdSenseScript />
      
      {/* News Ticker - Top of the page */}
      {/* <NewsTicker /> */}
      
      {/* Header - Fixed at top */}
      <Header />
      
      {/* Main layout container - fills remaining space with sidebar and content */}
      <div className="flex flex-1 pt-16 md:pt-20">
        {/* Sidebar Navigation - Visible on desktop, toggle on mobile */}
        <Sidebar />
        
        {/* Main Content - Takes full space */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto main-scroll">
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