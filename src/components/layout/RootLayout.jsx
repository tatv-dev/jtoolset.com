// src/components/layout/Layout.jsx
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';
import MobileNav from './MobileNav';
import { GoogleAdSenseScript } from '@/lib/ads';
import { pageTransition } from '@/lib/animationUtils';
import '../../styles/modern-layout.css';

export default function RootLayout() {
  const location = useLocation();
  
  // Set up any global effects or body classes
  useEffect(() => {
    // Add a class for our new layout
    document.body.classList.add('modern-layout');
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('modern-layout');
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gray-50 dark:bg-dark-background text-gray-900 dark:text-dark-text transition-colors duration-200">
      {/* Add GoogleAdSenseScript here */}
      <GoogleAdSenseScript />
      
      {/* News Ticker - Top of the page (optional) */}
      {/* <NewsTicker /> */}
      
      {/*  header - with expandable menu */}
      <Header />
      
      {/* Main content with centered layout and ads on sides */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
            className="min-h-full"
          >
            <MainContent>
              <Outlet />
            </MainContent>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Navigation for small screens */}
      <MobileNav />
      
      {/*  Footer */}
      <Footer />
    </div>
  );
}