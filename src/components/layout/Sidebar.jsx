// src/components/layout/Sidebar.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSearch } from '@/context/SearchContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import SidebarSearchBar from '@/components/ui/SidebarSearchBar';
import { motion, AnimatePresence } from 'framer-motion';
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
  RotateCcw,
  Sun,
  Moon,
  MonitorSmartphone,
  Wrench,
  Check,
  Search,
  Sparkles,
  Layers,
  Settings
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

// Category Icons for visual appeal
const categoryIcons = {
  'Time': Clock,
  'Generator': Sparkles,
  'Web': Globe,
  'Crypto': Key,
  'Formatter': Code,
  'Encoder': Link2,
  'Network': Network,
  'Text': FileText,
  'Other': Wrench
};

export default function Sidebar() {
  const { sidebarSearchResults, allTools } = useSearch();
  const location = useLocation();
  const pathname = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  
  // Animation control
  const [searchFocused, setSearchFocused] = useState(false);

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

  // Expand the category of the current tool
  useEffect(() => {
    if (pathname.startsWith('/tools/')) {
      const currentToolSlug = pathname.split('/')[2];
      const currentTool = allTools.find(tool => tool.slug === currentToolSlug);
      if (currentTool) {
        setExpandedCategory(currentTool.category);
      }
    }
  }, [pathname, allTools]);

  // Toggle category expansion
  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  // Sidebar animation variants
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { duration: 0.3 } }
  };

  // Language menu animation variants
  const menuVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        opacity: { duration: 0.2 },
        height: { duration: 0.3 }
      }
    }
  };

  // Render category with all its tools
  const renderCategory = (category, tools) => {
    const CategoryIcon = categoryIcons[category] || Wrench;
    const isExpanded = expandedCategory === category;

    return (
      <div key={category} className="py-1.5">
        <motion.button 
          onClick={() => toggleCategory(category)}
          className={`w-full px-3 py-2.5 flex items-center justify-between rounded-lg text-sm font-medium transition-all ${
            isExpanded
              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          whileHover={{ 
            backgroundColor: isExpanded ? '' : theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)' 
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <CategoryIcon className={`mr-2 h-5 w-5 ${
              isExpanded
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400'
            }`} />
            <span>{t(`tools.categories.${category}`)}</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={16} />
          </motion.div>
        </motion.button>
        
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { opacity: 1, height: 'auto', margin: '8px 0' },
                hidden: { opacity: 0, height: 0, margin: 0 }
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="ml-3 pl-3 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                {tools.map((tool) => {
                  const isActive = pathname === `/tools/${tool.slug}`;
                  const Icon = toolIcons[tool.slug] || Wrench;
                  
                  return (
                    <motion.div
                      key={tool.slug}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={`/tools/${tool.slug}`}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Icon size={16} className={`mr-2.5 flex-shrink-0 transition-colors duration-200 ${
                          isActive
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                        }`} />
                        <span className="truncate">{t(`tools.${tool.slug}.name`)}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay - only shown when sidebar is open on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile toggle button - only shown on mobile */}
      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-30 bottom-20 left-4 md:hidden bg-primary-600 dark:bg-primary-800 text-white p-3 rounded-full shadow-lg"
        whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </motion.button>

      {/* Sidebar - Hidden on mobile unless open, always visible on desktop */}
      <motion.aside 
        className={`
          w-72 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border
          flex-shrink-0 transition-all duration-300 ease-in-out z-30
          fixed md:sticky top-0 bottom-0 left-0 h-full md:h-screen
          pt-16 md:pt-20
        `}
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile close button - only shown on mobile */}
          <div className="flex md:hidden justify-end p-2">
            <motion.button 
              onClick={() => setIsOpen(false)}
              className="bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </motion.button>
          </div>
          
          {/* Search Bar with Animations */}
          <div className="px-4 pt-2 pb-4 flex-shrink-0 border-b border-gray-200 dark:border-dark-border">
            <div className={`relative rounded-xl transition-all duration-300 ${
              searchFocused 
                ? 'shadow-md ring-2 ring-primary-500 dark:ring-primary-400' 
                : 'shadow hover:shadow-md'
            }`}>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 transition-colors duration-300 ${
                  searchFocused ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400'
                }`} />
              </div>
              
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('sidebar.filter')}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-0 focus:outline-none"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
            
            <motion.div 
              className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Layers size={12} className="mr-1 text-primary-500 dark:text-primary-400" />
              <span>{Object.keys(toolsByCategory).length} {t('tools.categories.title')}, {allTools.length} {t('common.tools')}</span>
            </motion.div>
          </div>

          {/* Tools Categories - Scrollable */}
          <nav className="flex-1 px-2 py-3 overflow-y-auto sidebar-scroll">
            <div className="space-y-1">
              {Object.entries(toolsByCategory).map(([category, tools]) => 
                renderCategory(category, tools)
              )}
            </div>
          </nav>

          {/* Language and Theme section */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-border flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
            {/* Language Selector */}
            <div className="mb-4">
              <motion.button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="w-full px-3 py-2 flex items-center justify-between text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <Globe className="mr-2.5 h-4 w-4 text-primary-500 dark:text-primary-400" />
                  <span>{t('common.language')}</span>
                </div>
                <motion.div
                  animate={{ rotate: isLanguageMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={16} className="transform rotate-90" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence initial={false}>
                {isLanguageMenuOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={menuVariants}
                    className="mt-2 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md"
                  >
                    <div className="grid grid-cols-2 gap-0.5 p-1">
                      {[
                        { code: 'en', name: 'English' },
                        { code: 'vi', name: 'Tiếng Việt' },
                        { code: 'ja', name: '日本語' },
                        { code: 'ko', name: '한국어' }
                      ].map((lang) => (
                        <motion.button
                          key={lang.code}
                          onClick={() => {
                            changeLanguage(lang.code);
                            setIsLanguageMenuOpen(false);
                          }}
                          className={`px-3 py-2 text-sm rounded-md flex items-center justify-between ${
                            language === lang.code
                              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          whileHover={{ 
                            backgroundColor: language === lang.code 
                              ? '' 
                              : theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)'
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>{lang.name}</span>
                          {language === lang.code && (
                            <Check size={14} className="text-primary-600 dark:text-primary-400" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Settings size={14} className="mr-1.5 text-primary-500 dark:text-primary-400" />
                  {t('sidebar.theme')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-lg shadow-sm">
                <motion.button
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-md flex flex-col items-center justify-center ${
                    theme === 'light'
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Light Mode"
                >
                  <Sun size={18} className={theme === 'light' ? 'text-amber-500' : ''} />
                  <span className="text-xs mt-1">{t('header.theme.light')}</span>
                </motion.button>
                <motion.button
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-md flex flex-col items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Dark Mode"
                >
                  <Moon size={18} className={theme === 'dark' ? 'text-indigo-400' : ''} />
                  <span className="text-xs mt-1">{t('header.theme.dark')}</span>
                </motion.button>
                <motion.button
                  onClick={() => setTheme('system')}
                  className={`p-2 rounded-md flex flex-col items-center justify-center ${
                    theme === 'system'
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="System Mode"
                >
                  <MonitorSmartphone size={18} />
                  <span className="text-xs mt-1">{t('header.theme.system')}</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-border flex-shrink-0">
            <div className='flex items-center justify-center'>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                &copy; {new Date().getFullYear()} {t('app.name')}
              </p>
              <span className="mx-1 text-gray-400 dark:text-gray-600">|</span>
              <Link to="/privacy-policy" className="text-xs font-normal text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                {t('pages.privacyPolicy.title')}
              </Link>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}