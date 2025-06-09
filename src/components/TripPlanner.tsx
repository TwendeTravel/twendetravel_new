import { useState } from 'react';
import { MapPin, Calendar, Users, Briefcase, CreditCard, Heart } from 'lucide-react';

type TravelPurpose = 'leisure' | 'business' | 'family' | 'medical';

const TripPlanner = () => {
  const [purpose, setPurpose] = useState<TravelPurpose>('leisure');
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [budget, setBudget] = useState('mid');

  return (
    <section id="plan" className="py-20 bg-twende-beige dark:bg-gray-900/50 relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="pattern-dots absolute inset-0 opacity-10 dark:opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white dark:bg-gray-800/80 dark:backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-black/20 overflow-hidden max-w-5xl mx-auto border dark:border-gray-700/50">
          <div className="grid md:grid-cols-2">
            {/* Form Side */}
            <div className="p-8 md:p-10">
              <h2 className="text-3xl font-bold text-twende-teal dark:text-twende-skyblue mb-6">
                Customize Your Perfect Trip
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Tell us what you're looking for and let our experts handle the rest
              </p>
              
              {/* Purpose Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-3">
                  Purpose of Travel
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <PurposeButton 
                    icon={<Heart className="w-5 h-5 mr-2" />}
                    label="Leisure" 
                    active={purpose === 'leisure'} 
                    onClick={() => setPurpose('leisure')} 
                  />
                  <PurposeButton 
                    icon={<Briefcase className="w-5 h-5 mr-2" />}
                    label="Business" 
                    active={purpose === 'business'} 
                    onClick={() => setPurpose('business')} 
                  />
                  <PurposeButton 
                    icon={<Users className="w-5 h-5 mr-2" />}
                    label="Family" 
                    active={purpose === 'family'} 
                    onClick={() => setPurpose('family')} 
                  />
                  <PurposeButton 
                    icon={<CreditCard className="w-5 h-5 mr-2" />}
                    label="Medical" 
                    active={purpose === 'medical'} 
                    onClick={() => setPurpose('medical')} 
                  />
                </div>
              </div>
              
              {/* Form Fields */}
              <div className="space-y-4">
                {/* Destination */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-twende-teal dark:focus:ring-twende-skyblue focus:border-transparent transition-colors"
                      placeholder="Where do you want to go?"
                    />
                  </div>
                </div>

                {/* Travel Dates */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    Travel Dates
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-twende-teal dark:focus:ring-twende-skyblue focus:border-transparent transition-colors"
                      placeholder="When are you traveling?"
                    />
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    Number of Travelers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <select
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-twende-teal dark:focus:ring-twende-skyblue focus:border-transparent transition-colors appearance-none"
                    >
                      <option value="1">1 Traveler</option>
                      <option value="2">2 Travelers</option>
                      <option value="3">3 Travelers</option>
                      <option value="4">4 Travelers</option>
                      <option value="5+">5+ Travelers</option>
                    </select>
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    Budget Range
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Budget', 'Mid-Range', 'Luxury'].map((option) => (
                      <button
                        key={option}
                        className="py-2 rounded-lg text-center transition-all bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-twende-teal hover:text-white dark:hover:bg-twende-skyblue dark:hover:text-black"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button className="w-full mt-6 py-3 bg-twende-teal hover:bg-twende-teal/90 dark:bg-twende-skyblue dark:hover:bg-twende-skyblue/90 text-white dark:text-black font-semibold rounded-lg transition-colors">
                Create My Custom Plan
              </button>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                By submitting, you agree to our Terms and Privacy Policy
              </p>
            </div>
            
            {/* Image Side */}
            <div className="hidden md:block bg-center bg-cover" style={{ backgroundImage: purpose === 'business' 
              ? 'url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80)' 
              : purpose === 'family' 
              ? 'url(https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80)'
              : purpose === 'medical'
              ? 'url(https://images.unsplash.com/photo-1631815588090-d4bfb0699ea7?auto=format&fit=crop&w=800&q=80)'
              : 'url(https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=800&q=80)'
            }}>
              <div className="h-full w-full bg-gradient-to-r from-black/50 to-transparent backdrop-blur-sm p-10 flex flex-col justify-end">
                <div className="text-white max-w-xs">
                  <h3 className="text-2xl font-bold mb-3">Expert Planning</h3>
                  <p className="text-white/80 mb-3">
                    Our team will create a personalized itinerary based on your preferences and travel style.
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/60.jpg" alt="User" />
                      <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/15.jpg" alt="User" />
                      <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/35.jpg" alt="User" />
                    </div>
                    <span className="text-sm">Our travel experts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface PurposeButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const PurposeButton = ({ icon, label, active, onClick }: PurposeButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center py-2 px-4 rounded-lg transition-all ${
        active 
          ? 'bg-twende-teal text-white dark:bg-twende-skyblue dark:text-black' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default TripPlanner;
