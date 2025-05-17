// src/App.jsx
import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import HomePage from './pages/HomePage';
import ToolPage from './pages/ToolPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import NotFoundPage from './pages/NotFoundPage';
import { ThemeProvider } from './context/ThemeContext';
import { SearchProvider } from './context/SearchContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const location = useLocation();
  
  // Add class to body for mobile navigation spacing
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        document.body.classList.add('has-mobile-nav');
      } else {
        document.body.classList.remove('has-mobile-nav');
      }
    };
    
    // Run on mount and window resize
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Scroll to top on route changes
    window.scrollTo(0, 0);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <SearchProvider>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<HomePage />} />
              {/* <Route path="tools" element={<HomePage />} /> */}
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="tools/:slug" element={<ToolPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </SearchProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;