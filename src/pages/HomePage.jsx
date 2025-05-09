// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { getFeaturedTools } from '../lib/tools';
import Card from '../components/ui/Card';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();
  const featuredTools = getFeaturedTools();

  return (
    <div className="space-y-10 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          {t('pages.home.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('pages.home.subtitle')}
        </p>
      </div>

      {/* Featured Tools */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('pages.home.featuredTools')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map((tool) => (
            <Link
              key={tool.id}
              to={`/tools/${tool.slug}`}
              className="block group"
            >
              <Card
                className="h-full transition-all duration-200 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-md flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 text-xl">
                      {getIconForTool(tool.icon)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      {t(`tools.${tool.slug}.name`)}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {t(`tools.${tool.slug}.description`)}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {t('pages.home.whyUse')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title={t('pages.home.feature1.title')}
            description={t('pages.home.feature1.description')}
            icon="💯"
          />
          <FeatureCard
            title={t('pages.home.feature2.title')}
            description={t('pages.home.feature2.description')}
            icon="🔐"
          />
          <FeatureCard
            title={t('pages.home.feature3.title')}
            description={t('pages.home.feature3.description')}
            icon="📱"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('pages.home.readyToStart')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('pages.home.subtitle')}
        </p>
        <div>
          <Link
            to="/tools"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {t('pages.home.exploreTools')}
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function getIconForTool(iconName) {
  // Đây chỉ là placeholder, thực tế bạn sẽ sử dụng thư viện icon
  const icons = {
    Clock: '🕒',
    Shuffle: '🔀',
    Key: '🔑',
    Cookie: '🍪',
    Hash: '#️⃣',
    FileJson: '📄',
    Code: '📝',
    Link: '🔗',
  };

  return icons[iconName] || '🔧';
}