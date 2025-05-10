// src/lib/newsService.js
class NewsService {
  constructor() {
    this.refreshInterval = 5 * 60 * 1000; // 5 minutes
    this.timers = new Map();
  }

  async fetchNews(lang = 'en') {
    try {
      const response = await fetch(`/news/${lang}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching news:', err);
      return { items: [] };
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