
import { ShieldCheck, Clock, Globe, Users, Map, MessageCircle } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center dark:text-twende-skyblue">Why Choose Twende Travel</h2>
        <p className="section-subtitle text-center dark:text-gray-300">
          We combine expertise, technology, and genuine care to create seamless travel experiences
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <FeatureCard 
            icon={<Globe className="w-10 h-10 text-twende-teal dark:text-twende-skyblue" />}
            title="Local Expertise" 
            description="Our team of local experts ensure you experience authentic culture and hidden gems most tourists miss."
            delay={100}
          />
          
          <FeatureCard 
            icon={<ShieldCheck className="w-10 h-10 text-twende-teal dark:text-twende-skyblue" />}
            title="Stress-Free Guarantee" 
            description="From airport pickup to departure, we coordinate every detail so you can focus on enjoying your trip."
            delay={200}
          />
          
          <FeatureCard 
            icon={<Clock className="w-10 h-10 text-twende-teal dark:text-twende-skyblue" />}
            title="24/7 Support" 
            description="Our dedicated team is available around the clock to assist with any questions or changes."
            delay={300}
          />
          
          <FeatureCard 
            icon={<Users className="w-10 h-10 text-twende-teal dark:text-twende-skyblue" />}
            title="Personalized Experiences" 
            description="Every itinerary is tailored to your preferences, interests, and travel style."
            delay={400}
          />
          
          <FeatureCard 
            icon={<Map className="w-10 h-10 text-twende-teal dark:text-twende-skyblue" />}
            title="Comprehensive Planning" 
            description="Accommodation, transport, activities, and dining recommendations all in one place."
            delay={500}
          />
          
          <FeatureCard 
            icon={<MessageCircle className="w-10 h-10 text-twende-teal dark:text-twende-skyblue" />}
            title="Community Insights" 
            description="Access tips and reviews from our community of travelers and local experts."
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <div 
      className="p-6 rounded-xl transition-all duration-300 animate-slide-up bg-white dark:bg-gray-800/50 hover:shadow-lg dark:shadow-none dark:hover:bg-gray-800/70 dark:border dark:border-gray-700/50 backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default Features;
