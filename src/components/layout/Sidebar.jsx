// src/components/layout/Sidebar.jsx
'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSearch } from '@/context/SearchContext';
import { useTheme } from '@/context/ThemeContext';
import SidebarSearchBar from '@/components/ui/SidebarSearchBar';
import CuteCatLogo from '@/components/ui/CuteCatLogo';
import AnimationLogo from '@/components/ui/AnimationLogo';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { useTranslation } from 'react-i18next';

// Icons
import { 
  Clock, 
  Shuffle, 
  Key, 
  Code, 
  ChevronRight,
  ChevronLeft,
  X,
  FileText,
  Network,
  Globe,
  QrCode,
  Link2,
  Hash,
  Filter,
  FilterX,
  RotateCcw
} from 'lucide-react';

const toolIcons = {
  'unix-time': Clock,
  'random': Shuffle,
  'jwt-decoder': Key,
  'base64': Code,
  'url-encoder': Link2,
  'hash-generator': Hash,
  'qr-generator': QrCode,
  'ip-checker': Network,
  'domain-ip': Globe,
  'lorem-ipsum': FileText,
  'color-to-image': Code,
  'regex-tester': Code,
  'word-counter': FileText,
  'remove-duplicate-lines': FilterX,
  'reverse-text': RotateCcw
};

export default function Sidebar() {
  const { sidebarSearchResults, allTools } = useSearch();
  const location = useLocation();
  const pathname = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group tools by category
  const toolsByCategory = sidebarSearchResults.reduce((acc, tool) => {
    const category = tool.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {});

  return (
    <>
      {/* Mobile overlay - only shown when sidebar is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile toggle button - only shown on mobile */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-30 bottom-20 right-4 md:hidden bg-primary-600 dark:bg-primary-800 text-white p-3 rounded-full shadow-lg"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Sidebar - Hidden on mobile unless open, always visible on desktop */}
      <aside 
        className={`
          w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border
          flex-shrink-0 transition-all duration-300 ease-in-out z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          fixed md:static top-0 bottom-0 left-0 h-full md:h-auto
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile close button - only shown on mobile */}
          <div className="flex md:hidden justify-end p-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Logo and search */}
          <div className="p-4 flex-shrink-0">
            {/* <AnimationLogo className="w-full" text={t('pages.pageList.tools')} /> */}
            <CuteCatLogo className="w-full" text={t('pages.pageList.tools')} />
            <SidebarSearchBar className="w-full" />
          
          </div>

          {/* Tools list - Scrollable */}
          <nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto sidebar-scroll">
            {Object.entries(toolsByCategory).map(([category, tools]) => (
              <div key={category} className="py-2">
                <div className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t(`tools.categories.${category}`)}
                </div>
                <div className="mt-1 space-y-1">
                  {tools.map((tool) => {
                    const isActive = pathname === `/tools/${tool.slug}`;
                    const Icon = toolIcons[tool.slug] || Shuffle;
                    
                    let linkClassName = 'flex items-center px-3 py-2 text-sm font-medium rounded-md hover:text-gray-600 ';
                    if (isActive) {
                      linkClassName += 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400';
                    } else {
                      linkClassName += 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
                    }
                    
                    return (
                      <Link
                        key={tool.slug}
                        to={`/tools/${tool.slug}`}
                        className={linkClassName}
                      >
                        <Icon size={18} className="mr-3 flex-shrink-0" />
                        <span className="truncate">{t(`tools.${tool.slug}.name`)}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Theme toggle */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-border flex-shrink-0">
            <ThemeToggle />
          </div>

          {/* Copyright */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-border flex-shrink-0">
            <div className='flex items-center justify-center'>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                &copy; {new Date().getFullYear()} {t('app.name')}
              </p>
              <span className="mx-1 text-gray-400 dark:text-gray-600">|</span>
              <Link to="/privacy-policy" className="text-xs font-normal hover:text-primary-600 dark:hover:text-primary-400">
                {t('pages.privacyPolicy.title')}
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}