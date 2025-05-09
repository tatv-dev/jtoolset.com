// src/components/ui/SearchBar.jsx
import { useEffect, useRef, useState } from 'react';
import { useSearch } from "@/context/SearchContext";
import { Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Thay thế next/link và next/navigation
export default function SearchBar({ className = "" }) {
  const { searchTerm, setSearchTerm, searchResults } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // Thay thế useRouter

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
    if (searchTerm && searchResults.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm, searchResults]);

  // Handle keyboard navigation
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      navigate(`/tools/${searchResults[0].slug}`); // Thay router.push bằng navigate
      setIsOpen(false);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm công cụ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && searchResults.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && searchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
        >
          <ul>
            {searchResults.slice(0, 6).map((tool) => (
              <li key={tool.slug}>
                <Link
                  to={`/tools/${tool.slug}`} // Thay href bằng to
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