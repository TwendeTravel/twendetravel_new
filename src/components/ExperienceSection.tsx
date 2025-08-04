import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { experiencesService, type Experience } from '@/services/experiences';
import { Loader } from './Loader';

const ExperienceSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await experiencesService.getAll();
        setExperiences(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const nextExperience = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % experiences.length);
  };

  const prevExperience = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + experiences.length) % experiences.length);
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="py-20 text-center">
        <p>No experiences found.</p>
      </div>
    );
  }

  return (
    <section id="experiences" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-twende-teal dark:text-twende-skyblue">
          Unforgettable Experiences
        </h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
          Discover authentic travel experiences curated by our expert local guides
        </p>

        {/* Experience Showcase - Mobile Carousel */}
        <div className="relative mt-12 md:hidden">
          <div className="overflow-hidden rounded-xl">
            <div className="relative h-96">
              <img
                src={experiences[currentIndex].image}
                alt={experiences[currentIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-medium bg-twende-orange rounded-full">
                  {experiences[currentIndex].category}
                </span>
                <h3 className="text-2xl font-bold mb-2">{experiences[currentIndex].title}</h3>
                <p className="text-white/90">{experiences[currentIndex].description}</p>
                <button className="mt-4 px-4 py-2 bg-white text-twende-teal dark:bg-twende-skyblue dark:text-black font-medium rounded-lg hover:bg-opacity-90 transition-all">
                  Explore
                </button>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/50 transition-colors"
            onClick={prevExperience}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/50 transition-colors"
            onClick={nextExperience}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          
          {/* Indicator Dots */}
          <div className="flex justify-center space-x-2 mt-4">
            {experiences.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-twende-teal dark:bg-twende-skyblue' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => setCurrentIndex(index)}
              ></button>
            ))}
          </div>
        </div>
        
        {/* Experience Grid - Desktop */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {experiences.map((experience, index) => (
            <div 
              key={experience.id}
              className="relative group overflow-hidden rounded-xl h-80 animate-fade-in bg-gray-100 dark:bg-gray-800/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={experience.image}
                alt={experience.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-medium bg-twende-orange rounded-full">
                  {experience.category}
                </span>
                <h3 className="text-xl font-bold mb-2">{experience.title}</h3>
                <p className="text-white/90 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {experience.description}
                </p>
                <button className="px-4 py-2 bg-white dark:bg-twende-skyblue text-twende-teal dark:text-black font-medium rounded-lg hover:bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-twende-teal hover:bg-twende-teal/90 dark:bg-twende-skyblue dark:hover:bg-twende-skyblue/90 dark:text-black text-white font-semibold rounded-lg transition-colors">
            Browse All Experiences
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
