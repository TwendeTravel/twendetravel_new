
import { ShieldCheck, Clock, Globe, Users, Phone, MessageCircle, Plane, Hotel, Car, Camera } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Your Complete Concierge Service</h2>
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
          From the moment you tell us your travel dreams to your safe return home, our expert team handles every detail of your African adventure
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <FeatureCard 
            icon={<MessageCircle className="w-10 h-10 text-twende-teal" />}
            title="24/7 Personal Concierge" 
            description="Your dedicated travel assistant available via WhatsApp, phone, or chat anytime during your journey. Real human support, not chatbots."
            delay={100}
          />
          
          <FeatureCard 
            icon={<Users className="w-10 h-10 text-twende-teal" />}
            title="Local Expert Network" 
            description="Native coordinators in Ghana, Kenya, and South Africa who know the authentic experiences, best restaurants, and hidden gems."
            delay={200}
          />
          
          <FeatureCard 
            icon={<Plane className="w-10 h-10 text-twende-teal" />}
            title="Flight Management" 
            description="We find and book the best flights, handle changes, upgrades, and ensure smooth connections. You just show up at the airport."
            delay={300}
          />
          
          <FeatureCard 
            icon={<Hotel className="w-10 h-10 text-twende-teal" />}
            title="Accommodation Curation" 
            description="Hand-picked hotels, lodges, and unique stays that match your style and budget. From luxury resorts to authentic guesthouses."
            delay={400}
          />
          
          <FeatureCard 
            icon={<Car className="w-10 h-10 text-twende-teal" />}
            title="Transport & Transfers" 
            description="Airport pickup, private drivers, domestic flights, and all local transport arranged. No waiting, no confusion, just smooth travel."
            delay={500}
          />
          
          <FeatureCard 
            icon={<Camera className="w-10 h-10 text-twende-teal" />}
            title="Authentic Experiences" 
            description="Cultural tours, wildlife safaris, cooking classes, and unique activities curated by locals who know the real Africa."
            delay={600}
          />

          <FeatureCard 
            icon={<ShieldCheck className="w-10 h-10 text-twende-teal" />}
            title="Complete Care Package" 
            description="Visa assistance, travel insurance, health requirements, emergency support, and cultural briefings - we handle everything."
            delay={700}
          />
          
          <FeatureCard 
            icon={<Globe className="w-10 h-10 text-twende-teal" />}
            title="Pre-Trip Planning" 
            description="Detailed itineraries, packing lists, cultural guides, and local contacts shared before departure. You'll feel prepared and excited."
            delay={800}
          />
          
          <FeatureCard 
            icon={<Phone className="w-10 h-10 text-twende-teal" />}
            title="Emergency Support" 
            description="Lost passport? Flight cancelled? Medical emergency? Our team is on standby 24/7 to resolve any issue immediately."
            delay={900}
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
