
import { Award, Users, Globe } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1523825086357-39d9158d4b54?auto=format&fit=crop&w=800&q=80" 
                alt="Twende Travel Team" 
                className="w-full h-auto"
              />
            </div>
            
            {/* Stats Overlay */}
            <div className="glass-card absolute -bottom-10 right-0 md:-right-10 max-w-xs animate-floating p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-twende-beige/10 backdrop-blur-lg mr-4 dark:bg-white/5">
                  <Award className="h-6 w-6 text-twende-teal dark:text-twende-skyblue" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-100">Trusted by</h4>
                  <p className="text-2xl font-bold text-twende-teal dark:text-twende-skyblue">10,000+</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">happy travelers</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Side */}
          <div>
            <h2 className="section-title dark:text-white">About Twende Travel</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Twende Travel is an all-in-one travel platform designed to transform journeys into 
              effortless, meaningful experiences through personalized planning, local expertise, 
              and technology-enhanced convenience.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Initially focusing on Ghana and Kenya as test markets, our solution addresses the 
              common challenges faced by travelers to unfamiliar destinations while expanding 
              to serve other regions as demand grows.
            </p>
            
            {/* Key Features */}
            <div className="space-y-6 mb-8">
              <FeatureItem 
                icon={<Users className="h-6 w-6 text-twende-orange" />}
                title="Local Expertise" 
                description="Our team includes local guides and experts who know every hidden gem in our destinations."
              />
              <FeatureItem 
                icon={<Globe className="h-6 w-6 text-twende-orange" />}
                title="Holistic Approach" 
                description="We handle everything from airport pickup to departure, creating truly seamless journeys."
              />
            </div>
            
            {/* Team Quote */}
            <div className="glass-card p-6 italic text-gray-600 dark:text-gray-300 mb-8 border-l-4 border-twende-teal dark:border-twende-skyblue">
              "We believe travel should be transformative, not stressful. Our mission is to help you 
              discover the authentic heart of a destination while handling all the logistics."
            </div>
            
            {/* CTA Button */}
            <a 
              href="#plan" 
              className="btn-primary dark:bg-twende-skyblue dark:text-black dark:hover:bg-twende-skyblue/90"
            >
              Start Your Journey with Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
  return (
    <div className="flex items-start">
      <div className="p-2 rounded-full bg-twende-beige/10 backdrop-blur-lg mr-4 mt-1 dark:bg-white/5">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default AboutSection;
