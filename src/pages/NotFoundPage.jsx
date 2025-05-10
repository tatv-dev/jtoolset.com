// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom'
import { getFeaturedTools } from '../lib/tools'
import { useTranslation } from 'react-i18next'
import Card from '../components/ui/Card'
import { AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  const { t } = useTranslation()
  const featuredTools = getFeaturedTools().slice(0, 3)

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-6 flex flex-col items-center">
          <AlertTriangle className="h-16 w-16 text-red-500 dark:text-red-400 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            404 - {t('common.notFound')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('pages.home.subtitle')}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent 
            text-base font-medium rounded-md text-white bg-primary-600 
            hover:bg-primary-700 focus:outline-none focus:ring-2 
            focus:ring-offset-2 focus:ring-primary-500"
          >
            {t('common.backToHome')}
          </Link>
        </div>

        {/* Featured Tools Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('pages.home.featuredTools')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.slug}`}
                className="block group"
              >
                <Card
                  className="h-full transition-all duration-200 
                  hover:shadow-md hover:border-primary-200 
                  dark:hover:border-primary-800"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 
                    bg-primary-100 dark:bg-primary-900 
                    rounded-md flex items-center justify-center">
                      <span className="text-primary-600 
                      dark:text-primary-400 text-xl">
                        {getIconForTool(tool.icon)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium 
                      text-gray-900 dark:text-white 
                      group-hover:text-primary-600 
                      dark:group-hover:text-primary-400">
                        {t(`tools.${tool.slug}.name`)}
                      </h3>
                      <p className="mt-1 text-sm 
                      text-gray-600 dark:text-gray-300">
                        {t(`tools.${tool.slug}.description`)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hàm lấy icon cho công cụ
function getIconForTool(iconName) {
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