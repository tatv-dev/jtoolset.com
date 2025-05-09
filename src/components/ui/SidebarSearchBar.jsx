// src/components/ui/SidebarSearchBar.jsx
'use client';

import { useRef } from 'react';
import { useSearch } from '@/context/SearchContext';
import { Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SidebarSearchBar({ className = '' }) {
  const { sidebarSearchTerm, setSidebarSearchTerm } = useSearch();
  const inputRef = useRef(null);
  const { t } = useTranslation();

  return (
    <div className={`${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3 top-0 h-full flex items-center pointer-events-none">
          <Filter className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder={t('sidebar.filter')}
          value={sidebarSearchTerm}
          onChange={(e) => setSidebarSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        
        {sidebarSearchTerm && (
          <div className="absolute right-3 top-0 h-full flex items-center">
            <button
              onClick={() => {
                setSidebarSearchTerm('');
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
    </div>
  );
}