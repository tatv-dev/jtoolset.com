// src/pages/ToolsListPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTools, getAllCategories } from '../lib/tools';
import Card from '../components/ui/Card';
import { AdUnit } from '../lib/ads';
import { ADSENSE_CONFIG } from '@/lib/ads';
import MobileAds from '@/components/ui/MobileAds';
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';

export default function ToolsListPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const tools = getAllTools();
  const categories = getAllCategories();
  
  // Filter tools based on search and category
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group tools by category for display
  const toolsByCategory = filteredTools.reduce((acc, tool) => {
    const category = tool.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {});
  
  // Get icon for tool
  const getIconForTool = (iconName) => {
    const icons = {
      Clock: '🕒',
      Shuffle: '🔀',
      Key: '🔑',
      Cookie: '🍪',
      Hash: '#️⃣',
      FileJson: '📄',
      Code: '📝',
      Link: '🔗',
      QrCode: '📱',
      Network: '🌐',
      Globe: '🌍',
      FileText: '📃',
    };
    return icons[iconName] || '🔧';
  };
  
  return (
    <div className="space-y-8 py-6 px-4 lg:px-20 xl:px-40">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('pages.toolsList.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('pages.toolsList.subtitle')}
        </p>
      </div>
      
      {/* Mobile ad */}
      {/* <MobileAds position="top" /> */}
      
      {/* Search and Filter */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('header.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="All">{t('common.all') || 'All Categories'}</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {t(`tools.categories.${category}`) || category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tools by Category */}
      {Object.keys(toolsByCategory).length > 0 ? (
        <div className="space-y-10">
          {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t(`tools.categories.${category}`) || category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={`/tools/${tool.slug}`}
                    className="block group"
                  >
                    <Card
                      className="h-full transition-all duration-200 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-md flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-400 text-2xl">
                            {getIconForTool(tool.icon)}
                          </span>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {t(`tools.${tool.slug}.name`) || tool.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {t(`tools.${tool.slug}.description`) || tool.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {tool.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                            {tool.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                                +{tool.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
              
              {/* Ad placement between categories */}
              {/* <div className="mt-6">
                <AdUnit 
                  slot={ADSENSE_CONFIG.AD_SLOTS.TOOL_PAGE_MIDDLE}
                  format="horizontal"
                  responsive={true}
                  className="mx-auto max-w-4xl"
                />
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('common.noResults') || 'No tools found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('common.tryDifferentSearch') || 'Try adjusting your search or filter criteria'}
            </p>
          </div>
        </div>
      )}
      
      {/* Mobile ad */}
      <MobileAds position="bottom" />
      
      {/* Call to Action */}
      {/* <div className="text-center bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('pages.toolsList.needSomethingElse')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('pages.toolsList.suggestToolDescription') || 'We\'re always adding new tools. Let us know what you need!'}
        </p>
        <a
          href="https://github.com/tatv-dev/jtoolset/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {t('pages.toolsList.suggestTool')}
        </a>
      </div> */}
    </div>
  );
}