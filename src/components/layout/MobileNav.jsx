// src/components/layout/MobileNav.jsx
'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Home, Grid, Info, Mail, Search } from 'lucide-react';

export default function MobileNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;
  
  // Use a state variable to track screen size
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );
  
  // Update on window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Only render on mobile
  if (!isMobile) {
    return null;
  }

  // Check if path is active
  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2 px-4 z-30 shadow-lg">
      <div className="flex items-center justify-between">
        <MobileNavButton 
          icon={<Home size={20} />} 
          label={t('pages.pageList.home')} 
          to="/" 
          isActive={isActivePath('/')}
        />
        <MobileNavButton 
          icon={<Grid size={20} />} 
          label={t('pages.pageList.tools')} 
          to="/tools"
          isActive={isActivePath('/tools')} 
        />
        <MobileNavButton 
          icon={<Search size={20} />} 
          label={t('header.search')} 
          to="/search"
          isActive={isActivePath('/search')} 
        />
        <MobileNavButton 
          icon={<Info size={20} />} 
          label={t('pages.pageList.about')} 
          to="/about"
          isActive={isActivePath('/about')} 
        />
        <MobileNavButton 
          icon={<Mail size={20} />} 
          label={t('pages.pageList.contact')} 
          to="/contact"
          isActive={isActivePath('/contact')} 
        />
      </div>
    </div>
  );
}

function MobileNavButton({ icon, label, to, isActive, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex flex-col items-center justify-center w-16 py-1"
    >
      <motion.div
        whileTap={{ scale: 0.9 }}
        className={`flex flex-col items-center justify-center ${
          isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        {icon}
        <span className="text-xs mt-1">{label}</span>
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mt-1"
            initial={false}
            transition={{ type: "spring", duration: 0.3 }}
          />
        )}
      </motion.div>
    </Link>
  );
}