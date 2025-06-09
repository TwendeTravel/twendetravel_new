
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="py-20 bg-ghana-pattern bg-cover bg-center relative">
      <div className="absolute inset-0 bg-gradient-to-r from-twende-teal/90 to-twende-teal/70 dark:from-twende-skyblue/80 dark:to-twende-teal/60"></div>
      
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
          Ready for Your Next Adventure?
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Let us handle the details while you focus on creating memories that last a lifetime.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.a 
            href="#plan" 
            className="bg-white text-twende-teal hover:bg-gray-100 transition-colors duration-300 font-bold py-3 px-8 rounded-lg flex items-center justify-center hover:shadow-lg group dark:bg-gray-900 dark:text-twende-skyblue dark:hover:bg-gray-800"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Plan Your Trip
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </motion.a>
          
          <motion.a 
            href="#contact" 
            className="bg-transparent text-white border-2 border-white hover:bg-white/10 transition-colors duration-300 font-bold py-3 px-8 rounded-lg hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Contact Us
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
