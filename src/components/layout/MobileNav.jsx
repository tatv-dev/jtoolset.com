// src/components/layout/MobileNav.jsx
'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSearch } from '@/context/SearchContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Home, Grid, Info, Search, ChevronUp, X, Menu, Globe, Check } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { allTools, setHeaderSearchTerm, headerSearchResults } = useSearch();
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const pathname = location.pathname;

  // Close the drawer when the route changes
  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHeaderSearchTerm(value);
  };

  // Use a state variable to track screen size instead of only checking once
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

  // Render different components based on state
  const renderContent = () => {
    if (isSearchOpen) {
      return renderSearchPanel();
    } else if (isOpen) {
      return renderDrawer();
    } else {
      return renderBottomBar();
    }
  };

  // Bottom navigation bar
  const renderBottomBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border py-2 px-4 mobile-nav z-30">
      <div className="flex items-center justify-between">
        <NavButton 
          icon={<Home size={20} />} 
          label={t('pages.pageList.home')} 
          to="/" 
          isActive={pathname === '/'}
        />
        <NavButton 
          icon={<Grid size={20} />} 
          label={t('pages.pageList.tools')} 
          to="/tools"
          isActive={pathname === '/tools' || pathname.startsWith('/tools/')} 
        />
        <NavButton 
          icon={<Menu size={20} />} 
          label={t('common.more')} 
          onClick={() => setIsOpen(true)}
        />
      </div>
    </div>
  );

  // Navigation button component
  const NavButton = ({ icon, label, to, onClick, isActive }) => {
    const baseClasses = "flex flex-col text-center items-center justify-center w-18 py-1";
    const activeClasses = isActive 
      ? "text-primary-600 dark:text-primary-400" 
      : "text-gray-600 dark:text-gray-400";

    if (to) {
      return (
        <Link to={to} className={`${baseClasses} ${activeClasses}`}>
          {icon}
          <span className="text-xs mt-1">{label}</span>
        </Link>
      );
    }

    return (
      <button onClick={onClick} className={`${baseClasses} ${activeClasses}`}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </button>
    );
  };
  // Full drawer menu
  const renderDrawer = () => (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 mobile-nav"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border rounded-t-xl z-50 transform transition-transform duration-300 ease-in-out mobile-nav">
        <div className="flex justify-center p-2 border-b border-gray-200 dark:border-dark-border">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
        
        <div className="max-h-[80vh] overflow-y-auto mobile-menu-scroll">
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {t('common.quickLinks')}
              </h3>
              <div className="space-y-1">
                <MenuLink to="/" label={t('pages.pageList.home')} />
                <MenuLink to="/tools" label={t('pages.pageList.tools')} />
                <MenuLink to="/about" label={t('pages.pageList.about')} />
                <MenuLink to="/contact" label={t('pages.pageList.contact')} />
                <MenuLink to="/privacy-policy" label={t('pages.privacyPolicy.title')} />
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {t('common.language')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: 'en', name: 'English' },
                  { code: 'vi', name: 'Tiếng Việt' },
                  { code: 'ja', name: '日本語' },
                  { code: 'ko', name: '한국어' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`p-2 rounded-md text-left text-sm font-medium ${
                      language === lang.code
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span>{lang.name}</span>
                      {language === lang.code && (
                        <Check size={16} className="ml-auto text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-dark-border">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300 font-medium"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </>
  );

  // Helper for menu links
  const MenuLink = ({ to, label }) => (
    <Link
      to={to}
      className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      {label}
    </Link>
  );

  return renderContent();
}