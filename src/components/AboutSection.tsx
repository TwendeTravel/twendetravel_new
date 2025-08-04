
import { Award, Users, Globe, MessageCircle, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutSection = () => {
  const navigate = useNavigate();
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1523825086357-39d9158d4b54?auto=format&fit=crop&w=800&q=80" 
                alt="Twende Travel Concierge Team" 
                className="w-full h-auto"
              />
            </div>
            
            {/* Stats Overlay */}
            <div className="absolute -bottom-10 right-0 md:-right-10 max-w-xs bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-twende-teal/10 mr-4">
                  <Award className="h-6 w-6 text-twende-teal" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Trusted by</h4>
                  <p className="text-2xl font-bold text-twende-teal">500+</p>
                  <p className="text-sm text-gray-500">satisfied travelers</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Side */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Your Personal African Travel Concierge</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Twende Travel is your dedicated concierge service for authentic African adventures. 
              We handle every detail of your journey so you can focus on creating unforgettable memories 
              across Ghana, Kenya, and South Africa.
            </p>
            <p className="text-gray-600 mb-8">
              From the moment you tell us your travel dreams to your safe return home, our expert team 
              manages everything - flights, accommodations, experiences, local transport, and 24/7 support. 
              No planning stress, just pure enjoyment.
            </p>
            
            {/* Key Features */}
            <div className="space-y-6 mb-8">
              <FeatureItem 
                icon={<MessageCircle className="h-6 w-6 text-twende-teal" />}
                title="24/7 Concierge Support" 
                description="Your personal travel assistant is always available via WhatsApp, phone, or chat throughout your journey."
              />
              <FeatureItem 
                icon={<Users className="h-6 w-6 text-twende-teal" />}
                title="Local Expert Network" 
                description="Native coordinators in each destination who know the best hidden gems, authentic experiences, and local customs."
              />
              <FeatureItem 
                icon={<Shield className="h-6 w-6 text-twende-teal" />}
                title="Everything Managed" 
                description="From visa assistance to airport pickup, cultural experiences to emergency support - we handle it all."
              />
            </div>
            
            {/* Concierge Promise */}
            <div className="bg-twende-teal/5 border border-twende-teal/20 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-twende-teal mb-2">Our Concierge Promise</h3>
              <p className="text-gray-700 italic">
                "Tell us your budget, purpose, and expectations. We'll craft a personalized African adventure 
                that exceeds your dreams while handling every single detail. Your only job is to enjoy the journey."
              </p>
            </div>
            
            {/* CTA Button */}
            <button
              type="button"
              onClick={() => navigate('/service-request')}
              className="bg-twende-teal hover:bg-twende-teal/90 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Start Planning My Adventure
            </button>
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
