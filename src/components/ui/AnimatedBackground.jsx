// src/components/ui/AnimatedBackground.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  
  // Update mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // Update viewport size
    const handleResize = () => {
      setViewportSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };
    
    // Initialize
    handleResize();
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate parallax for each shape
  const calculateParallax = (strength = 0.05) => {
    if (viewportSize.width === 0 || viewportSize.height === 0) return { x: 0, y: 0 };
    
    const x = (mousePosition.x - viewportSize.width / 2) * strength;
    const y = (mousePosition.y - viewportSize.height / 2) * strength;
    
    return { x, y };
  };
  
  // Determine blob colors based on theme
  const getGradientColors = () => {
    return theme === 'dark' 
      ? [
          'rgba(59, 130, 246, 0.05)', // Blue
          'rgba(139, 92, 246, 0.05)', // Purple
          'rgba(16, 185, 129, 0.05)', // Green
          'rgba(245, 158, 11, 0.05)'  // Amber
        ]
      : [
          'rgba(59, 130, 246, 0.1)',  // Blue
          'rgba(139, 92, 246, 0.1)',  // Purple
          'rgba(16, 185, 129, 0.1)',  // Green
          'rgba(245, 158, 11, 0.1)'   // Amber
        ];
  };
  
  const gradientColors = getGradientColors();
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Blue blob */}
      <motion.div
        className="absolute rounded-full filter blur-[80px] opacity-50"
        style={{
          background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
          width: '40%',
          height: '40%',
          top: '10%',
          left: '15%',
        }}
        animate={{
          x: calculateParallax(0.02).x,
          y: calculateParallax(0.02).y,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 30
        }}
      />
      
      {/* Green blob */}
      <motion.div
        className="absolute rounded-full filter blur-[100px] opacity-40"
        style={{
          background: `linear-gradient(135deg, ${gradientColors[2]}, ${gradientColors[0]})`,
          width: '35%',
          height: '35%',
          top: '40%',
          right: '10%',
        }}
        animate={{
          x: calculateParallax(0.03).x * -1,
          y: calculateParallax(0.03).y,
        }}
        transition={{
          type: "spring",
          stiffness: 40,
          damping: 35
        }}
      />
      
      {/* Amber blob */}
      <motion.div
        className="absolute rounded-full filter blur-[120px] opacity-30"
        style={{
          background: `linear-gradient(135deg, ${gradientColors[3]}, ${gradientColors[2]})`,
          width: '30%',
          height: '30%',
          bottom: '10%',
          left: '30%',
        }}
        animate={{
          x: calculateParallax(0.04).x,
          y: calculateParallax(0.04).y * -1,
        }}
        transition={{
          type: "spring",
          stiffness: 30,
          damping: 40
        }}
      />
      
      {/* Small purple accent blob */}
      <motion.div
        className="absolute rounded-full filter blur-[60px] opacity-30"
        style={{
          background: `linear-gradient(135deg, ${gradientColors[1]}, ${gradientColors[3]})`,
          width: '15%',
          height: '15%',
          top: '20%',
          right: '25%',
        }}
        animate={{
          x: calculateParallax(0.05).x * -1,
          y: calculateParallax(0.05).y * -1,
        }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 25
        }}
      />
    </div>
  );
}