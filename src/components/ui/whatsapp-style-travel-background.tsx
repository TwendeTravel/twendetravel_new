import React from 'react';
import { motion } from 'framer-motion';

// WhatsApp-style travel pattern background with authentic density and positioning
export const WhatsAppStyleTravelBackground = ({ 
  className = "absolute inset-0 overflow-hidden pointer-events-none",
  opacity = 0.03 // Much lower opacity like WhatsApp
}: { 
  className?: string; 
  opacity?: number;
}) => {
  // Generate a grid-based pattern like WhatsApp with some randomness
  const generateGridPattern = () => {
    const patterns = [];
    const rows = 25; // Many more rows for density
    const cols = 15; // Many more columns
    
    const travelIcons = [
      'airplane', 'palm', 'camera', 'suitcase', 'compass', 'globe', 'map', 'passport', 'mountain', 'cloud'
    ];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Skip some positions randomly for natural spacing like WhatsApp
        if (Math.random() < 0.4) continue;
        
        const x = (col * 120) + (Math.random() * 60 - 30); // Grid with random offset
        const y = (row * 80) + (Math.random() * 40 - 20);
        const rotation = Math.random() * 30 - 15; // Small rotation variance
        const scale = 0.8 + Math.random() * 0.4; // Size variance
        const iconType = travelIcons[Math.floor(Math.random() * travelIcons.length)];
        
        patterns.push({
          id: `${row}-${col}`,
          x,
          y,
          rotation,
          scale,
          iconType,
          animationDelay: Math.random() * 10
        });
      }
    }
    
    return patterns;
  };

  const patterns = generateGridPattern();

  // Simple SVG icon components - minimal like WhatsApp
  const TravelIcon = ({ type, style }: { type: string; style: any }) => {
    const baseProps = {
      className: "absolute",
      style: {
        left: `${style.x}px`,
        top: `${style.y}px`,
        transform: `rotate(${style.rotation}deg) scale(${style.scale})`,
        opacity: opacity
      }
    };

    const iconProps = {
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "currentColor"
    };

    switch (type) {
      case 'airplane':
        return (
          <motion.div {...baseProps}>
            <svg {...iconProps}>
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" 
                    fill="#1A5F7A" />
            </svg>
          </motion.div>
        );
      
      case 'palm':
        return (
          <motion.div {...baseProps}>
            <svg {...iconProps}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" 
                    fill="#4D724D" />
            </svg>
          </motion.div>
        );
      
      case 'camera':
        return (
          <motion.div {...baseProps}>
            <svg {...iconProps}>
              <path d="M12 15.2l3.2-2.7L12 8.8l-3.2 2.7L12 15.2zM9 2l-1.83 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" 
                    fill="#FF7F50" />
            </svg>
          </motion.div>
        );
      
      case 'suitcase':
        return (
          <motion.div {...baseProps}>
            <svg {...iconProps} viewBox="0 0 24 24">
              <path d="M9 12v6h6v-6h4l-7-7-7 7h4zm4-6V4H9v2h6z" fill="#D97706" />
            </svg>
          </motion.div>
        );
      
      case 'compass':
        return (
          <motion.div {...baseProps}>
            <svg {...iconProps}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-5.59l1.42-5.84-5.84 1.42L7.41 11 12 16.41z" 
                    fill="#1A5F7A" />
            </svg>
          </motion.div>
        );
      
      case 'globe':
        return (
          <motion.div {...baseProps}>
            <svg {...iconProps}>
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" 
                    fill="#059669" />
            </svg>
          </motion.div>
        );
      
      case 'map':
        return (
          <motion.div {...baseProps}>
            <svg {...iconProps}>
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" 
                    fill="#7C3AED" />
            </svg>
          </motion.div>
        );
      
      case 'passport':
        return (
          <motion.div {...baseProps}>
            <svg {...iconProps} viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 2h4v2H9V4zm0 4h4v1H9V8zm0 2h4v1H9v-1z" 
                    fill="#DC2626" />
            </svg>
          </motion.div>
        );
      
      case 'mountain':
        return (
          <motion.div {...baseProps}>
            <svg {...iconProps} viewBox="0 0 24 24">
              <path d="M14 6l-3.75 5 2.85 3.8 1.6-1.6 1.8 2.4L19 10l-5-4zM5.5 9L10 18h4l-2.4-3.2L9 18l-3.5-9z" 
                    fill="#059669" />
            </svg>
          </motion.div>
        );
      
      case 'cloud':
        return (
          <motion.div {...baseProps}>
            <svg {...iconProps}>
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.61 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" 
                    fill="#0EA5E9" />
            </svg>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={className} style={{ color: '#128C7E' }}>
      {patterns.map((pattern) => (
        <TravelIcon
          key={pattern.id}
          type={pattern.iconType}
          style={pattern}
        />
      ))}
    </div>
  );
};

export default WhatsAppStyleTravelBackground;
