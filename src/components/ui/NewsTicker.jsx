// src/components/ui/NewsTicker.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { newsService } from '@/lib/newsService';

export default function NewsTicker() {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load news from JSON file
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        // Load news based on current language
        const data = await newsService.fetchNews(i18n.language);
        setNews(data.items);
      } catch (err) {
        console.error('Error loading news:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [i18n.language]);

  // Poll for news updates
  useEffect(() => {
    if (news.length > 0) {
      newsService.startPolling(i18n.language, (data) => {
        // Only update if the news actually changes
        if (JSON.stringify(data.items) !== JSON.stringify(news)) {
          setNews(data.items);
        }
      });

      // Cleanup function
      return () => {
        newsService.stopPolling(i18n.language);
      };
    }
  }, [i18n.language, news]);

  if (loading || error || news.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary-600 dark:bg-primary-800 text-white py-2 overflow-hidden">
      <div className="relative">
        <div className="news-ticker-container">
          <div className="news-ticker-content">
            {news.map((item, index) => (
              <span key={index} className="news-item">
                <span className="font-semibold">{item.time}</span> - {item.title}
                <span className="mx-8">•</span>
              </span>
            ))}
            {/* Duplicate content for seamless scrolling */}
            {news.map((item, index) => (
              <span key={`duplicate-${index}`} className="news-item">
                <span className="font-semibold">{item.time}</span> - {item.title}
                <span className="mx-8">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}