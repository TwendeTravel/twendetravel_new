
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Business Traveler',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    text: 'Twende made my business trip to Nairobi seamless. My airport pickup was on time, the hotel was perfect for meetings, and their 24/7 support helped when my schedule changed at the last minute.',
    trip: 'Business Trip to Nairobi, Kenya',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    title: 'Adventure Seeker',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    text: 'The safari experience in Maasai Mara exceeded all my expectations. Our guide knew exactly where to find incredible wildlife, and the accommodations were the perfect blend of luxury and authenticity.',
    trip: 'Safari Adventure in Kenya',
  },
  {
    id: 3,
    name: 'Elena Ramirez',
    title: 'Family Traveler',
    image: 'https://randomuser.me/api/portraits/women/63.jpg',
    text: 'Traveling with three young children to Ghana could have been stressful, but Twende made it worry-free. The kid-friendly activities and accommodations were perfect, and having local support was invaluable.',
    trip: 'Family Vacation in Ghana',
  },
  {
    id: 4,
    name: 'James Okafor',
    title: 'Photographer',
    image: 'https://randomuser.me/api/portraits/men/35.jpg',
    text: 'As a travel photographer, I needed access to unique locations and the best times to capture them. Twende\'s local experts took me to incredible spots I would never have found on my own.',
    trip: 'Photography Tour across Ghana',
  },
  {
    id: 5,
    name: 'Priya Patel',
    title: 'Solo Traveler',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'My first solo trip to Africa was made so much easier with Twende. I felt safe, had wonderful experiences with local communities, and their app helped me stay organized throughout the journey.',
    trip: 'Cultural Exploration in West Africa',
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-twende-teal dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
          Traveler Stories
        </h2>
        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-16 text-center">
          Hear what our travelers have to say about their Twende experiences
        </p>
        
        {/* Desktop Testimonial Carousel */}
        <div className="hidden md:block relative max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {[0, 1, 2].map((offset) => {
              const index = (currentIndex + offset) % testimonials.length;
              return (
                <div
                  key={testimonials[index].id}
                  className={`glass-card transform transition-all duration-500 ${
                    offset === 1 ? 'scale-105 z-10' : 'scale-95 opacity-80'
                  }`}
                >
                  <Quote className="text-twende-orange mb-4" size={32} />
                  <p className="text-white/90 mb-6 font-caveat text-xl">
                    {testimonials[index].text}
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonials[index].image}
                      alt={testimonials[index].name}
                      className="w-12 h-12 rounded-full mr-4 border-2 border-white/20"
                    />
                    <div>
                      <h4 className="font-bold text-white">{testimonials[index].name}</h4>
                      <p className="text-sm text-white/70">{testimonials[index].trip}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-center mt-10 space-x-4">
            <button
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              onClick={prevTestimonial}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              onClick={nextTestimonial}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Testimonial Carousel */}
        <div className="md:hidden relative max-w-md mx-auto">
          <div className="glass-card">
            <Quote className="text-twende-orange mb-4" size={32} />
            <p className="text-white/90 mb-6 font-caveat text-xl">
              {testimonials[currentIndex].text}
            </p>
            <div className="flex items-center">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-12 h-12 rounded-full mr-4 border-2 border-white/20"
              />
              <div>
                <h4 className="font-bold text-white">{testimonials[currentIndex].name}</h4>
                <p className="text-sm text-white/70">{testimonials[currentIndex].trip}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              onClick={prevTestimonial}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center space-x-1">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                ></button>
              ))}
            </div>
            <button
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              onClick={nextTestimonial}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

