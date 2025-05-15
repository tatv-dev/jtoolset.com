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
    {
      id: 'qr-generator',
      slug: 'qr-generator',
      name: 'QR Code Generator',
      description: 'Tạo mã QR từ văn bản, URL hoặc thông tin liên hệ',
      category: 'Generator',
      icon: 'QrCode',
      tags: ['qr', 'code', 'generator', 'barcode', 'scan'],
      isFeatured: true,
    },
    {
      id: 'ip-checker',
      slug: 'ip-checker',
      name: 'IP Address Checker',
      description: 'Kiểm tra địa chỉ IP hiện tại của bạn',
      category: 'Network',
      icon: 'Network',
      tags: ['ip', 'address', 'network', 'location', 'checker'],
      isFeatured: true,
    },
    {
      id: 'domain-ip',
      slug: 'domain-ip',
      name: 'Domain to IP',
      description: 'Kiểm tra địa chỉ IP từ tên miền',
      category: 'Network',
      icon: 'Globe',
      tags: ['domain', 'ip', 'dns', 'lookup', 'network'],
      isFeatured: true,
    },
    {
      id: 'lorem-ipsum',
      slug: 'lorem-ipsum',
      name: 'Lorem Ipsum Generator',
      description: 'Tạo đoạn văn bản mẫu (Lorem Ipsum) theo số từ hoặc ký tự',
      category: 'Generator',
      icon: 'FileText',
      tags: ['lorem', 'ipsum', 'text', 'generator', 'placeholder', 'sample', 'dummy'],
      isFeatured: true,
    },
    {
      id: 'color-to-image',
      slug: 'color-to-image',
      name: 'Color to Image',
      description: 'Convert colors to PNG images for use in designs',
      category: 'Generator',
      icon: 'Palette',
      tags: ['color', 'image', 'png', 'generator', 'design', 'gradient', 'transparency'],
      isFeatured: true,
    },
    {
      id: 'regex-tester',
      slug: 'regex-tester',
      name: 'Regex Tester',
      description: 'Test and debug regular expressions with real-time results',
      category: 'Web',
      icon: 'Code',
      tags: ['regex', 'regular expression', 'pattern', 'match', 'replace', 'validation', 'web'],
      isFeatured: true,
    },
    {
      id: 'word-counter',
      slug: 'word-counter',
      name: 'Word Counter',
      description: 'Count words, characters, lines and paragraphs in text',
      category: 'Text',
      icon: 'FileText',
      tags: ['text', 'word', 'count', 'character', 'statistics', 'counter', 'analysis'],
      isFeatured: true,
    },
    {
      id: 'remove-duplicate-lines',
      slug: 'remove-duplicate-lines',
      name: 'Remove Duplicate Lines',
      description: 'Remove duplicate lines from text with various options',
      category: 'Text',
      icon: 'FilterX',
      tags: ['text', 'duplicate', 'lines', 'clean', 'dedupe', 'sort', 'remove'],
      isFeatured: true,
    },
    {
      id: 'reverse-text',
      slug: 'reverse-text',
      name: 'Reverse Text',
      description: 'Reverse text by characters, words, or lines with various options',
      category: 'Text',
      icon: 'RotateCcw',
      tags: ['text', 'reverse', 'mirror', 'character', 'word', 'line', 'backward'],
      isFeatured: true,
    },
    {
      id: 'sha',
      slug: 'sha',
      name: 'SHA Hash',
      description: 'Generate and verify hashes for text or files',
      category: 'Crypto',
      icon: 'Shield',
      tags: ['hash', 'verify', 'integrity', 'sha256', 'sha1', 'checksum', 'security'],
      isFeatured: true,
    },
    {
      id: 'bcrypt',
      slug: 'bcrypt',
      name: 'Bcrypt Hash',
      description: 'Generate and verify bcrypt password hashes',
      category: 'Crypto',
      icon: 'Shield',
      tags: ['bcrypt', 'password', 'hash', 'security', 'authentication', 'verify'],
      isFeatured: true,
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