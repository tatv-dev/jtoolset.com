// src/components/tools/cookie-tools/CookieExporter.jsx
import { RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CookieExporter({
  exportFormat,
  setExportFormat,
  cookieFilters,
  setCookieFilters,
  onExport,
  isExporting,
}) {
  // Cập nhật bộ lọc cookie
  const updateFilter = (name, value) => {
    setCookieFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Định dạng Export
        </label>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="json">JSON</option>
          <option value="netscape">Netscape/curl (cookies.txt)</option>
          <option value="cookieTxt">Cookie.txt Format</option>
          <option value="headerString">Header String (name=value; name2=value2)</option>
        </select>
      </div>
      
      <div>
        <h3 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Lọc Cookie (tùy chọn)
        </h3>
        
        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div>
            <label htmlFor="filter-domain" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Tên miền (domain)
            </label>
            <input
              type="text"
              id="filter-domain"
              value={cookieFilters.domain}
              onChange={(e) => updateFilter('domain', e.target.value)}
              placeholder="example.com"
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="filter-path" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Đường dẫn (path)
            </label>
            <input
              type="text"
              id="filter-path"
              value={cookieFilters.path}
              onChange={(e) => updateFilter('path', e.target.value)}
              placeholder="/"
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filter-secure"
                checked={cookieFilters.secure}
                onChange={(e) => updateFilter('secure', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="filter-secure" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Chỉ cookie Secure
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filter-httpOnly"
                checked={cookieFilters.httpOnly}
                onChange={(e) => updateFilter('httpOnly', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="filter-httpOnly" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Chỉ cookie HttpOnly
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={onExport}
          icon={isExporting ? RefreshCw : undefined}
          className={isExporting ? 'animate-spin' : ''}
          disabled={isExporting}
        >
          {isExporting ? 'Đang Export...' : 'Export Cookie'}
        </Button>
      </div>
      
      <div className="text-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-md p-3 text-blue-700 dark:text-blue-500">
        <p>
          <strong>Thông tin:</strong> Chức năng này sẽ export cookie từ trang hiện tại. Để thử nghiệm, một số cookie mẫu đã được tạo sẵn.
        </p>
      </div>
    </div>
  );
}