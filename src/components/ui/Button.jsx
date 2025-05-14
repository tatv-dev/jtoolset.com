// src/components/ui/Button.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
  success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400',
  info: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400',
  outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-200',
};

const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-lg',
};

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  rounded = false,
  as = null, // New prop to support rendering as different element
  to = null, // For Link component
  animated = false, // New prop for animations
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';
  const widthClasses = fullWidth ? 'w-full' : '';
  const animatedClasses = animated ? 'transform hover:scale-105 hover:shadow-lg transition-transform' : '';

  const allClasses = `
    ${baseClasses} 
    ${variantClasses} 
    ${sizeClasses} 
    ${roundedClasses} 
    ${widthClasses} 
    ${animatedClasses}
    ${className}
  `;

  // If "as" prop is provided, render as that component
  if (as) {
    const Component = as;
    return (
      <Component
        to={to}
        className={allClasses}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        
        {Icon && iconPosition === 'left' && !isLoading && (
          <Icon className={`${children ? 'mr-2' : ''} h-4 w-4`} />
        )}
        
        {children}
        
        {Icon && iconPosition === 'right' && !isLoading && (
          <Icon className={`${children ? 'ml-2' : ''} h-4 w-4`} />
        )}
      </Component>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={allClasses}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {Icon && iconPosition === 'left' && !isLoading && (
        <Icon className={`${children ? 'mr-2' : ''} h-4 w-4`} />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !isLoading && (
        <Icon className={`${children ? 'ml-2' : ''} h-4 w-4`} />
      )}
    </button>
  );
}