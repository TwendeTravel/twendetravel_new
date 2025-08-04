import React from 'react';
import { motion } from 'framer-motion';

// Comprehensive travel pattern background like WhatsApp
export const TravelPatternBackground = ({ 
  className = "absolute inset-0 overflow-hidden pointer-events-none",
  density = "high" // "low", "medium", "high"
}: { 
  className?: string; 
  density?: "low" | "medium" | "high";
}) => {
  const getDensityMultiplier = () => {
    switch (density) {
      case "low": return 0.6;
      case "medium": return 0.8;
      case "high": return 1;
      default: return 1;
    }
  };

  const multiplier = getDensityMultiplier();

  // Generate random positions for scattered doodles
  const generateDoodlePositions = (count: number) => {
    return Array.from({ length: Math.floor(count * multiplier) }, (_, i) => ({
      id: i,
      x: Math.random() * 95, // Percentage position
      y: Math.random() * 95,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      rotation: Math.random() * 360,
      scale: 0.3 + Math.random() * 0.4, // Scale between 0.3 and 0.7
    }));
  };

  const airplanes = generateDoodlePositions(8);
  const clouds = generateDoodlePositions(12);
  const palmTrees = generateDoodlePositions(6);
  const cameras = generateDoodlePositions(5);
  const suitcases = generateDoodlePositions(7);
  const maps = generateDoodlePositions(4);
  const compasses = generateDoodlePositions(3);
  const globes = generateDoodlePositions(4);
  const passports = generateDoodlePositions(6);
  const mountains = generateDoodlePositions(5);

  // Airplane SVG Component
  const AirplaneDoodle = ({ style, delay, duration }: any) => (
    <motion.div
      className="absolute"
      style={style}
      initial={{ opacity: 0, rotate: style.rotate }}
      animate={{ 
        opacity: [0, 0.1, 0.15, 0.1, 0],
        rotate: [style.rotate, style.rotate + 10, style.rotate - 10, style.rotate],
        y: [0, -20, 0]
      }}
      transition={{ 
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
        <path
          d="M20 50L35 35L75 40L85 35L90 40L75 45L85 50L75 55L35 65L20 50Z"
          fill="#1A5F7A"
          opacity="0.08"
        />
        <path
          d="M20 50L15 45L10 50L15 55L20 50Z"
          fill="#1A5F7A"
          opacity="0.06"
        />
      </svg>
    </motion.div>
  );

  // Cloud SVG Component
  const CloudDoodle = ({ style, delay, duration }: any) => (
    <motion.div
      className="absolute"
      style={style}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.08, 0.12, 0.08, 0],
        x: [0, 30, 0],
        scale: [style.scale, style.scale * 1.1, style.scale]
      }}
      transition={{ 
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg width="50" height="30" viewBox="0 0 80 40" fill="none">
        <circle cx="20" cy="25" r="10" fill="#87CEEB" opacity="0.06" />
        <circle cx="35" cy="20" r="12" fill="#87CEEB" opacity="0.08" />
        <circle cx="50" cy="25" r="10" fill="#87CEEB" opacity="0.06" />
        <circle cx="60" cy="28" r="8" fill="#87CEEB" opacity="0.05" />
      </svg>
    </motion.div>
  );

  // Palm Tree SVG Component
  const PalmTreeDoodle = ({ style, delay, duration }: any) => (
    <motion.div
      className="absolute"
      style={style}
      initial={{ opacity: 0, rotate: style.rotate }}
      animate={{ 
        opacity: [0, 0.1, 0.12, 0.1, 0],
        rotate: [style.rotate, style.rotate + 5, style.rotate - 5, style.rotate]
      }}
      transition={{ 
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg width="35" height="50" viewBox="0 0 60 100" fill="none">
        <rect x="25" y="40" width="10" height="50" rx="2" fill="#8B4513" opacity="0.08" />
        <path d="M30 40C25 30 15 25 10 20C20 25 25 30 30 35" fill="#4D724D" opacity="0.07" />
        <path d="M30 40C35 30 45 25 50 20C40 25 35 30 30 35" fill="#4D724D" opacity="0.07" />
        <path d="M30 35C20 35 10 30 5 25C15 30 25 35 30 35" fill="#4D724D" opacity="0.06" />
        <path d="M30 35C40 35 50 30 55 25C45 30 35 35 30 35" fill="#4D724D" opacity="0.06" />
      </svg>
    </motion.div>
  );

  // Camera SVG Component
  const CameraDoodle = ({ style, delay, duration }: any) => (
    <motion.div
      className="absolute"
      style={style}
      initial={{ opacity: 0, scale: style.scale }}
      animate={{ 
        opacity: [0, 0.1, 0.1, 0],
        scale: [style.scale, style.scale * 1.05, style.scale]
      }}
      transition={{ 
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg width="45" height="35" viewBox="0 0 100 80" fill="none">
        <rect x="10" y="20" width="80" height="50" rx="8" fill="#4D724D" opacity="0.08" />
        <rect x="25" y="10" width="50" height="15" rx="4" fill="#4D724D" opacity="0.06" />
        <circle cx="50" cy="45" r="15" fill="white" opacity="0.03" />
        <circle cx="50" cy="45" r="10" fill="#4D724D" opacity="0.09" />
      </svg>
    </motion.div>
  );

  // Suitcase SVG Component
  const SuitcaseDoodle = ({ style, delay, duration }: any) => (
    <motion.div
      className="absolute"
      style={style}
      initial={{ opacity: 0, y: 0 }}
      animate={{ 
        opacity: [0, 0.1, 0.1, 0],
        y: [0, -5, 0]
      }}
      transition={{ 
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg width="45" height="35" viewBox="0 0 100 80" fill="none">
        <rect x="15" y="25" width="70" height="45" rx="6" fill="#FF7F50" opacity="0.08" />
        <rect x="35" y="15" width="30" height="10" rx="3" fill="#FF7F50" opacity="0.06" />
        <circle cx="25" cy="45" r="3" fill="white" opacity="0.06" />
        <circle cx="75" cy="45" r="3" fill="white" opacity="0.06" />
      </svg>
    </motion.div>
  );

  // Map SVG Component
  const MapDoodle = ({ style, delay, duration }: any) => (
    <motion.div
      className="absolute"
      style={style}
      initial={{ opacity: 0, rotate: style.rotate }}
      animate={{ 
        opacity: [0, 0.08, 0.1, 0.08, 0],
        rotate: [style.rotate, style.rotate + 2, style.rotate - 2, style.rotate]
      }}
      transition={{ 
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg width="45" height="35" viewBox="0 0 100 80" fill="none">
        <rect x="5" y="10" width="90" height="60" rx="4" fill="white" opacity="0.09" />
        <path d="M15 20L35 35L55 25L75 40L85 30" stroke="#1A5F7A" strokeWidth="3" fill="none" opacity="0.06" />
        <circle cx="25" cy="30" r="3" fill="#1A5F7A" opacity="0.08" />
        <circle cx="65" cy="35" r="3" fill="#1A5F7A" opacity="0.08" />
      </svg>
    </motion.div>
  );

  // Compass SVG Component
  const CompassDoodle = ({ style, delay, duration }: any) => (
    <motion.div
      className="absolute"
      style={style}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.08, 0.1, 0.08, 0],
        rotate: [0, 360]
      }}
      transition={{ 
        duration: duration * 2,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <svg width="35" height="35" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="35" fill="white" opacity="0.09" stroke="#1A5F7A" strokeWidth="1" />
        <path d="M40 15L45 35L40 30L35 35L40 15Z" fill="#1A5F7A" opacity="0.08" />
        <path d="M40 65L35 45L40 50L45 45L40 65Z" fill="#FF7F50" opacity="0.06" />
      </svg>
    </motion.div>
  );

  // Globe SVG Component
  const GlobeDoodle = ({ style, delay, duration }: any) => (
    <motion.div
      className="absolute"
      style={style}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.08, 0.1, 0.08, 0],
        rotate: [0, 360]
      }}
      transition={{ 
        duration: duration * 3,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <svg width="35" height="35" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="30" fill="#1A5F7A" opacity="0.05" />
        <circle cx="40" cy="40" r="30" fill="none" stroke="#1A5F7A" strokeWidth="1" opacity="0.08" />
        <ellipse cx="40" cy="40" rx="30" ry="15" fill="none" stroke="#1A5F7A" strokeWidth="1" opacity="0.06" />
        <ellipse cx="40" cy="40" rx="15" ry="30" fill="none" stroke="#1A5F7A" strokeWidth="1" opacity="0.06" />
      </svg>
    </motion.div>
  );

  // Passport SVG Component
  const PassportDoodle = ({ style, delay, duration }: any) => (
    <motion.div
      className="absolute"
      style={style}
      initial={{ opacity: 0, scale: style.scale }}
      animate={{ 
        opacity: [0, 0.08, 0.1, 0.08, 0],
        scale: [style.scale, style.scale * 1.1, style.scale]
      }}
      transition={{ 
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg width="30" height="40" viewBox="0 0 80 100" fill="none">
        <rect x="10" y="10" width="60" height="80" rx="4" fill="#1A5F7A" opacity="0.08" />
        <rect x="15" y="15" width="50" height="10" rx="2" fill="white" opacity="0.09" />
        <circle cx="40" cy="40" r="12" fill="white" opacity="0.07" />
      </svg>
    </motion.div>
  );

  // Mountain SVG Component
  const MountainDoodle = ({ style, delay, duration }: any) => (
    <motion.div
      className="absolute"
      style={style}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.06, 0.08, 0.06, 0]
      }}
      transition={{ 
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg width="50" height="30" viewBox="0 0 100 60" fill="none">
        <path d="M10 50L30 20L50 30L70 10L90 45H10Z" fill="#4D724D" opacity="0.06" />
        <path d="M10 50L25 35L40 40L60 25L80 50H10Z" fill="#4D724D" opacity="0.04" />
        <circle cx="20" cy="20" r="6" fill="#FFD700" opacity="0.08" />
      </svg>
    </motion.div>
  );

  return (
    <div className={className}>
      {/* Render all doodles */}
      {airplanes.map((pos) => (
        <AirplaneDoodle
          key={`airplane-${pos.id}`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `scale(${pos.scale}) rotate(${pos.rotation}deg)`,
            rotate: pos.rotation
          }}
          delay={pos.delay}
          duration={pos.duration}
        />
      ))}

      {clouds.map((pos) => (
        <CloudDoodle
          key={`cloud-${pos.id}`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `scale(${pos.scale})`,
            scale: pos.scale
          }}
          delay={pos.delay}
          duration={pos.duration}
        />
      ))}

      {palmTrees.map((pos) => (
        <PalmTreeDoodle
          key={`palm-${pos.id}`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `scale(${pos.scale}) rotate(${pos.rotation}deg)`,
            rotate: pos.rotation
          }}
          delay={pos.delay}
          duration={pos.duration}
        />
      ))}

      {cameras.map((pos) => (
        <CameraDoodle
          key={`camera-${pos.id}`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `scale(${pos.scale})`,
            scale: pos.scale
          }}
          delay={pos.delay}
          duration={pos.duration}
        />
      ))}

      {suitcases.map((pos) => (
        <SuitcaseDoodle
          key={`suitcase-${pos.id}`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `scale(${pos.scale})`
          }}
          delay={pos.delay}
          duration={pos.duration}
        />
      ))}

      {maps.map((pos) => (
        <MapDoodle
          key={`map-${pos.id}`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `scale(${pos.scale}) rotate(${pos.rotation}deg)`,
            rotate: pos.rotation
          }}
          delay={pos.delay}
          duration={pos.duration}
        />
      ))}

      {compasses.map((pos) => (
        <CompassDoodle
          key={`compass-${pos.id}`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `scale(${pos.scale})`
          }}
          delay={pos.delay}
          duration={pos.duration}
        />
      ))}

      {globes.map((pos) => (
        <GlobeDoodle
          key={`globe-${pos.id}`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `scale(${pos.scale})`
          }}
          delay={pos.delay}
          duration={pos.duration}
        />
      ))}

      {passports.map((pos) => (
        <PassportDoodle
          key={`passport-${pos.id}`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `scale(${pos.scale})`,
            scale: pos.scale
          }}
          delay={pos.delay}
          duration={pos.duration}
        />
      ))}

      {mountains.map((pos) => (
        <MountainDoodle
          key={`mountain-${pos.id}`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `scale(${pos.scale})`
          }}
          delay={pos.delay}
          duration={pos.duration}
        />
      ))}
    </div>
  );
};

export default TravelPatternBackground;
