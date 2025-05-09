// src/components/ui/Script.jsx
import { useEffect } from 'react';

export default function Script({ 
  id, 
  src, 
  strategy = 'afterInteractive', 
  onLoad, 
  onError,
  dangerouslySetInnerHTML,
  ...props 
}) {
  useEffect(() => {
    if (dangerouslySetInnerHTML) {
      const script = document.createElement('script');
      script.innerHTML = dangerouslySetInnerHTML.__html;
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    }

    if (!src) return;

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = props.async || false;
    script.crossOrigin = props.crossOrigin || '';
    
    script.onload = onLoad;
    script.onerror = onError;
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [id, src, dangerouslySetInnerHTML, onLoad, onError, props.async, props.crossOrigin]);
  
  return null;
}