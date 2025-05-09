// src/context/SearchContext.jsx

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAllTools } from '@/lib/tools';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  // Tìm kiếm chung
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Tìm kiếm trên header (global)
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');
  const [headerSearchResults, setHeaderSearchResults] = useState([]);
  
  // Tìm kiếm trên sidebar (lọc danh mục)
  const [sidebarSearchTerm, setSidebarSearchTerm] = useState('');
  const [sidebarSearchResults, setSidebarSearchResults] = useState([]);
  
  const allTools = useMemo(() => getAllTools(), []);

  // Xử lý tìm kiếm chung
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(allTools);
      return;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    const filteredTools = allTools.filter((tool) => {
      const inName = tool.name.toLowerCase().includes(normalizedSearchTerm);
      const inDescription = tool.description.toLowerCase().includes(normalizedSearchTerm);
      const inTags = tool.tags.some(tag => 
        tag.toLowerCase().includes(normalizedSearchTerm)
      );
      
      return inName || inDescription || inTags;
    });
    
    setSearchResults(filteredTools);
  }, [searchTerm, allTools]);

  // Xử lý tìm kiếm header
  useEffect(() => {
    if (!headerSearchTerm.trim()) {
      setHeaderSearchResults(allTools);
      return;
    }

    const normalizedSearchTerm = headerSearchTerm.toLowerCase().trim();
    
    const filteredTools = allTools.filter((tool) => {
      const inName = tool.name.toLowerCase().includes(normalizedSearchTerm);
      const inDescription = tool.description.toLowerCase().includes(normalizedSearchTerm);
      const inTags = tool.tags.some(tag => 
        tag.toLowerCase().includes(normalizedSearchTerm)
      );
      
      return inName || inDescription || inTags;
    });
    
    setHeaderSearchResults(filteredTools);
  }, [headerSearchTerm, allTools]);

  // Xử lý tìm kiếm sidebar (có thể được tùy chỉnh khác với header)
  useEffect(() => {
    if (!sidebarSearchTerm.trim()) {
      setSidebarSearchResults(allTools);
      return;
    }

    const normalizedSearchTerm = sidebarSearchTerm.toLowerCase().trim();
    
    const filteredTools = allTools.filter((tool) => {
      const inName = tool.name.toLowerCase().includes(normalizedSearchTerm);
      const inCategory = tool.category.toLowerCase().includes(normalizedSearchTerm);
      
      return inName || inCategory;
    });
    
    setSidebarSearchResults(filteredTools);
  }, [sidebarSearchTerm, allTools]);

  return (
    <SearchContext.Provider value={{ 
      // Tìm kiếm chung
      searchTerm, 
      setSearchTerm, 
      searchResults,
      
      // Tìm kiếm header
      headerSearchTerm,
      setHeaderSearchTerm,
      headerSearchResults,
      
      // Tìm kiếm sidebar
      sidebarSearchTerm,
      setSidebarSearchTerm,
      sidebarSearchResults,
      
      // Dữ liệu chung
      allTools
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}