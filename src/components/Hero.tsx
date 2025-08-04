
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Globe, MessageCircle, Phone, Star, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleGetStarted = () => {
    navigate('/service-request');
  };

  const handleTalkToExpert = () => {
    navigate('/chat');
  };

  const testimonials = [
    { name: "Sarah M.", rating: 5, text: "They handled everything perfectly! From airport pickup to my safari tour.", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
    { name: "David K.", rating: 5, text: "No stress, no planning - just pure enjoyment. Best travel service ever!", avatar: "https://randomuser.me/api/portraits/men/24.jpg" },
    { name: "Maria L.", rating: 5, text: "Professional, reliable, and they know Ghana like locals. Highly recommend!", avatar: "https://randomuser.me/api/portraits/women/45.jpg" }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-twende-beige via-orange-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="pattern-dots h-full w-full"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-twende-teal/10 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-orange-200/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-twende-teal/10 rounded-full blur-xl"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[85vh]">
          
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
              <div className="bg-twende-teal/10 border border-twende-teal/20 text-twende-teal px-3 py-1.5 rounded-full text-sm font-medium">
                ✈️ Ghana • Kenya • South Africa
              </div>
              <div className="bg-orange-50 border border-orange-200 text-orange-600 px-3 py-1.5 rounded-full text-sm font-medium">
                🏆 500+ Happy Travelers
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
              Your African Adventure,
              <span className="text-twende-teal block">
                Completely Handled
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 max-w-2xl mx-auto lg:mx-0">
              Tell us your <strong>budget</strong>, <strong>purpose</strong>, and <strong>expectations</strong>. 
              We handle every detail - from airport pickup to authentic experiences. 
              <strong className="text-twende-teal block mt-1"> No planning stress, just pure enjoyment.</strong>
            </p>

            {/* Key Benefits - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
              <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg p-3 lg:p-4 text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-twende-teal/10 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
                  <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-twende-teal" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">24/7 Support</h3>
                <p className="text-xs lg:text-sm text-gray-600">Real-time assistance throughout your journey</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg p-3 lg:p-4 text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-twende-teal/10 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
                  <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-twende-teal" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">Local Experts</h3>
                <p className="text-xs lg:text-sm text-gray-600">Native coordinators in every destination</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg p-3 lg:p-4 text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-twende-teal/10 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-twende-teal" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">Everything Managed</h3>
                <p className="text-xs lg:text-sm text-gray-600">From visas to dining - we handle it all</p>
              </div>
            </div>

            {/* CTA Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start mb-6 lg:mb-8">
              <motion.button
                onClick={handleGetStarted}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-twende-teal hover:bg-twende-teal/90 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start My Journey
                <ArrowRight className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </motion.button>
              
              <motion.button
                onClick={handleTalkToExpert}
                className="border-2 border-twende-teal text-twende-teal hover:bg-twende-teal hover:text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg flex items-center justify-center gap-2 transition-all duration-300 w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone className="w-4 h-4 lg:w-5 lg:h-5" />
                Talk to Expert
              </motion.button>
            </div>

            {/* Trust Indicators - Mobile Optimized */}
            <div className="pt-6 lg:pt-8 border-t border-gray-200">
              <p className="text-xs lg:text-sm text-gray-500 mb-3 lg:mb-4">Trusted by travelers from 25+ countries</p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 lg:gap-6">
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-3 h-3 lg:w-4 lg:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs lg:text-sm font-medium text-gray-700">4.9/5</span>
                </div>
                <div className="flex items-center gap-4 lg:gap-6 text-xs lg:text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                    48hr response
                  </div>
                  <div>500+ reviews</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Mobile Optimized */}
          <motion.div 
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=800&q=80" 
                alt="African Safari Adventure" 
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Floating testimonial - Hidden on mobile */}
              <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6 hidden sm:block">
                <div className="bg-white/95 backdrop-blur rounded-lg p-3 lg:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-3 h-3 lg:w-4 lg:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs lg:text-sm text-gray-700 font-medium mb-2">
                    "{testimonials[0].text}"
                  </p>
                  <div className="flex items-center gap-2">
                    <img src={testimonials[0].avatar} alt={testimonials[0].name} className="w-6 h-6 rounded-full" />
                    <p className="text-xs text-gray-500">- {testimonials[0].name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats - Mobile Optimized */}
            <div className="absolute -top-2 lg:-top-4 -right-2 lg:-right-4 bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 lg:p-4 shadow-lg">
              <div className="text-center">
                <div className="text-lg lg:text-2xl font-bold text-twende-teal">500+</div>
                <div className="text-xs text-gray-600">Trips Planned</div>
              </div>
            </div>

            <div className="absolute -bottom-2 lg:-bottom-4 -left-2 lg:-left-4 bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 lg:p-4 shadow-lg">
              <div className="text-center">
                <div className="text-lg lg:text-2xl font-bold text-twende-teal">24/7</div>
                <div className="text-xs text-gray-600">Support Available</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Testimonials Section */}
        <motion.div 
          className="mt-12 sm:hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">What Our Travelers Say</h3>
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-700 font-medium mb-3">
              "{testimonials[0].text}"
            </p>
            <div className="flex items-center gap-2">
              <img src={testimonials[0].avatar} alt={testimonials[0].name} className="w-8 h-8 rounded-full" />
              <p className="text-sm text-gray-500">- {testimonials[0].name}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-8 lg:h-12 text-white">
          <path
            fill="currentColor"
            d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,58.7C672,64,768,96,864,96C960,96,1056,64,1152,53.3C1248,43,1344,53,1392,58.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
