import React from 'react';

// Authentic WhatsApp-style background pattern - dense, subtle, seamless
export const AuthenticWhatsAppTravelBackground = ({ 
  className = "absolute inset-0 overflow-hidden pointer-events-none",
  opacity = 0.02
}: { 
  className?: string; 
  opacity?: number;
}) => {
  // Generate dense, overlapping pattern like real WhatsApp
  const generateDensePattern = () => {
    const patterns = [];
    const density = 800; // Much denser - hundreds of icons
    
    const travelIcons = [
      'airplane', 'palm', 'camera', 'suitcase', 'compass', 'globe', 'map', 'passport', 'mountain', 'cloud', 'sun', 'car'
    ];
    
    for (let i = 0; i < density; i++) {
      const x = Math.random() * window.innerWidth * 1.5; // Extend beyond viewport
      const y = Math.random() * window.innerHeight * 1.5;
      const rotation = Math.random() * 360;
      const scale = 0.3 + Math.random() * 0.4; // Much smaller icons
      const iconType = travelIcons[Math.floor(Math.random() * travelIcons.length)];
      
      patterns.push({
        id: i,
        x,
        y,
        rotation,
        scale,
        iconType
      });
    }
    
    return patterns;
  };

  const patterns = generateDensePattern();

  // WhatsApp-style outline icons (stroke-based, not filled)
  const WhatsAppTravelIcon = ({ type, style }: { type: string; style: any }) => {
    const baseProps = {
      style: {
        position: 'absolute' as const,
        left: `${style.x}px`,
        top: `${style.y}px`,
        transform: `rotate(${style.rotation}deg) scale(${style.scale})`,
        opacity: opacity,
        strokeWidth: '1.5',
        fill: 'none',
        stroke: '#075e54', // WhatsApp green
        width: '16px',
        height: '16px'
      }
    };

    switch (type) {
      case 'airplane':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        );
      
      case 'palm':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <path d="M12 2L8 8l4 2 4-2-4-6z" />
            <path d="M12 10L8 16l4 2 4-2-4-6z" />
            <line x1="12" y1="10" x2="12" y2="22" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
        );
      
      case 'camera':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        );
      
      case 'suitcase':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <rect x="4" y="6" width="16" height="12" rx="2" />
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            <path d="M8 12h8" />
          </svg>
        );
      
      case 'compass':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
          </svg>
        );
      
      case 'globe':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      
      case 'map':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
        );
      
      case 'passport':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="12" y2="14" />
          </svg>
        );
      
      case 'mountain':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V6a1 1 0 0 1 .553-.894L9 2l5.447 2.724A1 1 0 0 1 15 5.618v10.764a1 1 0 0 1-.553.894L9 20z" />
            <path d="M12 8l3 6-6-6z" />
          </svg>
        );
      
      case 'cloud':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          </svg>
        );
      
      case 'sun':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        );
      
      case 'car':
        return (
          <svg {...baseProps} viewBox="0 0 24 24">
            <path d="M5 17a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m-4 0H3m6 0h6m-6 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m0 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m0 0h2" />
            <path d="M3 12h18l-2-7H5l-2 7z" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={className}
      style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(18, 140, 126, 0.003) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(18, 140, 126, 0.003) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(18, 140, 126, 0.002) 0%, transparent 50%)
        `
      }}
    >
      {patterns.map((pattern) => (
        <WhatsAppTravelIcon
          key={pattern.id}
          type={pattern.iconType}
          style={pattern}
        />
      ))}
    </div>
  );
};

export default AuthenticWhatsAppTravelBackground;
