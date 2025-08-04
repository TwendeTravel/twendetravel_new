import React from 'react';
import { motion } from 'framer-motion';

// Travel-themed doodle components for enhancing UI
export const TravelDoodles = {
  // Airplane doodle
  Airplane: ({ className = "w-12 h-12", color = "#1A5F7A" }: { className?: string; color?: string }) => (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M20 50L35 35L75 40L85 35L90 40L75 45L85 50L75 55L35 65L20 50Z"
        fill={color}
        opacity="0.8"
      />
      <path
        d="M20 50L15 45L10 50L15 55L20 50Z"
        fill={color}
        opacity="0.6"
      />
      <circle cx="25" cy="50" r="2" fill="white" />
    </motion.svg>
  ),

  // Passport doodle
  Passport: ({ className = "w-10 h-12", color = "#1A5F7A" }: { className?: string; color?: string }) => (
    <motion.svg
      className={className}
      viewBox="0 0 80 100"
      fill="none"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      <rect x="10" y="10" width="60" height="80" rx="4" fill={color} opacity="0.8" />
      <rect x="15" y="15" width="50" height="10" rx="2" fill="white" opacity="0.9" />
      <circle cx="40" cy="40" r="12" fill="white" opacity="0.7" />
      <rect x="20" y="55" width="40" height="4" rx="2" fill="white" opacity="0.6" />
      <rect x="20" y="65" width="30" height="3" rx="1" fill="white" opacity="0.5" />
      <rect x="20" y="72" width="35" height="3" rx="1" fill="white" opacity="0.5" />
    </motion.svg>
  ),

  // Suitcase doodle
  Suitcase: ({ className = "w-12 h-10", color = "#FF7F50" }: { className?: string; color?: string }) => (
    <motion.svg
      className={className}
      viewBox="0 0 100 80"
      fill="none"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <rect x="15" y="25" width="70" height="45" rx="6" fill={color} opacity="0.8" />
      <rect x="35" y="15" width="30" height="10" rx="3" fill={color} opacity="0.6" />
      <rect x="20" y="30" width="60" height="3" rx="1" fill="white" opacity="0.4" />
      <circle cx="25" cy="45" r="3" fill="white" opacity="0.6" />
      <circle cx="75" cy="45" r="3" fill="white" opacity="0.6" />
      <rect x="45" y="40" width="10" height="6" rx="2" fill="white" opacity="0.7" />
    </motion.svg>
  ),

  // Camera doodle
  Camera: ({ className = "w-12 h-10", color = "#4D724D" }: { className?: string; color?: string }) => (
    <motion.svg
      className={className}
      viewBox="0 0 100 80"
      fill="none"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <rect x="10" y="20" width="80" height="50" rx="8" fill={color} opacity="0.8" />
      <rect x="25" y="10" width="50" height="15" rx="4" fill={color} opacity="0.6" />
      <circle cx="50" cy="45" r="15" fill="white" opacity="0.3" />
      <circle cx="50" cy="45" r="10" fill={color} opacity="0.9" />
      <circle cx="50" cy="45" r="6" fill="white" opacity="0.8" />
      <rect x="75" y="30" width="8" height="6" rx="2" fill="white" opacity="0.7" />
    </motion.svg>
  ),

  // Map doodle
  Map: ({ className = "w-12 h-10", color = "#1A5F7A" }: { className?: string; color?: string }) => (
    <motion.svg
      className={className}
      viewBox="0 0 100 80"
      fill="none"
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 1, -1, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <rect x="5" y="10" width="90" height="60" rx="4" fill="white" opacity="0.9" />
      <path
        d="M15 20L35 35L55 25L75 40L85 30"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      <circle cx="25" cy="30" r="3" fill={color} opacity="0.8" />
      <circle cx="65" cy="35" r="3" fill={color} opacity="0.8" />
      <rect x="10" y="50" width="20" height="15" rx="2" fill={color} opacity="0.3" />
      <rect x="70" y="45" width="15" height="20" rx="2" fill={color} opacity="0.3" />
    </motion.svg>
  ),

  // Palm tree doodle
  PalmTree: ({ className = "w-8 h-12", color = "#4D724D" }: { className?: string; color?: string }) => (
    <motion.svg
      className={className}
      viewBox="0 0 60 100"
      fill="none"
      animate={{ rotate: [0, 2, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <rect x="25" y="40" width="10" height="50" rx="2" fill="#8B4513" opacity="0.8" />
      <path
        d="M30 40C25 30 15 25 10 20C20 25 25 30 30 35"
        fill={color}
        opacity="0.7"
      />
      <path
        d="M30 40C35 30 45 25 50 20C40 25 35 30 30 35"
        fill={color}
        opacity="0.7"
      />
      <path
        d="M30 35C20 35 10 30 5 25C15 30 25 35 30 35"
        fill={color}
        opacity="0.6"
      />
      <path
        d="M30 35C40 35 50 30 55 25C45 30 35 35 30 35"
        fill={color}
        opacity="0.6"
      />
    </motion.svg>
  ),

  // Compass doodle
  Compass: ({ className = "w-10 h-10", color = "#1A5F7A" }: { className?: string; color?: string }) => (
    <motion.svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="40" cy="40" r="35" fill="white" opacity="0.9" stroke={color} strokeWidth="2" />
      <circle cx="40" cy="40" r="25" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <path d="M40 15L45 35L40 30L35 35L40 15Z" fill={color} opacity="0.8" />
      <path d="M40 65L35 45L40 50L45 45L40 65Z" fill="#FF7F50" opacity="0.6" />
      <circle cx="40" cy="40" r="3" fill={color} />
      <text x="40" y="20" textAnchor="middle" fontSize="8" fill={color} fontWeight="bold">N</text>
    </motion.svg>
  ),

  // Globe doodle
  Globe: ({ className = "w-10 h-10", color = "#1A5F7A" }: { className?: string; color?: string }) => (
    <motion.svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="40" cy="40" r="30" fill={color} opacity="0.1" />
      <circle cx="40" cy="40" r="30" fill="none" stroke={color} strokeWidth="2" />
      <ellipse cx="40" cy="40" rx="30" ry="15" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <ellipse cx="40" cy="40" rx="15" ry="30" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <path d="M15 25C25 20 35 25 45 20C55 25 65 20 70 25" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M15 55C25 60 35 55 45 60C55 55 65 60 70 55" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7" />
    </motion.svg>
  ),

  // Mountain doodle
  Mountain: ({ className = "w-12 h-8", color = "#4D724D" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 100 60" fill="none">
      <path d="M10 50L30 20L50 30L70 10L90 45H10Z" fill={color} opacity="0.6" />
      <path d="M10 50L25 35L40 40L60 25L80 50H10Z" fill={color} opacity="0.4" />
      <circle cx="20" cy="20" r="6" fill="#FFD700" opacity="0.8" />
    </svg>
  ),

  // Safari animal doodle
  Elephant: ({ className = "w-12 h-10", color = "#8B8B8B" }: { className?: string; color?: string }) => (
    <motion.svg
      className={className}
      viewBox="0 0 100 80"
      fill="none"
      whileHover={{ y: -1 }}
      transition={{ duration: 0.3 }}
    >
      <ellipse cx="60" cy="50" rx="30" ry="20" fill={color} opacity="0.7" />
      <circle cx="40" cy="35" r="15" fill={color} opacity="0.8" />
      <path d="M25 35C20 40 18 45 20 50C22 55 25 50 30 45" stroke={color} strokeWidth="3" fill="none" opacity="0.9" />
      <circle cx="35" cy="30" r="2" fill="white" />
      <rect x="50" y="65" width="4" height="10" fill={color} opacity="0.6" />
      <rect x="60" y="65" width="4" height="10" fill={color} opacity="0.6" />
      <rect x="70" y="65" width="4" height="10" fill={color} opacity="0.6" />
      <rect x="80" y="65" width="4" height="10" fill={color} opacity="0.6" />
    </motion.svg>
  ),

  // Beach elements
  Beach: ({ className = "w-12 h-8", color = "#FFD700" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 100 60" fill="none">
      <ellipse cx="50" cy="45" rx="40" ry="8" fill={color} opacity="0.3" />
      <path d="M20 45C30 40 40 45 50 40C60 45 70 40 80 45" stroke="#87CEEB" strokeWidth="2" fill="none" />
      <circle cx="15" cy="20" r="8" fill="#FFD700" opacity="0.8" />
      <rect x="85" y="35" width="3" height="15" rx="1" fill="#8B4513" opacity="0.8" />
      <path d="M86 35C83 30 80 28 77 25C82 28 84 30 86 32" fill="#4D724D" opacity="0.7" />
      <path d="M86 35C89 30 92 28 95 25C90 28 88 30 86 32" fill="#4D724D" opacity="0.7" />
    </svg>
  ),

  // Weather cloud
  Cloud: ({ className = "w-10 h-6", color = "#87CEEB" }: { className?: string; color?: string }) => (
    <motion.svg
      className={className}
      viewBox="0 0 80 40"
      fill="none"
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="20" cy="25" r="10" fill={color} opacity="0.6" />
      <circle cx="35" cy="20" r="12" fill={color} opacity="0.7" />
      <circle cx="50" cy="25" r="10" fill={color} opacity="0.6" />
      <circle cx="60" cy="28" r="8" fill={color} opacity="0.5" />
    </motion.svg>
  )
};

// Empty state illustrations
export const EmptyStateIllustrations = {
  NoTrips: ({ className = "w-24 h-24" }: { className?: string }) => (
    <div className={`${className} flex flex-col items-center justify-center space-y-2 opacity-60`}>
      <TravelDoodles.Suitcase className="w-16 h-12" color="#9CA3AF" />
      <TravelDoodles.Airplane className="w-12 h-12" color="#9CA3AF" />
    </div>
  ),

  NoDestinations: ({ className = "w-24 h-24" }: { className?: string }) => (
    <div className={`${className} flex flex-col items-center justify-center space-y-2 opacity-60`}>
      <TravelDoodles.Map className="w-16 h-12" color="#9CA3AF" />
      <TravelDoodles.Compass className="w-10 h-10" color="#9CA3AF" />
    </div>
  ),

  NoMessages: ({ className = "w-24 h-24" }: { className?: string }) => (
    <div className={`${className} flex flex-col items-center justify-center space-y-2 opacity-60`}>
      <TravelDoodles.Globe className="w-12 h-12" color="#9CA3AF" />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-8 h-8" viewBox="0 0 60 60" fill="none">
          <rect x="10" y="20" width="40" height="25" rx="4" fill="#9CA3AF" opacity="0.6" />
          <path d="M10 25L30 35L50 25" stroke="white" strokeWidth="2" />
        </svg>
      </motion.div>
    </div>
  ),

  NoFlights: ({ className = "w-24 h-24" }: { className?: string }) => (
    <div className={`${className} flex flex-col items-center justify-center space-y-2 opacity-60`}>
      <TravelDoodles.Airplane className="w-16 h-16" color="#9CA3AF" />
      <TravelDoodles.Cloud className="w-12 h-6" color="#9CA3AF" />
    </div>
  )
};

// Decorative elements for sections
export const DecorativeElements = {
  TravelBorder: ({ className = "w-full h-8" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 400 32" fill="none" preserveAspectRatio="none">
      <pattern id="travel-pattern" x="0" y="0" width="40" height="32" patternUnits="userSpaceOnUse">
        <TravelDoodles.Airplane className="w-6 h-6" color="#1A5F7A" />
      </pattern>
      <rect width="400" height="32" fill="url(#travel-pattern)" opacity="0.1" />
    </svg>
  ),

  FloatingElements: ({ className = "absolute inset-0 overflow-hidden pointer-events-none" }: { className?: string }) => (
    <div className={className}>
      <motion.div
        className="absolute top-10 left-10"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <TravelDoodles.PalmTree className="w-6 h-8" color="#4D724D" />
      </motion.div>
      <motion.div
        className="absolute top-20 right-20"
        animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <TravelDoodles.Cloud className="w-8 h-4" color="#87CEEB" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-1/4"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <TravelDoodles.Compass className="w-6 h-6" color="#1A5F7A" />
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10"
        animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <TravelDoodles.Camera className="w-8 h-6" color="#4D724D" />
      </motion.div>
    </div>
  )
};

export default TravelDoodles;
