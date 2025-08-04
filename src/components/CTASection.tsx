
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-twende-teal to-twende-teal/80 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="pattern-dots h-full w-full"></div>
      </div>
      
      {/* Motion background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-white/5"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-[15%] w-80 h-80 rounded-full bg-white/5"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Ready for Your Perfect African Adventure?
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Tell us your dreams and budget. Our concierge team will handle every detail - 
          from flights to authentic experiences. No stress, just pure adventure.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            to="/service-request"
            className="bg-white text-twende-teal hover:bg-gray-100 transition-all duration-300 font-bold py-4 px-8 rounded-xl flex items-center justify-center hover:shadow-xl group text-lg"
          >
            Start My Journey
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </Link>
          
          <Link
            to="/chat"
            className="bg-transparent text-white border-2 border-white hover:bg-white/10 transition-all duration-300 font-bold py-4 px-8 rounded-xl hover:shadow-xl flex items-center justify-center text-lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Chat with Expert
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <span>24/7 Support Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <span>500+ Happy Travelers</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⭐</span>
            <span>4.9/5 Average Rating</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
