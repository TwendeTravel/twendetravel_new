import React from 'react';

// Simple, working WhatsApp-style travel background
export const WorkingWhatsAppBackground = ({ 
  className = "fixed inset-0 pointer-events-none z-0",
  opacity = 0.15
}: { 
  className?: string; 
  opacity?: number;
}) => {
  // Generate a simple, working pattern
  const generateSimplePattern = () => {
    const patterns = [];
    const count = 500; // Much more icons for denser coverage
    
    const icons = ['✈️', '🌴', '📷', '🧳', '🧭', '🌍', '🗺️', '📖', '⛰️', '☁️', '🏖️', '🚗', '🏨', '🍽️', '🎒', '🏝️', '🦓', '🦒', '🐘', '🌅', '🎭', '🏛️'];
    
    for (let i = 0; i < count; i++) {
      patterns.push({
        id: i,
        x: Math.random() * 100, // Percentage
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        scale: 0.7 + Math.random() * 0.8, // Random size between 0.7 and 1.5
        icon: icons[Math.floor(Math.random() * icons.length)]
      });
    }
    
    return patterns;
  };

  const patterns = generateSimplePattern();

  return (
    <div className={className}>
      {patterns.map((pattern) => (
        <div
          key={pattern.id}
          style={{
            position: 'absolute',
            left: `${pattern.x}%`,
            top: `${pattern.y}%`,
            transform: `rotate(${pattern.rotation}deg) scale(${pattern.scale})`,
            opacity: opacity,
            fontSize: '20px', // Much larger size
            color: '#1A5F7A',
            userSelect: 'none',
            pointerEvents: 'none',
            filter: 'blur(0.5px)', // Slight blur for softer appearance
          }}
        >
          {pattern.icon}
        </div>
      ))}
    </div>
  );
};

export default WorkingWhatsAppBackground;
