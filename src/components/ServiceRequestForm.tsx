import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { serviceRequestService, Service, ServiceRequestItem } from '@/services/service-requests';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { adminAssignmentService } from '@/services/admin-assignments';
import { conversationsService } from '@/services/conversations';
import { messagesService } from '@/services/messages';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Clock,
  Plane,
  Hotel,
  Car,
  Camera,
  Shield,
  Heart
} from 'lucide-react';

interface ServiceWithState extends Service {
  selected: boolean;
  qty: number;
}

const serviceIcons: { [key: string]: React.ComponentType<any> } = {
  'flights': Plane,
  'accommodation': Hotel,
  'transport': Car,
  'activities': Camera,
  'insurance': Shield,
  default: Heart
};

const purposeOptions = [
  { value: 'leisure', label: 'Leisure & Tourism', icon: '🏖️' },
  { value: 'business', label: 'Business Travel', icon: '💼' },
  { value: 'family', label: 'Family Visit', icon: '👨‍👩‍👧‍👦' },
  { value: 'medical', label: 'Medical Tourism', icon: '🏥' },
  { value: 'education', label: 'Education/Conference', icon: '🎓' },
  { value: 'other', label: 'Other', icon: '✈️' }
];

const budgetRanges = [
  { value: 1000, label: 'Under $1,000', description: 'Budget-friendly options' },
  { value: 3000, label: '$1,000 - $3,000', description: 'Mid-range comfort' },
  { value: 5000, label: '$3,000 - $5,000', description: 'Premium experience' },
  { value: 10000, label: '$5,000 - $10,000', description: 'Luxury travel' },
  { value: 99999, label: '$10,000+', description: 'Ultra-luxury experience' }
];

export function ServiceRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState<ServiceWithState[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Enhanced form fields
  const [origin, setOrigin] = useState<string>('');
  const [destinationInput, setDestinationInput] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [travelers, setTravelers] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Prefill destination from URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dest = params.get('destination');
    if (dest) {
      setDestinationInput(dest);
    }
  }, [location.search]);

  useEffect(() => {
    serviceRequestService.getServices()
      .then(data => setServices(data.map(s => ({ ...s, selected: false, qty: 1 }))))
      .catch(err => toast({ variant: 'destructive', title: 'Error', description: err.message }));
  }, [toast]);

  const toggleSelection = (idx: number) => {
    setServices(prev => {
      const next = [...prev];
      next[idx].selected = !next[idx].selected;
      return next;
    });
  };

  const updateQty = (idx: number, qty: number) => {
    setServices(prev => {
      const next = [...prev];
      next[idx].qty = qty;
      return next;
    });
  };

  const items: ServiceRequestItem[] = services
    .filter(s => s.selected)
    .map(s => ({ service_id: s.id, qty: s.qty }));

  const totalPrice = services
    .filter(s => s.selected)
    .reduce((sum, s) => sum + ((s.rate ?? 0) * s.qty), 0);

  const handleBudgetRangeSelect = (value: number) => {
    setSelectedBudgetRange(value);
    setBudget(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!origin.trim() || !destinationInput.trim()) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please provide both origin and destination.' });
      return;
    }
    if (!purpose) {
      toast({ variant: 'destructive', title: 'Missing Purpose', description: 'Please select your travel purpose.' });
      return;
    }
    if (!description.trim()) {
      toast({ variant: 'destructive', title: 'Missing Description', description: 'Please describe your ideal travel experience.' });
      return;
    }
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Required', description: 'Please log in to submit a request.' });
      return;
    }
    if (budget <= 0) {
      toast({ variant: 'destructive', title: 'Budget Required', description: 'Please set your travel budget.' });
      return;
    }
    
    setLoading(true);
    try {
      const requestDescription = `
        Travel Purpose: ${purposeOptions.find(p => p.value === purpose)?.label || purpose}
        Travelers: ${travelers} person${travelers > 1 ? 's' : ''}
        ${startDate ? `Start Date: ${startDate}` : ''}
        ${endDate ? `End Date: ${endDate}` : ''}
        
        Experience Description: ${description.trim()}
        
        ${specialRequests.trim() ? `Special Requests: ${specialRequests.trim()}` : ''}
      `.trim();

      const newReq = await serviceRequestService.createRequest(
        user.uid,
        items,
        budget,
        totalPrice,
        origin.trim(),
        destinationInput.trim(),
        requestDescription
      );
      
      toast({ 
        title: 'Request Submitted Successfully! 🎉', 
        description: 'Our concierge team will contact you within 24 hours with your personalized travel plan.' 
      });

      // Auto-message admin about new service request
      (async () => {
        try {
          const assignment = await adminAssignmentService.getAssignmentForTraveler(user.uid);
          if (assignment) {
            const conv = await conversationsService.create({ 
              adminId: assignment.admin_id,
              travelerId: user.uid,
              title: `New Request: ${origin} → ${destinationInput}`,
              status: 'active'
            });
            
            const servicesList = items.length > 0 
              ? items.map(({ service_id, qty }) => {
                  const svc = services.find(s => s.id === service_id);
                  return `${svc?.name ?? 'Service'} x${qty}`;
                }).join(', ')
              : 'Custom concierge service';
            
            const msgText = `🆕 New concierge request from ${user.displayName || 'Traveler'}:

📍 Route: ${origin.trim()} ➔ ${destinationInput.trim()}
🎯 Purpose: ${purposeOptions.find(p => p.value === purpose)?.label || purpose}
👥 Travelers: ${travelers}
💰 Budget: $${budget.toLocaleString()}
${startDate ? `📅 Start: ${startDate}` : ''}
${endDate ? `📅 End: ${endDate}` : ''}

📝 Details: ${description.trim()}

${servicesList ? `🛍️ Services: ${servicesList}` : ''}
${specialRequests.trim() ? `⭐ Special: ${specialRequests.trim()}` : ''}`;

            await messagesService.send({ conversation_id: conv.id, content: msgText });
          }
        } catch (err) {
          console.error('Failed to auto-notify admin:', err);
        }
      })();
      
      navigate('/dashboard?tab=requests');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Submission Failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tell Us About Your Trip</h3>
        <p className="text-sm text-gray-600">We'll use this information to create your perfect travel experience</p>
      </div>

      {/* Origin & Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4 text-twende-teal" />
            Where are you traveling from?
          </label>
          <input
            type="text"
            value={origin}
            onChange={e => setOrigin(e.target.value)}
            placeholder="e.g. New York, USA"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-twende-teal focus:border-transparent"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4 text-orange-500" />
            Where would you like to go?
          </label>
          <input
            type="text"
            value={destinationInput}
            onChange={e => setDestinationInput(e.target.value)}
            placeholder="e.g. Accra, Ghana"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-twende-teal focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Purpose */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MessageSquare className="w-4 h-4 text-twende-teal" />
          What's the purpose of your trip?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {purposeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPurpose(option.value)}
              className={`p-3 border rounded-lg text-left transition-all ${
                purpose === option.value
                  ? 'border-twende-teal bg-twende-teal/5 text-twende-teal'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Travelers & Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="w-4 h-4 text-twende-teal" />
            Number of travelers
          </label>
          <select
            value={travelers}
            onChange={e => setTravelers(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-twende-teal focus:border-transparent"
          >
            {[1,2,3,4,5,6,7,8,9,10].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 text-twende-teal" />
            Departure date (optional)
          </label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-twende-teal focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 text-twende-teal" />
            Return date (optional)
          </label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-twende-teal focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={() => setStep(2)}
          className="bg-twende-teal hover:bg-twende-teal/90 text-white px-6 py-2"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Describe Your Dream Experience</h3>
        <p className="text-sm text-gray-600">Help us understand what makes this trip special for you</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Heart className="w-4 h-4 text-orange-500" />
          What's your ideal travel experience?
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Tell us about your interests, preferred activities, accommodation style, dining preferences, and anything else that would make this trip perfect for you..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-twende-teal focus:border-transparent h-32 resize-none"
          required
        />
        <p className="text-xs text-gray-500">Be as detailed as possible - this helps us create a personalized experience just for you!</p>
      </div>

      {/* Special Requests */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Shield className="w-4 h-4 text-twende-teal" />
          Any special requests or requirements? (optional)
        </label>
        <textarea
          value={specialRequests}
          onChange={e => setSpecialRequests(e.target.value)}
          placeholder="Dietary restrictions, accessibility needs, celebration occasions, preferred airlines, hotel chains, etc."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-twende-teal focus:border-transparent h-24 resize-none"
        />
      </div>

      <div className="flex justify-between">
        <Button 
          type="button" 
          onClick={() => setStep(1)}
          variant="outline"
          className="border-gray-300 text-gray-700 px-6 py-2"
        >
          Back
        </Button>
        <Button 
          type="button" 
          onClick={() => setStep(3)}
          className="bg-twende-teal hover:bg-twende-teal/90 text-white px-6 py-2"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Your Budget</h3>
        <p className="text-sm text-gray-600">Choose a budget range that works for you - we'll maximize value within it</p>
      </div>

      {/* Budget Range Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <DollarSign className="w-4 h-4 text-green-600" />
          Select your budget range
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {budgetRanges.map((range) => (
            <button
              key={range.value}
              type="button"
              onClick={() => handleBudgetRangeSelect(range.value)}
              className={`p-4 border rounded-lg text-left transition-all ${
                selectedBudgetRange === range.value
                  ? 'border-twende-teal bg-twende-teal/5 text-twende-teal'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{range.label}</div>
              <div className="text-sm text-gray-600 mt-1">{range.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Budget */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Or enter a specific budget amount</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="number"
            min={100}
            step={100}
            value={budget || ''}
            onChange={e => setBudget(parseFloat(e.target.value) || 0)}
            placeholder="Enter your budget"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-twende-teal focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500">
          Don't worry about exact amounts - we'll work within your budget to create the best possible experience
        </p>
      </div>

      {/* Optional Services */}
      {services.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Optional: Select specific services you definitely want included
          </label>
          <div className="grid grid-cols-1 gap-3">
            {services.map((service, idx) => {
              const IconComponent = serviceIcons[service.name.toLowerCase()] || serviceIcons.default;
              return (
                <div key={service.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <Checkbox
                    checked={service.selected}
                    onCheckedChange={() => toggleSelection(idx)}
                    id={`svc-${service.id}`}
                  />
                  <IconComponent className="w-5 h-5 text-twende-teal" />
                  <div className="flex-1">
                    <label htmlFor={`svc-${service.id}`} className="font-medium text-gray-900">
                      {service.name}
                    </label>
                    {service.rate != null && (
                      <p className="text-sm text-gray-600">From ${service.rate.toFixed(2)}</p>
                    )}
                  </div>
                  {service.selected && (
                    <input
                      type="number"
                      min={1}
                      value={service.qty}
                      onChange={e => updateQty(idx, parseInt(e.target.value) || 1)}
                      className="w-16 p-2 border border-gray-300 rounded"
                    />
                  )}
                </div>
              );
            })}
          </div>
          {totalPrice > 0 && (
            <div className="p-3 bg-twende-teal/5 border border-twende-teal/20 rounded-lg">
              <p className="font-medium text-twende-teal">
                Selected services total: ${totalPrice.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <Button 
          type="button" 
          onClick={() => setStep(2)}
          variant="outline"
          className="border-gray-300 text-gray-700 px-6 py-2"
        >
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={loading || budget <= 0}
          className="bg-twende-teal hover:bg-twende-teal/90 text-white px-8 py-2"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              Submitting...
            </div>
          ) : (
            'Submit Request 🚀'
          )}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-gray-900">Create Your Concierge Request</CardTitle>
        <CardDescription className="text-gray-600">
          Our expert team will handle every detail of your perfect African adventure
        </CardDescription>
        
        {/* Progress Indicator */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum 
                    ? 'bg-twende-teal text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded ${
                    step > stepNum ? 'bg-twende-teal' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </form>
      </CardContent>
    </Card>
  );
}
