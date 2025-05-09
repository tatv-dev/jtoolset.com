// src/components/tools/cookie-tools/CookieImporter.jsx
import { FileUp, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CookieImporter({
  cookieText,
  setCookieText,
  importFormat,
  setImportFormat,
  importUrl,
  setImportUrl,
  onImport,
  isImporting,
}) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCookieText(e.target.result);
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Định dạng Cookie
        </label>
        <select
          value={importFormat}
          onChange={(e) => setImportFormat(e.target.value)}
          className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="json">JSON</option>
          <option value="netscape">Netscape/curl (cookies.txt)</option>
          <option value="cookieTxt">Cookie.txt Format</option>
          <option value="headerString">Header String (name=value; name2=value2)</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="import-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          URL đích (website sẽ nhận cookie)
        </label>
        <input
          type="text"
          id="import-url"
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
          placeholder="https://example.com"
          className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Đây là URL của trang web bạn muốn sử dụng cookie này.
        </p>
      </div>
      
      <div>
        <label htmlFor="cookie-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Dữ liệu Cookie
        </label>
        <textarea
          id="cookie-input"
          rows={8}
          value={cookieText}
          onChange={(e) => setCookieText(e.target.value)}
          placeholder={getPlaceholderForFormat(importFormat)}
          className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      <div className="flex justify-between">
        <div>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.json,.csv"
          />
          <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FileUp size={16} className="mr-2" />
            Tải lên từ tệp
          </label>
        </div>
        
        <Button
          variant="primary"
          onClick={onImport}
          icon={isImporting ? RefreshCw : undefined}
          className={isImporting ? 'animate-spin' : ''}
          disabled={isImporting}
        >
          {isImporting ? 'Đang Import...' : 'Import Cookie'}
        </Button>
      </div>
      
      <div className="text-sm bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-md p-3 text-yellow-700 dark:text-yellow-500">
        <strong>Lưu ý:</strong> Browser chỉ cho phép set cookie cho domain hiện tại. Chức năng này chủ yếu hỗ trợ export/import cookie giữa các trình duyệt khác nhau.
      </div>
    </div>
  );
}

function getPlaceholderForFormat(format) {
  switch (format) {
    case 'json':
      return `[
  {
    "name": "sessionId",
    "value": "abc123",
    "domain": "example.com",
    "path": "/",
    "expires": "2023-12-31T23:59:59.000Z",
    "secure": true,
    "httpOnly": false
  }
]`;
    case 'netscape':
      return `# Netscape HTTP Cookie File
# https://curl.haxx.se/docs/http-cookies.html

example.com	TRUE	/	TRUE	1672531199	sessionId	abc123`;
    case 'cookieTxt':
      return `example.com	TRUE	/	TRUE	1672531199	sessionId	abc123`;
    case 'headerString':
      return `sessionId=abc123; userId=12345; theme=dark`;
    default:
      return '';
  }
}