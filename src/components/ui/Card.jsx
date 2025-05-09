// src/components/ui/Card.jsx
import React from 'react';

export default function Card({ 
  children, 
  title, 
  description,
  icon: Icon,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerContent,
}) {
  return (
    <div className={`bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden transition-all ${className}`}>
      {/* Card Header */}
      {(title || description) && (
        <div className={`px-5 py-4 border-b border-gray-200 dark:border-dark-border ${headerClassName}`}>
          <div className="flex items-center">
            {Icon && <Icon className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            <div>
              {title && <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>}
              {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
            </div>
          </div>
        </div>
      )}
      
      {/* Card Body */}
      <div className={`px-5 py-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {/* Optional Card Footer */}
      {footerContent && (
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-dark-border">
          {footerContent}
        </div>
      )}
    </div>
  );
}