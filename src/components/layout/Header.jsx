// src/components/layout/Header.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSearch } from '@/context/SearchContext';
import { 
  Zap, 
  Home, 
  Info, 
  Mail, 
  Menu, 
  X, 
  Search, 
  Globe, 
  Sun, 
  Moon, 
  MonitorSmartphone,
  ChevronDown,
  Layers,
  Clock,
  Shuffle,
  Key,
  Code,
  FileText,
  Network,
  QrCode,
  Link2,
  Hash,
  Wrench,
  Check,
  Settings,
  ChevronRight
} from 'lucide-react';

// Category Icons
const categoryIcons = {
  'Time': Clock,
  'Generator': Shuffle,
  'Web': Code,
  'Crypto': Key,
  'Formatter': Code,
  'Encoder': Link2,
  'Network': Network,
  'Text': FileText,
  'Other': Wrench
};

// Tool icons mapping
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
  'remove-duplicate-lines': Code,
  'reverse-text': Code
};

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { sidebarSearchResults, allTools, headerSearchTerm, setHeaderSearchTerm } = useSearch();
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Group tools by category
  const toolsByCategory = sidebarSearchResults.reduce((acc, tool) => {
    const category = tool.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {});

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Toggle category expansion
  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  // Check if path is active
  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Header animation variants
  const headerVariants = {
    top: { 
      boxShadow: "none",
      padding: "1.5rem 0",
      borderBottom: "none" 
    },
    scrolled: { 
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      padding: "0.75rem 0", 
      borderBottom: "1px solid rgba(229, 231, 235, 0.5)"
    }
  };
  
  // Dark header variants
  const darkHeaderVariants = {
    top: { 
      boxShadow: "none",
      padding: "1.5rem 0",
      borderBottom: "none" 
    },
    scrolled: { 
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      padding: "0.75rem 0", 
      borderBottom: "1px solid rgba(55, 65, 81, 0.5)"
    }
  };

  // Menu Animation variants
  const menuVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.header
      className="sticky top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-sm transition-all dark:text-white"
      initial="top"
      animate={scrollY > 20 ? "scrolled" : "top"}
      variants={theme === 'dark' ? darkHeaderVariants : headerVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute -inset-2.5 bg-gradient-to-r from-primary-400 to-primary-600 dark:from-primary-700 dark:to-primary-500 opacity-75 blur-xl rounded-full group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-center bg-white dark:bg-gray-800 rounded-full p-3">
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ 
                      rotate: 360,
                      transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                  >
                    <Zap size={28} className="text-primary-600 dark:text-primary-400" />
                  </motion.div>
                </div>
              </div>
              
              <div className="ml-3 md:ml-4">
                <motion.span 
                  className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  JToolset
                </motion.span>
                <motion.div 
                  className="hidden md:block text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {t('app.description')}
                </motion.div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {[
              { path: '/', label: 'Home', icon: Home },
              { path: '/about', label: 'About', icon: Info },
              { path: '/contact', label: 'Contact', icon: Mail },
            ].map((item, index) => (
              <motion.div
                key={item.path}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={item.path}
                  className={`relative group font-medium text-base flex items-center`}
                >
                  <item.icon 
                    size={18} 
                    className={`mr-1.5 ${
                      isActivePath(item.path)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                    } transition-colors duration-200`} 
                  />
                  <span className={`${
                    isActivePath(item.path)
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-300'
                  } transition-colors duration-200`}>
                    {t(`pages.pageList.${item.label.toLowerCase()}`)}
                  </span>
                  
                  {/* Animated underline */}
                  <motion.div
                    className={`h-0.5 bg-primary-500 dark:bg-primary-400 rounded absolute bottom-0 left-0 right-0 ${
                      isActivePath(item.path) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: isActivePath(item.path) ? '100%' : 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}

            {/* Settings button */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className={`relative p-2 rounded-full ${
                  isLanguageMenuOpen
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Settings size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </motion.div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Expandable menu - drops down when menu is open */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-40"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Mobile search bar */}
              <div className="md:hidden mb-6">
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
                    type="text"
                    placeholder={t('header.search')}
                    value={headerSearchTerm}
                    onChange={(e) => setHeaderSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-0 focus:outline-none"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
              </div>

              {/* Mobile navigation links */}
              <div className="md:hidden mb-6 space-y-2">
                {[
                  { path: '/', label: 'Home', icon: Home },
                  { path: '/about', label: 'About', icon: Info },
                  { path: '/contact', label: 'Contact', icon: Mail },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg ${
                      isActivePath(item.path)
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${
                      isActivePath(item.path)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    {t(`pages.pageList.${item.label.toLowerCase()}`)}
                  </Link>
                ))}
              </div>

              {/* Categories grid - both mobile and desktop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(toolsByCategory).map(([category, tools]) => (
                  <div key={category} className="space-y-2">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center">
                        {categoryIcons[category] && React.createElement(categoryIcons[category], {
                          className: "h-5 w-5 mr-2 text-primary-600 dark:text-primary-400"
                        })}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {t(`tools.categories.${category}`)}
                        </h3>
                      </div>
                      <ChevronRight 
                        size={18} 
                        className={`text-gray-400 transition-transform duration-200 ${
                          expandedCategory === category ? 'transform rotate-90' : ''
                        }`} 
                      />
                    </div>
                    
                    <div className={`grid grid-cols-1 gap-1 pl-7 ${
                      expandedCategory === category || expandedCategory === null ? 'block' : 'hidden md:block'
                    }`}>
                      {tools.map((tool) => (
                        <Link
                          key={tool.slug}
                          to={`/tools/${tool.slug}`}
                          className={`flex items-center py-2 px-3 rounded-md ${
                            location.pathname === `/tools/${tool.slug}`
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {toolIcons[tool.slug] && React.createElement(toolIcons[tool.slug], {
                            className: `h-4 w-4 mr-2 ${
                              location.pathname === `/tools/${tool.slug}`
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`
                          })}
                          <span className="truncate">{t(`tools.${tool.slug}.name`)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language and Theme menu */}
      <AnimatePresence>
        {isLanguageMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="absolute top-full right-0 mt-2 mr-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4 space-y-4">
              {/* Language selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                  <Globe size={14} className="mr-1.5" />
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
                      onClick={() => changeLanguage(lang.code)}
                      className={`p-2 rounded-md text-left text-sm font-medium flex items-center justify-between ${
                        language === lang.code
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{lang.name}</span>
                      {language === lang.code && (
                        <Check size={14} className="text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Theme selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                  <Settings size={14} className="mr-1.5" />
                  {t('sidebar.theme')}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 p-2 rounded-md flex flex-col items-center justify-center text-sm ${
                      theme === 'light'
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Sun size={18} className={theme === 'light' ? 'text-amber-500' : ''} />
                    <span className="mt-1 text-xs">{t('header.theme.light')}</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 p-2 rounded-md flex flex-col items-center justify-center text-sm ${
                      theme === 'dark'
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Moon size={18} className={theme === 'dark' ? 'text-indigo-400' : ''} />
                    <span className="mt-1 text-xs">{t('header.theme.dark')}</span>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex-1 p-2 rounded-md flex flex-col items-center justify-center text-sm ${
                      theme === 'system'
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <MonitorSmartphone size={18} />
                    <span className="mt-1 text-xs">{t('header.theme.system')}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}