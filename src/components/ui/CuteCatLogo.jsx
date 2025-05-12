import React from 'react';

const CuteCatLogo = ({text}) => {
  return (
    <div className="flex items-center space-x-2 mb-3 group">
      <div className="relative w-full h-10">
        <svg
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 200 50" 
          className="w-full h-full -ml-8"
        >
          {/* Con mèo hoạt hình với hiệu ứng chuyển động */}
          <g transform="translate(0,5) scale(0.6)">
            {/* Thân mèo */}
            <ellipse 
              cx="30" 
              cy="30" 
              rx="15" 
              ry="12" 
              fill="currentColor"
              className="text-primary-500 dark:text-primary-500"
            >
              <animate 
                attributeName="ry" 
                values="12;11;12" 
                dur="2s" 
                repeatCount="indefinite" 
              />
            </ellipse>
            
            {/* Đầu mèo */}
            <circle 
              cx="30" 
              cy="18" 
              r="10" 
              fill="currentColor"
              className="text-primary-500 dark:text-primary-500"
            />
            
            {/* Tai mèo trái */}
            <path 
              d="M22,14 L24,6 L28,12 Z" 
              fill="currentColor"
              className="text-primary-600 dark:text-primary-400"
            >
              <animate 
                attributeName="d" 
                values="M22,14 L24,6 L28,12 Z;M22,14 L23,7 L28,12 Z;M22,14 L24,6 L28,12 Z" 
                dur="3s" 
                repeatCount="indefinite" 
              />
            </path>
            
            {/* Tai mèo phải */}
            <path 
              d="M38,14 L36,6 L32,12 Z" 
              fill="currentColor"
              className="text-primary-600 dark:text-primary-400"
            >
              <animate 
                attributeName="d" 
                values="M38,14 L36,6 L32,12 Z;M38,14 L37,7 L32,12 Z;M38,14 L36,6 L32,12 Z" 
                dur="3s" 
                repeatCount="indefinite" 
              />
            </path>
            
            {/* Mắt mèo trái */}
            <ellipse 
              cx="26" 
              cy="16" 
              rx="1.5" 
              ry="2.5" 
              fill="currentColor"
              className="text-primary-900 dark:text-gray-700"
            >
              <animate 
                attributeName="ry" 
                values="2.5;0.5;2.5" 
                dur="5s" 
                repeatCount="indefinite" 
              />
            </ellipse>
            
            {/* Mắt mèo phải */}
            <ellipse 
              cx="34" 
              cy="16" 
              rx="1.5" 
              ry="2.5" 
              fill="currentColor"
              className="text-primary-900 dark:text-gray-700"
            >
              <animate 
                attributeName="ry" 
                values="2.5;0.5;2.5" 
                dur="5s" 
                repeatCount="indefinite" 
              />
            </ellipse>
            
            {/* Mũi mèo */}
            <path 
              d="M28,19 L32,19 L30,21 Z" 
              fill="currentColor"
              className="text-primary-700 dark:text-primary-300"
            />
            
            {/* Miệng mèo */}
            <path 
              d="M30,21 L30,23 M28,22 C29,24 31,24 32,22" 
              stroke="currentColor"
              strokeWidth="0.7"
              fill="none"
              className="text-primary-700 dark:text-primary-300"
            >
              <animate 
                attributeName="d" 
                values="M30,21 L30,23 M28,22 C29,24 31,24 32,22;M30,21 L30,23 M28,23 C29,25 31,25 32,23;M30,21 L30,23 M28,22 C29,24 31,24 32,22" 
                dur="5s" 
                repeatCount="indefinite" 
              />
            </path>
            
            {/* Ria mèo bên trái */}
            <line 
              x1="24" 
              y1="20" 
              x2="18" 
              y2="19" 
              stroke="currentColor"
              strokeWidth="0.7"
              className="text-primary-700 dark:text-primary-300"
            >
              <animate 
                attributeName="y2" 
                values="19;18;19" 
                dur="2s" 
                repeatCount="indefinite" 
              />
            </line>
            <line 
              x1="24" 
              y1="21" 
              x2="18" 
              y2="21" 
              stroke="currentColor"
              strokeWidth="0.7"
              className="text-primary-700 dark:text-primary-300"
            >
              <animate 
                attributeName="y2" 
                values="21;20;21" 
                dur="3s" 
                repeatCount="indefinite" 
              />
            </line>
            
            {/* Ria mèo bên phải */}
            <line 
              x1="36" 
              y1="20" 
              x2="42" 
              y2="19" 
              stroke="currentColor"
              strokeWidth="0.7"
              className="text-primary-700 dark:text-primary-300"
            >
              <animate 
                attributeName="y2" 
                values="19;18;19" 
                dur="2s" 
                repeatCount="indefinite" 
              />
            </line>
            <line 
              x1="36" 
              y1="21" 
              x2="42" 
              y2="21" 
              stroke="currentColor"
              strokeWidth="0.7"
              className="text-primary-700 dark:text-primary-300"
            >
              <animate 
                attributeName="y2" 
                values="21;20;21" 
                dur="3s" 
                repeatCount="indefinite" 
              />
            </line>
            
            {/* Đuôi mèo */}
            <path 
              d="M45,30 Q55,20 60,30" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary-500 dark:text-primary-400"
            >
              <animate 
                attributeName="d" 
                values="M45,30 Q55,20 60,30;M45,30 Q55,35 60,25;M45,30 Q55,20 60,30" 
                dur="3s" 
                repeatCount="indefinite" 
              />
            </path>
          </g>
          
          {/* Chữ với hiệu ứng */}
          <text 
            x="50" 
            y="30" 
            fill="currentColor" 
            fontFamily="Arial, sans-serif" 
            fontSize="24" 
            fontWeight="bold"
            className="text-primary-600 dark:text-primary-400 bg-red-400"
          >
            {Array.from(text).map((char, index) => (
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

export default CuteCatLogo;