// src/pages/HomePage.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  Shuffle, 
  Key, 
  Cookie, 
  Hash, 
  FileJson, 
  Code, 
  Link as LinkIcon,
  QrCode,
  Network,
  Globe,
  FileText,
  Palette,
  Shield,
  RotateCcw,
  FilterX
} from 'lucide-react';
import Card from '../components/ui/Card';
import { useTranslation } from 'react-i18next';
import { getAllTools, getAllCategories } from '../lib/tools';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { useTheme } from '../context/ThemeContext';

// Import animations
import '../styles/animation/homepage.css';

// Get icon for tool
function getToolIcon(iconName) {
  const icons = {
    Clock, 
    Shuffle, 
    Key, 
    Cookie, 
    Hash, 
    FileJson, 
    Code, 
    Link: LinkIcon,
    QrCode,
    Network,
    Globe,
    FileText,
    Palette,
    Shield,
    RotateCcw,
    FilterX
  };
  return icons[iconName] || Shuffle;
}

// Animated letter component with staggered animation
function AnimatedLetter({ children, index, className = '' }) {
  return (
    <motion.span 
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.03,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      whileHover={{ 
        scale: 1.2, 
        rotate: Math.random() * 10 - 5,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.span>
  );
}

// Animated card component for tool items
function AnimatedToolCard({ tool, index }) {
  const { t } = useTranslation();
  const Icon = getToolIcon(tool.icon);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      <Link
        to={`/tools/${tool.slug}`}
        className="block h-full"
      >
        <Card
          className="h-full transition-all duration-300 border-transparent hover:border-primary-300 dark:hover:border-primary-700"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-md">
              <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {t(`tools.${tool.slug}.name`)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t(`tools.${tool.slug}.description`)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {tool.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {tool.tags.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{tool.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredTools, setFilteredTools] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const categories = ['All', ...getAllCategories()];
  const tools = getAllTools();
  const searchRef = useRef(null);
  
  // Filter tools based on search and category
  useEffect(() => {
    const filtered = tools.filter(tool => {
      const matchesSearch = !searchTerm || 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredTools(filtered);
  }, [searchTerm, selectedCategory, tools]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Clear search input
  const clearSearch = () => {
    setSearchTerm('');
    searchRef.current?.focus();
  };
  
  // Toggle categories dropdown
  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };
  
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Animated Background */}
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 space-y-12 relative z-10">
        {/* Hero Section with Animated Title */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="relative inline-block"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 relative z-10">
              {t('pages.home.title').split('').map((char, index) => (
                <AnimatedLetter key={index} index={index} className="inline-block mr-1">
                  {char}
                </AnimatedLetter>
              ))}
            </h1>
            <div className="absolute -inset-4 rounded-full bg-primary-100/30 dark:bg-primary-900/20 blur-xl -z-10 animate-pulse"></div>
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {t('pages.home.subtitle')}
          </motion.p>
        </div>

        {/* Enhanced Search Bar */}
        <motion.div 
          className="max-w-4xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className={`relative rounded-xl transition-all duration-300 animate-shimmer ${
            isSearchFocused 
              ? 'shadow-lg ring-2 ring-primary-500 dark:ring-primary-400' 
              : 'shadow-md hover:shadow-lg'
          }`}>
            <div className="absolute left-4 top-0 h-full flex items-center pointer-events-none">
              <Search className={`h-5 w-5 transition-colors duration-300 ${
                isSearchFocused ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400'
              }`} />
            </div>
            
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={t('header.search')}
              className="w-full pl-12 pr-24 py-4 text-lg rounded-xl border-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-0 focus:outline-none shadow-sm"
            />
            
            <div className="absolute right-4 top-0 h-full flex items-center space-x-2">
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearSearch}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                </motion.button>
              )}
              
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCategories}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    showCategories || selectedCategory !== 'All'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label="Filter by category"
                >
                  <Filter size={18} />
                  <span className="text-sm font-medium">
                    {selectedCategory === 'All' ? t('common.all') : t(`tools.categories.${selectedCategory}`)}
                  </span>
                </motion.button>
                
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 max-h-64 overflow-y-auto rounded-lg shadow-lg z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="py-1">
                        {categories.map((category) => (
                          <motion.button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowCategories(false);
                            }}
                            whileHover={{ 
                              backgroundColor: selectedCategory === category 
                                ? '' 
                                : theme === 'dark' ? 'rgba(55, 65, 81, 1)' : 'rgba(243, 244, 246, 1)'
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              selectedCategory === category
                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {category === 'All' ? t('common.all') : t(`tools.categories.${category}`)}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Category Pills */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              custom={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.9 + index * 0.05 }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border-2 border-primary-200 dark:border-primary-800'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {category === 'All' ? t('common.all') : t(`tools.categories.${category}`)}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Tools Grid */}
        <div className="space-y-10 relative z-10">
          <AnimatePresence mode="wait">
            {filteredTools.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-12"
              >
                <motion.div 
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                  {t('common.noResults')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {t('common.tryDifferentSearch')}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredTools.map((tool, index) => (
                  <AnimatedToolCard key={tool.id} tool={tool} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}