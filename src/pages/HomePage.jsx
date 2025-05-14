// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Link as LinkIcon,
  Star
} from 'lucide-react';
import Card from '../components/ui/Card';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';


// Animated background element
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary-500/5 dark:bg-primary-500/10"
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 10 + 15}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.1
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  // Random developer tip
  const [tip, setTip] = useState('');
  const devTips = [
    "Press F12 to open developer tools in most browsers",
    "Use console.log() to debug your JavaScript code",
    "CSS Grid and Flexbox make layouts much easier",
    "Always use semantic HTML for better accessibility",
    "Remember to optimize your images for web",
    "localStorage is useful for client-side storage"
  ];
  
  useEffect(() => {
    setTip(devTips[Math.floor(Math.random() * devTips.length)]);
    
    const interval = setInterval(() => {
      setTip(devTips[Math.floor(Math.random() * devTips.length)]);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-16 pb-24 relative">
      <AnimatedBackground />
      
      {/* Hero Section with Animated Title */}
      <div className="text-center relative z-10">
        <div className="text-5xl md:text-6xl font-extrabold mb-6">
          {Array.from(t('pages.home.title')).map((char, index) => (
            <span 
              key={index} 
              dx={index === 0 ? 0 : 1}
              className="animate-pulse"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                opacity: 0.9,
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-10">
          {t('pages.home.subtitle')}
        </p>
        
        {/* Dev Tip Section */}
        <div className="mt-6 inline-flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-sm">
          <Star className="h-4 w-4 text-yellow-500 mr-2 animate-pulse" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            <span className="font-bold text-primary-600 dark:text-primary-400">Tip:</span> {tip}
          </span>
        </div>
      </div>

      {/* Call to Action */}
      <section className="text-center py-12">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-300 to-indigo-500 blur-xl opacity-30 rounded-full"></div>
          <Button
            variant="primary"
            size="xl"
            className="relative font-bold py-4 px-10 text-sm"
            as={Link}
            to="/tools"
          >
            {t('pages.home.exploreTools')}
          </Button>
        </div>
      </section>
    </div>
  );
}