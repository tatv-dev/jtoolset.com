// src/components/layout/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Info, Mail, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const [scrollY, setScrollY] = useState(0);
  const { t } = useTranslation();
  const location = useLocation();

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

  // Animation variants
  const navItemVariants = {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.98 }
  };

  // Header variants for scroll effect
  const headerVariants = {
    top: { 
      backgroundColor: "rgba(255, 255, 255, 0)",
      padding: "1.5rem 0",
      boxShadow: "none",
      borderBottom: "none" 
    },
    scrolled: { 
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: "0.75rem 0",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      borderBottom: "1px solid rgba(229, 231, 235, 0.8)"
    }
  };
  
  const darkHeaderVariants = {
    top: { 
      backgroundColor: "rgba(17, 24, 39, 0)",
      padding: "1.5rem 0",
      boxShadow: "none",
      borderBottom: "none" 
    },
    scrolled: { 
      backgroundColor: "rgba(17, 24, 39, 0.95)",
      padding: "0.75rem 0", 
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      borderBottom: "1px solid rgba(55, 65, 81, 0.8)"
    }
  };

  // Check if path is active
  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header 
      className="hidden md:block fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all dark:text-white"
      initial="top"
      animate={scrollY > 20 ? "scrolled" : "top"}
      variants={darkHeaderVariants}
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
              
              <div className="ml-4">
                <motion.span 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  JToolset
                </motion.span>
                <motion.div 
                  className="text-sm text-gray-500 dark:text-gray-400 mt-0.5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {t('app.description')}
                </motion.div>
              </div>
            </Link>
          </div>

          {/* Main Navigation - Simplified */}
          <nav className="flex items-center space-x-8">
            {[
              { path: '/', label: 'Home', icon: Home },
              { path: '/about', label: 'About', icon: Info },
              { path: '/contact', label: 'Contact', icon: Mail },
            ].map((item, index) => (
              <motion.div
                key={item.path}
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={item.path}
                  className={`relative group font-medium text-base`}
                >
                  <div className="flex items-center space-x-1.5">
                    <item.icon 
                      size={18} 
                      className={`${
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
                  </div>
                  
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
          </nav>
        </div>
      </div>
    </motion.header>
  );
}