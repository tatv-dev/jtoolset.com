// src/lib/animationUtils.js

/**
 * Animation utilities to enhance the user interface
 */

// Staggered animation entries for children
export function createStaggeredEntries(items, baseDelay = 0.1) {
  return items.map((item, index) => ({
    ...item,
    animate: {
      opacity: 1,
      y: 0
    },
    initial: {
      opacity: 0,
      y: 20
    },
    transition: {
      delay: baseDelay + (index * 0.05)
    }
  }));
}

// Random float animation paths for decorative elements
export function generateFloatPath() {
  const randomOffset = (max) => Math.random() * max - max / 2;
  
  return {
    x: [0, randomOffset(20), randomOffset(15), 0],
    y: [0, randomOffset(20), randomOffset(15), 0],
    transition: {
      duration: 10 + Math.random() * 10,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };
}

// Generate a random ID for animation keys
export function generateAnimationId() {
  return Math.random().toString(36).substring(2, 9);
}

// Smooth page transitions
export const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

// Hover animation presets
export const hoverAnimations = {
  lift: {
    scale: 1.05,
    y: -5,
    transition: { duration: 0.2 }
  },
  bounce: {
    scale: 1.03,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  },
  glow: {
    boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)"
  },
  rotate: {
    rotate: 3,
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

// Apply scroll reveal animation as elements come into view
export function createScrollRevealAnimation(delay = 0) {
  return {
    initial: { opacity: 0, y: 50 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay
      }
    },
    viewport: { once: true, margin: "-100px" }
  };
}