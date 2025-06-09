
import { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

interface CountryData {
  id: string;
  name: string;
  description: string;
  facts: string[];
  image: string;
  attractions: Array<{
    name: string;
    location: string;
    image: string;
  }>;
}

// Sample data for featured countries
const countriesData: CountryData[] = [
  {
    id: 'ghana',
    name: 'Ghana',
    description: 'Experience the vibrant culture, historic castles, and stunning beaches of Ghana. From the bustling markets of Accra to the serene shores of Cape Coast, Ghana offers a perfect blend of history, culture, and natural beauty.',
    facts: [
      'Home to Cape Coast Castle, a UNESCO World Heritage site',
      'Known for colorful Kente cloth and vibrant festivals',
      'Features beautiful beaches along the Gulf of Guinea',
    ],
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      {
        name: 'Cape Coast Castle',
        location: 'Cape Coast',
        image: 'https://images.unsplash.com/photo-1559590938-8e9e0d3a73cd?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Kakum National Park',
        location: 'Central Region',
        image: 'https://images.unsplash.com/photo-1512175596399-3b5198d07ea3?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Labadi Beach',
        location: 'Accra',
        image: 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'kenya',
    name: 'Kenya',
    description: 'Discover the magic of Kenya with its breathtaking wildlife safaris, diverse landscapes, and rich cultural heritage. From the vast plains of the Maasai Mara to the pristine beaches of the Indian Ocean, Kenya offers unforgettable experiences.',
    facts: [
      'Home to the Great Migration, one of nature\'s most spectacular wildlife events',
      'Features diverse landscapes from savannahs to mountains and beaches',
      'Rich cultural heritage with over 40 different ethnic groups',
    ],
    image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=1200&q=80',
    attractions: [
      {
        name: 'Maasai Mara',
        location: 'Narok County',
        image: 'https://images.unsplash.com/photo-1506026667107-3be3aa7058fa?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Diani Beach',
        location: 'Kwale County',
        image: 'https://images.unsplash.com/photo-1548550494-3f4db420c88b?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Mount Kenya',
        location: 'Central Kenya',
        image: 'https://images.unsplash.com/photo-1573979619856-ba85ad58e70d?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
];

const FeaturedCountry = () => {
  const [activeCountry, setActiveCountry] = useState<string>('ghana');
  
  const country = countriesData.find(c => c.id === activeCountry) || countriesData[0];
  
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center dark:text-twende-skyblue">Featured Destinations</h2>
        <p className="section-subtitle text-center dark:text-gray-300">
          Explore our primary destinations with curated experiences and local expertise
        </p>
        
        {/* Country Selector */}
        <div className="flex justify-center space-x-4 mb-12">
          {countriesData.map((countryData) => (
            <button
              key={countryData.id}
              className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${
                activeCountry === countryData.id
                  ? 'bg-twende-teal text-white dark:bg-twende-skyblue dark:text-gray-900'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveCountry(countryData.id)}
            >
              {countryData.name}
            </button>
          ))}
        </div>
        
        {/* Featured Country Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image Side */}
          <div className="rounded-2xl overflow-hidden shadow-lg transition-all duration-700 dark:shadow-none dark:ring-1 dark:ring-white/10">
            <img
              src={country.image}
              alt={country.name}
              className="w-full h-auto"
            />
          </div>
          
          {/* Content Side */}
          <div>
            <h3 className="text-3xl font-bold text-twende-teal dark:text-twende-skyblue mb-4">{country.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {country.description}
            </p>
            
            {/* Key Facts */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-3 dark:text-gray-200">Key Facts</h4>
              <ul className="space-y-2">
                {country.facts.map((fact, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-twende-orange dark:text-twende-coral mr-2">•</span>
                    <span className="dark:text-gray-300">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Top Attractions */}
            <div>
              <h4 className="text-lg font-semibold mb-4 dark:text-gray-200">Top Attractions</h4>
              <div className="grid grid-cols-3 gap-3">
                {country.attractions.map((attraction, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="relative rounded-lg overflow-hidden mb-2 dark:ring-1 dark:ring-white/10">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    </div>
                    <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{attraction.name}</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {attraction.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Explore Button */}
            <a
              href={`/destinations/${country.id}`}
              className="flex items-center text-twende-teal dark:text-twende-skyblue font-semibold mt-8 hover:underline group"
            >
              Explore {country.name}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCountry;
