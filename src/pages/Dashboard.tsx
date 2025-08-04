import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  MessageSquare,
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Phone,
  MapPin,
  Star,
  User,
  Settings,
  Bell,
  BookOpen,
  Plane,
  Key,
  Shield
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardDestinations from "@/components/dashboard/DashboardDestinations";
import UpcomingTrips from "@/components/dashboard/UpcomingTrips";
import ServiceRequestsPanel from "@/components/dashboard/ServiceRequestsPanel";
import PageTransition from "@/components/PageTransition";
import { ServiceRequestForm } from '@/components/ServiceRequestForm';
import Chat from './Chat';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from '@/components/Loader';
import { auth } from '@/lib/firebase';
import { roleService } from '@/services/roles';
import { serviceRequestService } from '@/services/service-requests';
import { conversationsService } from '@/services/conversations';
import { TravelDoodles, EmptyStateIllustrations, DecorativeElements } from "@/components/ui/travel-doodles";
import TravelPatternBackground from "@/components/ui/travel-pattern-background";
import WhatsAppStyleTravelBackground from "@/components/ui/whatsapp-style-travel-background";
import AuthenticWhatsAppTravelBackground from "@/components/ui/authentic-whatsapp-travel-background";
import WorkingWhatsAppBackground from "@/components/ui/working-whatsapp-background";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "overview";
  const { isAdmin, isLoading: roleLoading } = useRole();
  const { user } = useAuth();
  const viewAsTraveller = searchParams.get("viewAs") === "traveller";
  const effectiveIsAdmin = isAdmin && !viewAsTraveller;
  const [stats, setStats] = useState({ 
    totalRequests: 0, 
    activeTrips: 0, 
    completedTrips: 0, 
    pendingRequests: 0,
    unreadMessages: 0
  });
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  
  // AI Assistant state
  const [assistantMessages, setAssistantMessages] = useState<Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>>([
    {
      id: '1',
      text: "Hello! I'm your AI travel assistant. I can help you with destination recommendations, travel planning advice, cultural insights, itinerary suggestions, and travel tips. What can I help you with today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [assistantInput, setAssistantInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    type: 'request' | 'message' | 'booking' | 'system';
    title: string;
    description: string;
    timestamp: Date;
    status?: string;
    icon: any;
    iconColor: string;
  }>>([]);
  
  useEffect(() => {
    // Load concierge-focused data
    if (effectiveIsAdmin) {
      // Admin dashboard data
      serviceRequestService.getAll().then(requests => {
        const total = requests.length;
        const pending = requests.filter(r => r.status === 'pending').length;
        setStats(prev => ({ ...prev, totalRequests: total, pendingRequests: pending }));
        setRecentRequests(requests.slice(0, 5));
      });
      
      conversationsService.firestoreService.getAll().then(conversations => {
        const unread = conversations.filter(c => c.status !== 'read').length;
        setStats(prev => ({ ...prev, unreadMessages: unread }));
        setRecentConversations(conversations.slice(0, 5));
      });
    } else {
      // Traveler concierge dashboard data
      const userId = auth.currentUser?.uid;
      if (userId) {
        serviceRequestService.getAll().then(requests => {
          const userRequests = requests.filter(r => r.userId === userId);
          const active = userRequests.filter(r => ['confirmed', 'in_progress'].includes(r.status)).length;
          const completed = userRequests.filter(r => r.status === 'completed').length;
          const pending = userRequests.filter(r => r.status === 'pending').length;
          
          setStats(prev => ({ 
            ...prev, 
            activeTrips: active, 
            completedTrips: completed, 
            pendingRequests: pending,
            totalRequests: userRequests.length
          }));
          setRecentRequests(userRequests.slice(0, 3));
        });
      }
    }
  }, [effectiveIsAdmin]);

  // Load comprehensive recent activity
  useEffect(() => {
    const loadRecentActivity = async () => {
      const activities: any[] = [];
      const userId = auth.currentUser?.uid;
      
      if (userId) {
        try {
          // Get service requests
          const requests = await serviceRequestService.getAll();
          const userRequests = effectiveIsAdmin ? requests : requests.filter(r => r.userId === userId);
          
          userRequests.slice(0, 3).forEach(request => {
            activities.push({
              id: `request-${request.id}`,
              type: 'request',
              title: `${request.type.charAt(0).toUpperCase() + request.type.slice(1)} Service Request`,
              description: request.description.length > 50 ? `${request.description.substring(0, 50)}...` : request.description,
              timestamp: new Date(request.createdAt.seconds * 1000),
              status: request.status,
              icon: request.type === 'flight' ? Plane : 
                    request.type === 'hotel' ? MapPin : 
                    request.type === 'transport' ? MapPin : 
                    request.type === 'visa' ? FileText : MapPin,
              iconColor: request.status === 'pending' ? '#EF4444' : 
                        request.status === 'in_progress' ? '#F59E0B' : 
                        request.status === 'completed' ? '#10B981' : '#6B7280'
            });
          });

          // Get conversations/messages
          const conversations = await conversationsService.firestoreService.getAll();
          const userConversations = effectiveIsAdmin ? conversations : conversations.filter(c => c.travelerId === userId);
          
          userConversations.slice(0, 2).forEach(conv => {
            activities.push({
              id: `message-${conv.id}`,
              type: 'message',
              title: effectiveIsAdmin ? `Message from Traveler` : `Support Conversation`,
              description: `${conv.title || 'Travel Support'}`,
              timestamp: new Date(conv.updatedAt.seconds * 1000),
              icon: MessageSquare,
              iconColor: '#3B82F6'
            });
          });

          // Add welcome message only for new users (within last 24 hours)
          if (!effectiveIsAdmin) {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            
            // Only show welcome for very new users, and only if no other activities exist
            if (activities.length === 0) {
              activities.push({
                id: 'system-welcome',
                type: 'system',
                title: 'Welcome to Twende Travel',
                description: 'Your account is ready for amazing African adventures',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                icon: Plane,
                iconColor: '#059669'
              });
              
              // Add some helpful getting started activities for new users
              activities.push({
                id: 'system-tip',
                type: 'system',
                title: 'Getting Started',
                description: 'Explore our destinations or request your first service to begin your journey',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
                icon: BookOpen,
                iconColor: '#3B82F6'
              });
            }
          }

          // Sort by timestamp (newest first) and limit
          activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          setRecentActivity(activities.slice(0, 5));
          
        } catch (error) {
          console.error('Error loading recent activity:', error);
        }
      }
    };

    loadRecentActivity();
  }, [effectiveIsAdmin]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages]);

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader size="lg" />
      </div>
    );
  }

  const handleNewRequest = () => {
    setSearchParams({ tab: 'new-request' });
  };

  const handleContact = () => {
    setSearchParams({ tab: 'messages' });
  };

  // AI Assistant functions
  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('destination') || message.includes('recommend') || message.includes('where')) {
      return "Based on your interests, I'd recommend exploring Ghana's vibrant culture in Accra, Kenya's incredible safari experiences in Maasai Mara, or South Africa's stunning Cape Town. Each offers unique experiences - from historical sites and local cuisine to wildlife adventures and scenic landscapes. What type of experience are you most interested in?";
    }
    
    if (message.includes('visa') || message.includes('document')) {
      return "Visa requirements vary by your nationality and destination. For Ghana, Kenya, and South Africa, many countries can get visas on arrival or e-visas. I recommend checking with the embassy of your destination country. Our concierge team can also help with visa applications and document preparation. Would you like me to connect you with them?";
    }
    
    if (message.includes('best time') || message.includes('when') || message.includes('weather')) {
      return "The best time to visit varies by region: Ghana is great year-round but dry season (Nov-Mar) is ideal. Kenya's best safari season is during dry months (Jun-Oct). South Africa is lovely year-round, but their summer (Oct-Mar) offers warm weather. What specific activities are you planning?";
    }
    
    if (message.includes('culture') || message.includes('custom') || message.includes('tradition')) {
      return "African cultures are incredibly diverse and welcoming! Key tips: Greet people warmly, respect local customs, try traditional foods, and engage with local communities. In Ghana, try fufu and jollof rice. In Kenya, experience Maasai culture. In South Africa, explore the rich history and diverse traditions. Always ask before taking photos of people. Would you like specific cultural tips for any country?";
    }
    
    if (message.includes('safari') || message.includes('wildlife') || message.includes('animal')) {
      return "Africa offers world-class safari experiences! Kenya's Maasai Mara and South Africa's Kruger National Park are fantastic for the Big Five. Best safari times are early morning and late afternoon. Pack neutral colors, binoculars, and a good camera. Our team can arrange guided safaris with expert rangers. Are you interested in a specific type of wildlife experience?";
    }
    
    if (message.includes('food') || message.includes('eat') || message.includes('cuisine')) {
      return "African cuisine is amazing! Try jollof rice and kelewele in Ghana, nyama choma and ugali in Kenya, and braai and bobotie in South Africa. Street food is generally safe from reputable vendors. Our local guides can recommend the best authentic restaurants and food experiences. Any dietary restrictions I should know about?";
    }
    
    if (message.includes('budget') || message.includes('cost') || message.includes('price')) {
      return "Travel costs vary widely. Budget travelers can manage on $30-50/day, mid-range $50-100/day, and luxury $150+/day. This includes accommodation, meals, and activities. Our concierge service can help optimize your budget and find great value experiences. What's your approximate budget range?";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! It's great to connect with you. I'm here to help make your African travel dreams come true. Whether you're looking for adventure, culture, wildlife, or relaxation, I can provide personalized recommendations. What brings you to explore Africa?";
    }
    
    // Default response
    return "That's a great question! Africa offers incredible diversity in experiences, cultures, and landscapes. I'd love to help you plan the perfect trip. Could you tell me more about what you're looking for - are you interested in wildlife safaris, cultural experiences, adventure activities, or something else? Our concierge team is also available for detailed, personalized planning.";
  };

  const handleSendMessage = (message: string = assistantInput) => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setAssistantMessages(prev => [...prev, userMessage]);
    setAssistantInput('');
    setIsAiTyping(true);
    
    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(message),
        isUser: false,
        timestamp: new Date()
      };
      setAssistantMessages(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-twende-beige via-orange-50 to-white relative">
        {/* Test Working WhatsApp Background */}
        <WorkingWhatsAppBackground opacity={0.2} />
        
        <DashboardHeader />
        <DashboardSidebar />
        
        {/* Main Content Area - Scrollable */}
        <main className="fixed top-16 left-0 md:left-64 right-0 bottom-0 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-6 relative z-10">
            {/* Welcome Header - Mobile Optimized */}
            <motion.div 
              className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-4 lg:p-6 shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Travel doodles for welcome section */}
              <div className="absolute top-2 right-2">
                <TravelDoodles.Airplane className="w-8 h-8" color="#1A5F7A" />
              </div>
              <div className="absolute bottom-2 left-2">
                <TravelDoodles.Globe className="w-6 h-6" color="#4D724D" />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                    {effectiveIsAdmin ? 'Admin Dashboard' : 'Welcome back!'}
                  </h1>
                  <p className="text-sm lg:text-base text-gray-600">
                    {effectiveIsAdmin 
                      ? 'Manage all traveler requests and communications'
                      : 'Your personalized travel concierge at your service'
                    }
                  </p>
                </div>
                {!effectiveIsAdmin && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleNewRequest}
                      className="bg-twende-teal hover:bg-twende-teal/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">New Request</span>
                    </Button>
                    <Button 
                      onClick={handleContact}
                      variant="outline"
                      className="border-twende-teal text-twende-teal hover:bg-twende-teal hover:text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Contact</span>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                if (value === "overview") {
                  setSearchParams({});
                } else {
                  setSearchParams({ tab: value });
                }
              }}
              className="space-y-6"
            >
              {/* Overview Tab - Concierge Focus */}
              <TabsContent value="overview" className="space-y-6">
                {effectiveIsAdmin ? (
                  // Admin Overview
                  <>
                    {/* Admin Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg relative overflow-hidden">
                          <CardContent className="p-4">
                            <div className="absolute top-1 right-1">
                              <TravelDoodles.Suitcase className="w-6 h-6" color="#EF4444" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
                                <p className="text-xs text-gray-600">Pending Requests</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg relative overflow-hidden">
                          <CardContent className="p-4">
                            <div className="absolute top-1 right-1">
                              <TravelDoodles.Passport className="w-5 h-6" color="#3B82F6" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
                                <p className="text-xs text-gray-600">Total Requests</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg relative overflow-hidden">
                          <CardContent className="p-4">
                            <div className="absolute top-1 right-1">
                              <TravelDoodles.Globe className="w-5 h-5" color="#10B981" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</p>
                                <p className="text-xs text-gray-600">Unread Messages</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeTrips}</p>
                                <p className="text-xs text-gray-600">Active Trips</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    {/* Recent Activity */}
                    <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg col-span-full">
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Platform Activity</CardTitle>
                        <CardDescription>Latest activity across the Twende Travel platform</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {recentActivity.slice(0, 6).map((activity, index) => (
                            <motion.div 
                              key={activity.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                                style={{ backgroundColor: `${activity.iconColor}15` }}
                              >
                                <activity.icon className="w-4 h-4" style={{ color: activity.iconColor }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 leading-tight">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {activity.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  {activity.status && (
                                    <Badge 
                                      variant={
                                        activity.status === 'pending' ? 'destructive' : 
                                        activity.status === 'confirmed' ? 'default' :
                                        activity.status === 'completed' ? 'secondary' : 'outline'
                                      }
                                      className="text-xs"
                                    >
                                      {activity.status}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {activity.timestamp.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {recentActivity.length === 0 && (
                            <div className="flex flex-col items-center py-8 col-span-full">
                              <EmptyStateIllustrations.NoTrips className="w-20 h-20 mb-3" />
                              <p className="text-sm text-gray-500 text-center">No recent activity</p>
                              <p className="text-xs text-gray-400 text-center mt-1">Platform activity will appear here</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  // Traveler Overview - Concierge Focus
                  <>
                    {/* Status Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg relative overflow-hidden">
                          <CardContent className="p-4">
                            <div className="absolute top-1 right-1">
                              <TravelDoodles.Airplane className="w-6 h-6" color="#10B981" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeTrips}</p>
                                <p className="text-xs text-gray-600">Active Trips</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg relative overflow-hidden">
                          <CardContent className="p-4">
                            <div className="absolute top-1 right-1">
                              <TravelDoodles.Map className="w-6 h-5" color="#D97706" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-yellow-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
                                <p className="text-xs text-gray-600">Pending Requests</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg relative overflow-hidden">
                          <CardContent className="p-4">
                            <div className="absolute top-1 right-1">
                              <TravelDoodles.Camera className="w-6 h-5" color="#3B82F6" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.completedTrips}</p>
                                <p className="text-xs text-gray-600">Completed Trips</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg relative overflow-hidden">
                          <CardContent className="p-4">
                            <div className="absolute top-1 right-1">
                              <TravelDoodles.PalmTree className="w-4 h-6" color="#7C3AED" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Star className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">4.9</p>
                                <p className="text-xs text-gray-600">Service Rating</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    {/* Concierge Service Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-gradient-to-br from-twende-teal to-twende-teal/80 text-white shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">24/7 Concierge Support</h3>
                              <p className="text-sm opacity-90 mb-4">
                                Your personal travel assistant is always available to help with any needs during your journey.
                              </p>
                              <Button 
                                onClick={handleContact}
                                variant="secondary" 
                                size="sm"
                                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Contact Now
                              </Button>
                            </div>
                            <MessageCircle className="w-12 h-12 opacity-20" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Request New Service</h3>
                              <p className="text-sm opacity-90 mb-4">
                                Tell us what you need - from flights to local experiences, we handle everything.
                              </p>
                              <Button 
                                onClick={handleNewRequest}
                                variant="secondary" 
                                size="sm"
                                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                New Request
                              </Button>
                            </div>
                            <Plus className="w-12 h-12 opacity-20" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg">Your Recent Activity</CardTitle>
                        <CardDescription>Track your service requests, messages, and travel updates</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {recentActivity.map((activity, index) => (
                            <motion.div 
                              key={activity.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                                style={{ backgroundColor: `${activity.iconColor}15` }}
                              >
                                <activity.icon className="w-4 h-4" style={{ color: activity.iconColor }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 leading-tight">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {activity.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  {activity.status && (
                                    <Badge 
                                      variant={
                                        activity.status === 'pending' ? 'destructive' : 
                                        activity.status === 'confirmed' ? 'default' :
                                        activity.status === 'completed' ? 'secondary' : 'outline'
                                      }
                                      className="text-xs"
                                    >
                                      {activity.status}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {recentActivity.length === 0 && (
                            <div className="text-center py-8">
                              <EmptyStateIllustrations.NoTrips className="w-20 h-20 mx-auto mb-4" />
                              <p className="text-sm text-gray-500 mb-2">No recent activity</p>
                              <p className="text-xs text-gray-400 mb-4">Start your travel journey with us</p>
                              <Button 
                                onClick={handleNewRequest}
                                size="sm"
                                className="bg-twende-teal hover:bg-twende-teal/90"
                              >
                                Create Your First Request
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
              
              {/* My Trips Tab - For Travelers */}
              <TabsContent value="my-trips">
                <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Calendar className="h-5 w-5 text-twende-teal" />
                      My Trips
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      All your trips managed by our concierge team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UpcomingTrips extended={true} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* New Request Tab - For Travelers */}
              <TabsContent value="new-request">
                <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Plus className="h-5 w-5 text-twende-teal" />
                      New Service Request
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Tell us what you need - we'll handle all the details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 p-4 bg-twende-teal/5 border border-twende-teal/20 rounded-lg">
                      <h3 className="font-semibold text-twende-teal mb-2">How Our Concierge Service Works</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-twende-teal text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                          <div>
                            <p className="font-medium">Tell Us Your Needs</p>
                            <p className="text-gray-600">Share your budget, purpose, and expectations</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-twende-teal text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                          <div>
                            <p className="font-medium">We Plan Everything</p>
                            <p className="text-gray-600">Flights, hotels, activities, local transport</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-twende-teal text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                          <div>
                            <p className="font-medium">Enjoy Your Trip</p>
                            <p className="text-gray-600">24/7 support throughout your journey</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ServiceRequestForm />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Requests Tab */}
              <TabsContent value="requests">
                <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <FileText className="h-5 w-5 text-twende-teal" />
                      {effectiveIsAdmin ? 'All Service Requests' : 'My Service Requests'}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {effectiveIsAdmin 
                        ? 'Manage all traveler service requests' 
                        : 'Track the status of your travel requests'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ServiceRequestsPanel extended={true} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Messages Tab */}
              <TabsContent value="messages">
                <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-twende-teal to-twende-teal/80 text-white">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <h2 className="font-semibold">24/7 Concierge Support</h2>
                    </div>
                    <p className="text-sm opacity-90 mt-1">
                      {effectiveIsAdmin 
                        ? 'Chat with travelers and provide assistance'
                        : 'Get instant help from our travel experts'
                      }
                    </p>
                  </div>
                  <div className="h-[600px]">
                    <Chat />
                  </div>
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Settings className="h-5 w-5 text-twende-teal" />
                      {effectiveIsAdmin ? 'Admin Settings' : 'Profile Settings'}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {effectiveIsAdmin 
                        ? 'Manage system settings and preferences'
                        : 'Update your travel preferences and account details'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Quick Settings Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <User className="h-5 w-5 text-twende-teal" />
                            <h3 className="font-semibold text-gray-900">Profile Information</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Update your personal details, contact information, and travel preferences.
                          </p>
                          <Link 
                            to="/profile" 
                            className="inline-flex items-center gap-2 bg-twende-teal text-white px-4 py-2 rounded-lg hover:bg-twende-teal/90 transition-colors"
                          >
                            <User className="h-4 w-4" />
                            Manage Profile
                          </Link>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <Key className="h-5 w-5 text-twende-teal" />
                            <h3 className="font-semibold text-gray-900">Security & Privacy</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Manage your password, two-factor authentication, and privacy settings.
                          </p>
                          <Link 
                            to="/profile" 
                            className="inline-flex items-center gap-2 bg-twende-teal text-white px-4 py-2 rounded-lg hover:bg-twende-teal/90 transition-colors"
                          >
                            <Shield className="h-4 w-4" />
                            Security Settings
                          </Link>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <Bell className="h-5 w-5 text-twende-teal" />
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Control how and when you receive notifications about your trips.
                          </p>
                          <Link 
                            to="/profile" 
                            className="inline-flex items-center gap-2 bg-twende-teal text-white px-4 py-2 rounded-lg hover:bg-twende-teal/90 transition-colors"
                          >
                            <Bell className="h-4 w-4" />
                            Notification Settings
                          </Link>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <Plane className="h-5 w-5 text-twende-teal" />
                            <h3 className="font-semibold text-gray-900">Quick Preferences</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Quick access to travel preferences and emergency contacts.
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-4">
                            <select className="text-xs p-2 border border-gray-300 rounded">
                              <option>Economy</option>
                              <option>Business</option>
                              <option>First</option>
                            </select>
                            <select className="text-xs p-2 border border-gray-300 rounded">
                              <option>USD</option>
                              <option>EUR</option>
                              <option>GBP</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Current User Info Summary */}
                      <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <h3 className="font-semibold text-gray-900 mb-3">Current Account</h3>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-twende-teal rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user?.displayName || 'Update your name'}
                            </p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {user?.emailVerified ? (
                                <>
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  <span className="text-xs text-green-600">Verified</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-3 w-3 text-amber-600" />
                                  <span className="text-xs text-amber-600">Unverified</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Action */}
                      <div className="pt-4 border-t">
                        <Link 
                          to="/profile" 
                          className="inline-flex items-center gap-2 bg-twende-teal text-white px-6 py-3 rounded-lg hover:bg-twende-teal/90 transition-colors font-medium"
                        >
                          <Settings className="h-5 w-5" />
                          Open Complete Profile Settings
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services">
                <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Request New Service</CardTitle>
                    <CardDescription>Tell us about your travel needs and we'll handle everything</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ServiceRequestForm />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Flights Tab */}
              <TabsContent value="flights">
                <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Flight Management</CardTitle>
                    <CardDescription>Manage your flight bookings and search for new flights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Flight Services Coming Soon</h3>
                      <p className="text-gray-500 mb-6">Our flight booking and management features are being developed</p>
                      <Button 
                        onClick={() => setSearchParams({ tab: 'services' })}
                        className="bg-twende-teal hover:bg-twende-teal/90"
                      >
                        Request Flight Assistance
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Travel Assistant Tab */}
              <TabsContent value="assistant">
                <Card className="bg-white/80 backdrop-blur border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-twende-teal" />
                      AI Travel Assistant
                    </CardTitle>
                    <CardDescription>Get instant travel advice, recommendations, and planning help</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex flex-col h-[600px]">
                      {/* Chat Messages Area */}
                      <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 space-y-4">
                        {assistantMessages.map((message) => (
                          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'items-start gap-3'}`}>
                            {!message.isUser && (
                              <div className="w-8 h-8 bg-twende-teal rounded-full flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <div className={`rounded-lg p-3 shadow-sm max-w-md ${
                              message.isUser 
                                ? 'bg-twende-teal text-white ml-auto' 
                                : 'bg-white text-gray-800'
                            }`}>
                              <p className="whitespace-pre-wrap">{message.text}</p>
                              <p className={`text-xs mt-1 ${
                                message.isUser ? 'text-twende-beige' : 'text-gray-500'
                              }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            {message.isUser && (
                              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                        {isAiTyping && (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-twende-teal rounded-full flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white text-gray-800 rounded-lg p-3 shadow-sm">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                      
                      {/* Quick Action Buttons */}
                      <div className="p-4 border-t bg-white/50">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => handleQuickQuestion("Can you recommend some destinations in Africa for me?")}
                          >
                            Recommend destinations
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => handleQuickQuestion("What are some essential travel tips for Africa?")}
                          >
                            Travel tips for Africa
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => handleQuickQuestion("What are the visa requirements for traveling to Africa?")}
                          >
                            Visa requirements
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => handleQuickQuestion("When is the best time to visit Africa?")}
                          >
                            Best time to visit
                          </Button>
                        </div>
                        
                        {/* Message Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={assistantInput}
                            onChange={(e) => setAssistantInput(e.target.value)}
                            placeholder="Ask me anything about travel to Africa..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-twende-teal/50 focus:border-twende-teal"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button 
                            className="bg-twende-teal hover:bg-twende-teal/90 px-4"
                            onClick={() => handleSendMessage()}
                            disabled={!assistantInput.trim()}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          AI Assistant powered by advanced travel knowledge. Responses are AI-generated.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Destinations Tab */}
              <TabsContent value="destinations">
                <DashboardDestinations />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
