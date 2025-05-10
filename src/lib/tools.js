// src/lib/tools.js
/**
 * Danh sách tất cả các công cụ được hỗ trợ
 */
export function getAllTools() {
  return [
    {
      id: 'unix-time',
      slug: 'unix-time',
      name: 'Unix Time Converter',
      description: 'Chuyển đổi giữa Unix timestamp và định dạng ngày giờ dễ đọc',
      category: 'Time',
      icon: 'Clock',
      tags: ['time', 'date', 'unix', 'timestamp', 'converter', 'epoch'],
      isFeatured: true,
    },
    {
      id: 'random',
      slug: 'random',
      name: 'Random Generator',
      description: 'Tạo chuỗi ngẫu nhiên, số, UUID, mật khẩu và danh sách ngẫu nhiên',
      category: 'Generator',
      icon: 'Shuffle',
      tags: ['random', 'generator', 'uuid', 'password', 'string', 'number'],
      isFeatured: true,
    },
    {
      id: 'jwt-decoder',
      slug: 'jwt-decoder',
      name: 'JWT Decoder',
      description: 'Phân tích và giải mã JWT (JSON Web Token)',
      category: 'Web',
      icon: 'Key',
      tags: ['jwt', 'token', 'decode', 'web', 'authentication', 'security'],
      isFeatured: true,
    },
    {
      id: 'cookie-tools',
      slug: 'cookie-tools',
      name: 'Cookie Tools',
      description: 'Import và export cookie giữa các trình duyệt',
      category: 'Web',
      icon: 'Cookie',
      tags: ['cookie', 'browser', 'import', 'export', 'web'],
      isFeatured: true,
    },
    {
      id: 'hash-generator',
      slug: 'hash-generator',
      name: 'Hash Generator',
      description: 'Tạo các loại hash khác nhau (MD5, SHA-1, SHA-256, v.v.)',
      category: 'Crypto',
      icon: 'Hash',
      tags: ['hash', 'md5', 'sha1', 'sha256', 'crypto', 'security'],
      isFeatured: false,
    },
    {
      id: 'json-formatter',
      slug: 'json-formatter',
      name: 'JSON Formatter',
      description: 'Định dạng, xác thực và làm đẹp JSON',
      category: 'Formatter',
      icon: 'FileJson',
      tags: ['json', 'formatter', 'beautify', 'validate'],
      isFeatured: false,
    },
    {
      id: 'base64',
      slug: 'base64',
      name: 'Base64 Encoder/Decoder',
      description: 'Mã hóa và giải mã Base64',
      category: 'Encoder',
      icon: 'Code',
      tags: ['base64', 'encode', 'decode', 'converter'],
      isFeatured: false,
    },
    {
      id: 'url-encoder',
      slug: 'url-encoder',
      name: 'URL Encoder/Decoder',
      description: 'Mã hóa và giải mã URL',
      category: 'Encoder',
      icon: 'Link',
      tags: ['url', 'encode', 'decode', 'converter'],
      isFeatured: false,
    },
  ];
}

/**
 * Lấy công cụ theo slug
 */
export function getToolBySlug(slug) {
  return getAllTools().find(tool => tool.slug === slug);
}

/**
 * Lấy các công cụ nổi bật
 */
export function getFeaturedTools() {
  return getAllTools().filter(tool => tool.isFeatured);
}

/**
 * Lấy các công cụ theo danh mục
 */
export function getToolsByCategory(category) {
  return getAllTools().filter(tool => tool.category === category);
}

/**
 * Lấy tất cả các danh mục
 */
export function getAllCategories() {
  const categories = [];
  getAllTools().forEach(tool => {
    if (!categories.includes(tool.category)) {
      categories.push(tool.category);
    }
  });
  return categories;
}

/**
 * Lấy công cụ liên quan (cùng danh mục)
 */
export function getRelatedTools(toolId, limit = 3) {
  const currentTool = getAllTools().find(tool => tool.id === toolId);
  if (!currentTool) return [];
  
  return getAllTools()
    .filter(tool => tool.id !== toolId && tool.category === currentTool.category)
    .slice(0, limit);
}