// src/hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to check if a media query matches
 * @param {string} query - CSS media query string to check
 * @returns {boolean} - Whether the media query matches
 */
function useMediaQuery(query) {
  // Initialize with null so we can detect if it's the first render
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    // On the first render, immediately check if the query matches
    if (matches === null) {
      // Check if window is defined (we're in browser environment)
      if (typeof window !== 'undefined') {
        setMatches(window.matchMedia(query).matches);
      }
    }

    // Create a MediaQueryList object
    let mediaQuery;
    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia(query);
    }

    // Define the handler to update the state
    const handleMediaChange = (event) => {
      setMatches(event.matches);
    };

    // Add event listener for changes to the media query
    if (mediaQuery) {
      // Use addEventListener if available (newer browsers)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleMediaChange);
      }
      // Fallback to addListener for older browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleMediaChange);
      }
      
      // Initialize state with current match value
      setMatches(mediaQuery.matches);
    }

    // Clean up event listener on component unmount
    return () => {
      if (mediaQuery) {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleMediaChange);
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handleMediaChange);
        }
      }
    };
  }, [query, matches]);

  return matches;
}

export default useMediaQuery;