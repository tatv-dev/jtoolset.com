// src/components/ui/HeaderSearchBar.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearch } from '@/context/SearchContext';
import { Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function HeaderSearchBar({ className = '' }) {
  const { headerSearchTerm, setHeaderSearchTerm, headerSearchResults } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) && 
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open dropdown when there are search results
  useEffect(() => {
    if (headerSearchTerm && headerSearchResults.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [headerSearchTerm, headerSearchResults]);

  // Handle keyboard navigation
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && headerSearchResults.length > 0) {
      navigate(`/tools/${headerSearchResults[0].slug}`);
      setIsOpen(false);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3 top-0 h-full flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm công cụ..."
          value={headerSearchTerm}
          onChange={(e) => setHeaderSearchTerm(e.target.value)}
          onFocus={() => headerSearchTerm && headerSearchResults.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        
        {headerSearchTerm && (
          <div className="absolute right-3 top-0 h-full flex items-center">
            <button
              onClick={() => {
                setHeaderSearchTerm('');
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {isOpen && headerSearchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
        >
          <ul>
            {headerSearchResults.slice(0, 6).map((tool) => (
              <li key={tool.slug}>
                <Link
                  to={`/tools/${tool.slug}`}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {tool.description}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}