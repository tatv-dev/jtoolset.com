import React from 'react';

const AnimationLogo = ({text}) => {
  return (
    <div className="flex items-center space-x-2 mb-3 group">
      <div className="relative w-full h-10">
        <svg
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 200 50" 
          className="w-full h-full -ml-4"
        >
          {/* Biểu tượng công cụ động với hiệu ứng vector */}
          <g transform="translate(0, 15) scale(0.7)">
            <path 
              d="M0,20 Q15,5 30,20 T60,20"
              fill="none" 
              stroke="currentColor"
              strokeWidth="3"
              className="animate-pulse text-primary-600 dark:text-primary-400"
            >
              <animate 
                attributeName="d" 
                values="
                  M0,20 Q15,5 30,20 T60,20;
                  M0,20 Q15,35 30,20 T60,20;
                  M0,20 Q15,5 30,20 T60,20
                " 
                dur="3s" 
                repeatCount="indefinite" 
              />
            </path>
            
            <circle 
              cx="30"  // Điều chỉnh tọa độ x của circle
              cy="20" 
              r="5" 
              fill="currentColor"
              className="animate-ping text-primary-500 dark:text-primary-300"
            />
          </g>

          {/* Chữ với hiệu ứng */}
          <text 
            x="70"  // Điều chỉnh x để phù hợp với vị trí mới của biểu tượng
            y="35" 
            fill="currentColor" 
            fontFamily="Arial, sans-serif" 
            fontSize="20" 
            fontWeight="bold"
            className="text-primary-600 dark:text-primary-400"
          >
            {text.split('').map((char, index) => (
              <tspan 
                key={index} 
                dx={index === 0 ? 0 : 1}
                className="animate-pulse"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0.9
                }}
              >
                {char}
              </tspan>
            ))}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default AnimationLogo;