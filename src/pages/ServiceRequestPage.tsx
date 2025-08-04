import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceRequestForm } from '@/components/ServiceRequestForm';
import { ArrowLeft, MessageCircle, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ServiceRequestPage = () => {
  const navigate = useNavigate();

  const testimonials = [
    { 
      name: "Sarah Johnson", 
      location: "New York", 
      text: "They planned my entire Kenya safari trip. Everything was perfect - from the luxury lodge to the cultural experiences!", 
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    { 
      name: "Marcus Chen", 
      location: "Toronto", 
      text: "Business trip to Ghana became so easy. They handled meetings, accommodations, and even arranged local networking events.", 
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/24.jpg"
    },
    { 
      name: "Emma Williams", 
      location: "London", 
      text: "Family vacation to South Africa was stress-free. The kids loved every activity they planned for us!", 
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/45.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-twende-beige via-orange-50 to-white">
      {/* Header */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 text-gray-600 hover:text-twende-teal"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Plan Your Perfect 
            <span className="text-twende-teal block">African Adventure</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Tell us your dreams, budget, and preferences. Our expert concierge team will craft a 
            personalized travel experience that exceeds your expectations.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>4.9/5 from 500+ travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-twende-teal" />
              <span>24/7 concierge support</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-twende-teal" />
              <span>Response within 2 hours</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Request Form */}
          <div className="lg:col-span-2">
            <ServiceRequestForm />
          </div>

          {/* Testimonials Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">What Our Travelers Say</CardTitle>
                <CardDescription>Real experiences from real travelers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700">"{testimonial.text}"</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="bg-gradient-to-br from-twende-teal to-twende-teal/80 text-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Our concierge team is available 24/7 to answer any questions and assist with your travel planning.
                </p>
                <Button 
                  onClick={() => navigate('/chat')}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20 w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Expert
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestPage;
