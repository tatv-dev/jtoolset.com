// src/components/layout/MobileNav.jsx
'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSearch } from '@/context/SearchContext';
import { useTranslation } from 'react-i18next';
import { Home, Grid, Info, MessageSquare, Search, ChevronUp, X, Menu } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t } = useTranslation();
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
          icon={<Info size={20} />} 
          label={t('pages.pageList.about')} 
          to="/about"
          isActive={pathname === '/about'} 
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

  // Search panel
  const renderSearchPanel = () => (
    <div className="fixed inset-0 bg-white dark:bg-dark-surface z-40 flex flex-col mobile-nav">
      <div className="p-4 border-b border-gray-200 dark:border-dark-border flex items-center">
        <button 
          onClick={() => setIsSearchOpen(false)}
          className="p-2 -ml-2 text-gray-500 dark:text-gray-400"
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-medium ml-2">{t('header.search')}</h3>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('header.search')}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoFocus
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {searchTerm && headerSearchResults.length > 0 ? (
          <div className="space-y-2">
            {headerSearchResults.map((tool) => (
              <Link
                key={tool.slug}
                to={`/tools/${tool.slug}`}
                className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {t(`tools.${tool.slug}.name`)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {t(`tools.${tool.slug}.description`)}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          searchTerm && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('common.noResults')}
            </div>
          )
        )}
        
        {!searchTerm && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('pages.toolsList.title')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {allTools.slice(0, 8).map((tool) => (
                <Link
                  key={tool.slug}
                  to={`/tools/${tool.slug}`}
                  className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {t(`tools.${tool.slug}.name`)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {t('common.categories')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(groupToolsByCategory()).map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setIsOpen(false);
                      // Could add category filter functionality here
                    }}
                    className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t(`tools.categories.${category}`)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {t('common.legalInfo')}
              </h3>
              <div className="space-y-1">
                <MenuLink to="/privacy-policy" label={t('pages.privacyPolicy.title')} />
                <MenuLink to="/contact" label={t('pages.contact.title')} />
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

  // Helper to group tools by category
  const groupToolsByCategory = () => {
    return allTools.reduce((acc, tool) => {
      const category = tool.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
    }, {});
  };

  return renderContent();
}