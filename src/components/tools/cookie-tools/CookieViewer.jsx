// src/components/tools/cookie-tools/CookieViewer.jsx
import { useState } from 'react';
import { RefreshCw, Trash, Eye, EyeOff, Edit, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CookieViewer({
  cookies,
  filteredCookies,
  searchTerm, 
  setSearchTerm,
  selectedCookies,
  setSelectedCookies,
  startEditCookie,
  loadCookies,
  deleteAllCookies,
  createTestCookies,
  showCookieDetails,
  setShowCookieDetails,
}) {
  // Toggle selection of all cookies
  const selectAllCookies = () => {
    if (selectedCookies.length === filteredCookies.length) {
      setSelectedCookies([]);
    } else {
      setSelectedCookies(filteredCookies.map(cookie => cookie.name));
    }
  };
  
  // Toggle selection of a cookie
  const toggleCookieSelection = (cookieName) => {
    setSelectedCookies(prev =>
      prev.includes(cookieName)
        ? prev.filter(name => name !== cookieName)
        : [...prev, cookieName]
    );
  };
  
  // Toggle showing cookie value details
  const toggleCookieDetails = (cookieName) => {
    setShowCookieDetails(prev => ({
      ...prev,
      [cookieName]: !prev[cookieName]
    }));
  };
  
  // Delete selected cookies
  const deleteSelectedCookies = () => {
    try {
      selectedCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      setSelectedCookies([]);
      loadCookies();
    } catch (err) {
      console.error('Failed to delete cookies:', err);
    }
  };
  
  // Delete a single cookie
  const deleteCookie = (cookieName) => {
    try {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      loadCookies();
    } catch (err) {
      console.error('Failed to delete cookie:', err);
    }
  };
  
  // Format the cookie value for display (try to detect if encoded)
  const formatCookieValue = (cookie) => {
    try {
      // First try if it's JSON
      const jsonObj = JSON.parse(cookie.value);
      return (
        <div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">JSON</div>
          <pre className="text-xs overflow-auto max-h-24 whitespace-pre-wrap break-all">
            {JSON.stringify(jsonObj, null, 2)}
          </pre>
        </div>
      );
    } catch (e) {
      // Try if it's Base64
      try {
        const base64Pattern = /^[A-Za-z0-9+/=]+$/;
        // Only attempt decode if it looks like Base64
        if (base64Pattern.test(cookie.value) && cookie.value.length % 4 === 0) {
          const decoded = atob(cookie.value);
          
          // Check if decoded result is readable text
          const isReadableText = /^[\x20-\x7E\s]+$/.test(decoded);
          
          if (isReadableText) {
            // Try if the decoded value is JSON
            try {
              const jsonObj = JSON.parse(decoded);
              return (
                <div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Base64 → JSON</div>
                  <pre className="text-xs overflow-auto max-h-24 whitespace-pre-wrap break-all">
                    {JSON.stringify(jsonObj, null, 2)}
                  </pre>
                </div>
              );
            } catch (e2) {
              // Just return decoded Base64
              return (
                <div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Base64</div>
                  <div className="text-xs overflow-auto max-h-24 whitespace-pre-wrap break-all">{decoded}</div>
                </div>
              );
            }
          }
        }
      } catch (e2) {
        // Not Base64 either
      }
      
      // Just return the original value
      return (
        <div className="text-xs overflow-auto max-h-24 whitespace-pre-wrap break-all">{cookie.value}</div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cookies..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={loadCookies}
          >
            Refresh
          </Button>
          {cookies.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon={Trash}
              onClick={deleteAllCookies}
            >
              Delete All
            </Button>
          )}
        </div>
      </div>
      
      {/* Cookie table */}
      {filteredCookies.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                      checked={selectedCookies.length === filteredCookies.length && filteredCookies.length > 0}
                      onChange={selectAllCookies}
                    />
                    <span className="ml-2">Name</span>
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Domain
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Path
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Attributes
                </th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredCookies.map((cookie) => (
                <tr key={cookie.name} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                        checked={selectedCookies.includes(cookie.name)}
                        onChange={() => toggleCookieSelection(cookie.name)}
                      />
                      <span className="ml-2">{cookie.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="max-w-md">
                      <button
                        onClick={() => toggleCookieDetails(cookie.name)}
                        className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {showCookieDetails[cookie.name] ? (
                          <>
                            <EyeOff size={14} className="mr-1" />
                            Hide details
                          </>
                        ) : (
                          <>
                            <Eye size={14} className="mr-1" />
                            View value
                          </>
                        )}
                      </button>
                      {showCookieDetails[cookie.name] && formatCookieValue(cookie)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {cookie.domain || document.domain}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {cookie.path || '/'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {cookie.secure && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                          Secure
                        </span>
                      )}
                      {cookie.httpOnly && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                          HttpOnly
                        </span>
                      )}
                      {cookie.sameSite && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
                          SameSite: {cookie.sameSite}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => startEditCookie(cookie)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCookie(cookie.name)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="mx-auto h-12 w-12 text-gray-400">🍪</div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No cookies found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? `No cookies matching "${searchTerm}"` : `This website does not have any cookies yet.`}
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={createTestCookies}
            >
              <span className="-ml-1 mr-2 h-5 w-5">➕</span>
              Create test cookies
            </button>
          </div>
        </div>
      )}
      
      {/* Delete selected button */}
      {selectedCookies.length > 0 && (
        <div className="mt-4">
          <Button
            variant="danger"
            size="sm"
            icon={Trash}
            onClick={deleteSelectedCookies}
          >
            Delete Selected ({selectedCookies.length})
          </Button>
        </div>
      )}
    </div>
  );
}