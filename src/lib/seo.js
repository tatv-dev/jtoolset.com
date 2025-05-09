// src/lib/seo.js

/**
 * Tạo metadata cho các trang tool
 */
export function getToolMetadata(tool) {
  if (!tool) {
    return {
      title: 'Công cụ không tìm thấy',
      description: 'Không tìm thấy công cụ này',
    };
  }

  return {
    title: `${tool.name} | JToolset`,
    description: tool.description,
    keywords: tool.tags,
    openGraph: {
      title: `${tool.name} - Developer Toolkit`,
      description: tool.description,
      type: 'website',
    },
  };
}

/**
 * Tạo tệp robots.txt
 */
export function generateRobotsTxt() {
  return `
# *
User-agent: *
Allow: /

# Host
Host: https://JToolset.com

# Sitemaps
Sitemap: https://JToolset.com/sitemap.xml
`.trim();
}

/**
 * Tạo sitemap XML
 */
export function generateSitemap(baseUrl, tools) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/tools</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${tools
    .map(
      (tool) => `
  <url>
    <loc>${baseUrl}/tools/${tool.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`;
}

/**
 * Tạo tệp manifest.json
 */
export function generateManifest() {
  return {
    name: 'JToolset - Developer Utilities and Tools',
    short_name: 'JToolset',
    description: 'Free online developer tools including Unix time converter, random generator, JWT decoder, cookie tools, and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0284c7',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

/**
 * Chuẩn hóa URL
 */
export function normalizeUrl(url) {
  // Thêm https:// nếu không có protocol
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  // Đảm bảo URL không kết thúc bằng dấu /
  return url.replace(/\/$/, '');
}

/**
 * Tạo slug từ chuỗi
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng -
    .replace(/&/g, '-and-') // Thay thế & bằng 'and'
    .replace(/[^\w\-]+/g, '') // Xóa tất cả ký tự không phải là từ
    .replace(/\-\-+/g, '-'); // Thay thế nhiều - bằng một -
}