// src/pages/HomePage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
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
  Palette
} from 'lucide-react';
import Card from '../components/ui/Card';
import { useTranslation } from 'react-i18next';

// Hàm lấy icon cho công cụ
function getIconForTool(iconName) {
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
    Palette
  };
  return icons[iconName] || Shuffle;
}

// Component hiệu ứng chữ
function AnimatedLetter({ children, className = '' }) {
  return (
    <span 
      className={`inline-block transition-transform duration-300 hover:rotate-3 hover:translate-y-1 hover:scale-110 ${className}`}
    >
      {children}
    </span>
  );
}

// Component icon dev tools
function DevToolIcon({ Icon, description }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md 
        transition-all duration-300 
        transform group-hover:rotate-6 group-hover:scale-110
        border border-gray-200 dark:border-gray-700
      `}>
        <Icon 
          className="h-12 w-12 text-primary-600 dark:text-primary-400 
          transition-colors duration-300 
          group-hover:text-primary-800 dark:group-hover:text-primary-300"
        />
      </div>
      {isHovered && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 
        bg-gray-800 text-white text-xs px-3 py-1 rounded-md 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const featuredTools = [
    { icon: 'Clock', slug: 'unix-time' },
    { icon: 'Shuffle', slug: 'random' },
    { icon: 'Key', slug: 'jwt-decoder' },
    { icon: 'QrCode', slug: 'qr-generator' },
    { icon: 'Network', slug: 'ip-checker' },
    { icon: 'Globe', slug: 'domain-ip' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section with Animated Title */}
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          {t('pages.home.title').split('').map((char, index) => (
            <AnimatedLetter key={index} className="inline-block mr-1">
              {char}
            </AnimatedLetter>
          ))}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('pages.home.subtitle')}
        </p>
      </div>

      {/* Developer Tools Icons */}
      <section className="flex flex-wrap justify-center gap-6 md:gap-8">
        {featuredTools.map(({ icon, slug }) => {
          const Icon = getIconForTool(icon);
          return (
            <DevToolIcon 
              key={slug} 
              Icon={Icon} 
              description={t(`tools.${slug}.name`)} 
            />
          );
        })}
      </section>

      {/* Featured Tools */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {t('pages.home.featuredTools')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map(({ icon, slug }) => {
            const Icon = getIconForTool(icon);
            return (
              <Link
                key={slug}
                to={`/tools/${slug}`}
                className="block group"
              >
                <Card
                  className="h-full transition-all duration-300 
                  hover:shadow-lg hover:border-primary-300 
                  dark:hover:border-primary-700 
                  transform hover:-translate-y-2"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-md">
                      <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {t(`tools.${slug}.name`)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t(`tools.${slug}.description`)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Use Section */}
      <section className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {t('pages.home.whyUse')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((num) => (
            <div 
              key={num} 
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md 
              transition-transform duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4 text-primary-600 dark:text-primary-400">
                {['💯', '🔐', '📱'][num-1]}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t(`pages.home.feature${num}.title`)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t(`pages.home.feature${num}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {t('pages.home.readyToStart')}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          {t('pages.home.subtitle')}
        </p>
        <Link
          to="/tools"
          className="inline-flex items-center justify-center px-8 py-4 
          border border-transparent text-base font-medium rounded-md 
          text-white bg-primary-600 hover:bg-primary-700 
          focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-primary-500 
          transition-all duration-300 
          transform hover:scale-105 hover:rotate-1"
        >
          {t('pages.home.exploreTools')}
        </Link>
      </section>
    </div>
  );
}