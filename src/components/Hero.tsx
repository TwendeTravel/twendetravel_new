
import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate video loading after a short delay
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video with Gradient Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {isVideoLoaded ? (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute w-full h-full object-cover"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-buildings-on-a-sunny-day-33078-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-twende-teal/70 via-black/50 to-twende-orange/40"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-twende-teal to-twende-orange animate-pulse">
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>
        )}
      </div>

      {/* Content Container */}
      <motion.div 
        className="container relative z-10 px-4 mx-auto text-center text-white"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-4xl md:text-7xl font-bold mb-4 tracking-tight"
          variants={itemVariants}
        >
          <span className="block gradient-text bg-gradient-to-r from-white via-white/90 to-twende-beige">Seamless Travel.</span> 
          <span className="block text-twende-orange mt-2">Unforgettable</span> 
          <span className="block mt-2">Experiences.</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light" 
          variants={itemVariants}
        >
          Your all-in-one travel companion for authentic experiences in Ghana, Kenya, and beyond.
        </motion.p>
        
        {/* Desktop Search Container */}
        <motion.div 
          className="hidden md:block bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-xl p-6 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-white/70" />
              </div>
              <input 
                type="text" 
                className="w-full px-12 py-4 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Where to? (e.g. Accra, Nairobi)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative md:w-1/4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-white/70" />
              </div>
              <input 
                type="text" 
                className="w-full px-12 py-4 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50" 
                placeholder="When?" 
              />
            </div>
            <div className="relative md:w-1/4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-white/70" />
              </div>
              <select className="w-full px-12 py-4 rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none">
                <option className="bg-twende-teal text-white">1 Guest</option>
                <option className="bg-twende-teal text-white">2 Guests</option>
                <option className="bg-twende-teal text-white">3 Guests</option>
                <option className="bg-twende-teal text-white">4+ Guests</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-white/70" />
              </div>
            </div>
            <Button className="px-8 py-4 h-auto bg-twende-orange hover:bg-twende-orange/90 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
              <Search className="mr-2 h-5 w-5" />
              <span>Explore</span>
            </Button>
          </div>
        </motion.div>
        
        {/* Mobile Search Button */}
        <motion.div 
          className="md:hidden mt-8"
          variants={itemVariants}
        >
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full py-4 h-auto bg-twende-orange text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
                <Search className="mr-2 h-5 w-5" />
                <span>Search Destinations</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-gradient-to-b from-twende-teal to-twende-teal/90 text-white p-6 max-h-[90vh] rounded-t-3xl">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-center">Find Your Perfect Destination</h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-white/70" />
                  </div>
                  <input 
                    type="text" 
                    className="w-full px-12 py-4 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/70 focus:outline-none"
                    placeholder="Where to? (e.g. Accra, Nairobi)" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-white/70" />
                  </div>
                  <input 
                    type="text" 
                    className="w-full px-12 py-4 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/70 focus:outline-none" 
                    placeholder="When?" 
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-white/70" />
                  </div>
                  <select className="w-full px-12 py-4 rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none appearance-none">
                    <option className="bg-twende-teal text-white">1 Guest</option>
                    <option className="bg-twende-teal text-white">2 Guests</option>
                    <option className="bg-twende-teal text-white">3 Guests</option>
                    <option className="bg-twende-teal text-white">4+ Guests</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-white/70" />
                  </div>
                </div>
                <Button className="w-full py-4 h-auto bg-twende-orange text-white font-bold rounded-lg shadow-lg transition-all duration-300">
                  <Search className="mr-2 h-5 w-5" />
                  <span>Explore</span>
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </motion.div>

        {/* Popular Searches */}
        <motion.div 
          className="mt-8 flex flex-wrap justify-center gap-3"
          variants={itemVariants}
        >
          <span className="text-sm text-white/80 mr-2 flex items-center">Popular:</span>
          <a href="#" className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105">
            Safari in Kenya
          </a>
          <a href="#" className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105">
            Ghana Beach Retreat
          </a>
          <a href="#" className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105">
            Business in Nairobi
          </a>
          <a href="#" className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105">
            Cultural Tours
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <a href="#destinations" className="flex flex-col items-center text-white opacity-75 hover:opacity-100 transition-opacity">
          <span className="text-sm mb-2">Discover More</span>
          <motion.div 
            animate={{ 
              y: [0, 10, 0],
              transition: { repeat: Infinity, duration: 1.5 }
            }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
