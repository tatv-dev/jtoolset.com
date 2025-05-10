// src/lib/newsService.js
class NewsService {
  constructor() {
    this.refreshInterval = 5 * 60 * 1000; // 5 minutes
    this.timers = new Map();
  }

  async fetchNews(lang = 'en') {
    try {
      const response = await fetch(`/news/${lang}.json`);
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, try to parse the text to see if it's a valid JSON
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          return { items: [] };
        }
      }

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error fetching news:', err);
      
      // Fallback to a default news array
      return {
        items: [
          {
            time: new Date().toLocaleTimeString(),
            title: 'Unable to load live news. Please check your connection.'
          }
        ]
      };
    }
  }

  startPolling(lang, callback) {
    // Clear existing timer if any
    this.stopPolling(lang);

    // Initial fetch
    this.fetchNews(lang).then(callback);

    // Set up polling
    const timer = setInterval(async () => {
      const news = await this.fetchNews(lang);
      callback(news);
    }, this.refreshInterval);

    this.timers.set(lang, timer);
  }

  stopPolling(lang) {
    const timer = this.timers.get(lang);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(lang);
    }
  }

  stopAllPolling() {
    this.timers.forEach(timer => clearInterval(timer));
    this.timers.clear();
  }
}

export const newsService = new NewsService();