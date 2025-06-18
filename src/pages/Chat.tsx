import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { chatService } from "@/services/chat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Search, User, Filter, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface Conversation {
  id: string;
  admin_id: string;
  traveler_id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  priority?: string;
  traveler?: {
    email: string;
  } | null;
  admin?: {
    email: string;
  } | null;
  related_trip?: {
    id: string;
    start_date: string;
    end_date: string;
    destination?: {
      name: string;
      country: string;
    } | null;
  } | null;
}

export default function Chat() {
  const { isAdmin, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();
  useEffect(() => {
    if (!roleLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, roleLoading, navigate]);
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [initialMessage, setInitialMessage] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const [travellers, setTravellers] = useState<{ id: string; email: string }[]>([]);
  const [selectedTraveller, setSelectedTraveller] = useState<string | null>(null);
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        // Load all conversations for debugging
      const { data, error } = await supabase
        .from('conversations')
        .select('id, title, status, created_at, updated_at, traveler:traveler_id(email), admin:admin_id(email)')
        .order('updated_at', { ascending: false });
        if (error) throw error;
        const enhancedData = data as Conversation[];
      setConversations(enhancedData);
        setFilteredConversations(enhancedData);
        if (enhancedData.length > 0 && !selectedConversation) {
          setSelectedConversation(enhancedData[0].id);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
        toast({
          title: "Error loading conversations",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
    // Load travellers list for admin chat
    if (user && isAdmin) {
      supabase
        .from('twende_permissions')
        .select('twende_user, user:twende_user(email)')
        .eq('permission', 0)
        .then(({ data, error }) => {
          if (!error && data) {
            const list = data.map(rec => ({ id: rec.twende_user, email: rec.user.email }));
            setTravellers(list);
          }
        });
    }

    const channel = supabase
      .channel('public:conversations')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'conversations'
      }, () => {
        loadConversations();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, isAdmin, roleLoading, selectedConversation]);

  useEffect(() => {
    let filtered = [...conversations];
    
    if (searchTerm) {
      filtered = filtered.filter(conv => 
        (conv.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (conv.traveler?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (conv.admin?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (conv.related_trip?.destination?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(conv => conv.status === statusFilter);
    }
    
    if (priorityFilter) {
      filtered = filtered.filter(conv => conv.priority === priorityFilter);
    }
    
    if (activeTab === "active") {
      filtered = filtered.filter(conv => conv.status === "active");
    } else if (activeTab === "archived") {
      filtered = filtered.filter(conv => conv.status === "archived");
    }
    
    setFilteredConversations(filtered);
  }, [searchTerm, statusFilter, priorityFilter, activeTab, conversations]);
  
  // Extract initial message from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('message') || undefined;
    setInitialMessage(msg);
  }, []);

  // Create new conversation (for traveler)
  const createNewConversation = async () => {
    if (!user) return;
    try {
      // reuse existing traveler–Twende Travel thread if present
      const { data: existing, error: findErr } = await supabase
        .from('conversations')
        .select('id')
        .eq('traveler_id', user.id)
        .eq('admin_id', null)
        .maybeSingle();
      if (findErr) throw findErr;
      let convId = existing?.id;
      if (!convId) {
        const { data: newConv, error: createErr } = await supabase
          .from('conversations')
          .insert([{ traveler_id: user.id, admin_id: null, title: 'Travel Assistance Request', status: 'active', priority: 'normal', category: 'general' }])
          .select('id')
          .single();
        if (createErr) throw createErr;
        convId = newConv.id;
        toast({ title: 'Conversation created', description: 'You can now start chatting' });
      }
      setSelectedConversation(convId);
    } catch (err) {
      console.error('Error creating conversation:', err);
      toast({ title: 'Error creating conversation', description: 'Please try again later', variant: 'destructive' });
    }
  };

  // Admin: start chat with any user
  const createAdminChat = async () => {
    if (!user) return;
    const travelerId = prompt('Enter traveler user ID to chat with:');
    if (!travelerId) return;
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          traveler_id: travelerId,
          admin_id: user.id,
          title: `Chat with ${travelerId}`,
          status: 'active',
          priority: 'normal',
          category: 'general'
        })
        .select()
        .single();
      if (error) throw error;
      setSelectedConversation(data.id);
      toast({ title: 'Conversation created', description: 'You can now start chatting' });
    } catch (err) {
      console.error('Error creating admin chat:', err);
      toast({ title: 'Error', description: 'Could not start chat', variant: 'destructive' });
    }
  };

  const updateConversationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Conversation updated",
        description: `Status changed to ${status}`
      });
    } catch (err) {
      console.error("Error updating conversation:", err);
      toast({
        title: "Error updating conversation",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Conversations</h1>
        {!isAdmin ? (
          <Button onClick={createNewConversation}>
            <Plus size={16} className="mr-2" />
            New Conversation
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {selectedTraveller
                    ? travellers.find(t => t.id === selectedTraveller)?.email
                    : 'Select Traveler'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {travellers.map(traveller => (
                  <DropdownMenuItem key={traveller.id} onClick={() => setSelectedTraveller(traveller.id)}>
                    {traveller.email}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={async () => {
              if (!selectedTraveller) return;
              try {
                const { data, error } = await supabase
                  .from('conversations')
                  .insert({
                    traveler_id: selectedTraveller,
                    admin_id: user.id,
                    title: `Chat with ${travellers.find(t => t.id === selectedTraveller)?.email || selectedTraveller}`,
                    status: 'active',
                    priority: 'normal',
                    category: 'general'
                  })
                  .select()
                  .single();
                if (error) throw error;
                setSelectedConversation(data.id);
                toast({ title: 'Conversation created', description: 'You can now start chatting' });
              } catch (err) {
                console.error('Error creating admin chat:', err);
                toast({ title: 'Error', description: 'Could not start chat', variant: 'destructive' });
              }
            }} disabled={!selectedTraveller}>
              <Plus size={16} className="mr-2" />
              New Chat
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 md:col-span-4 h-[700px] flex flex-col">
          <div className="p-4 border-b">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                    All Priorities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("high")}>
                    High Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("normal")}>
                    Normal Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("low")}>
                    Low Priority
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
                <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={cn(
                    "w-full p-4 text-left rounded-lg mb-2 hover:bg-muted transition-colors",
                    selectedConversation === conversation.id && "bg-muted"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium truncate max-w-[70%]">{conversation.title}</h3>
                    <Badge variant={conversation.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                      {conversation.priority || "normal"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <User size={12} className="mr-1" />
                    {isAdmin
                      ? `Traveler: ${conversation.traveler?.email || conversation.traveler_id}`
                      : `Admin ID: ${conversation.admin_id || 'Unassigned'}`}
                  </div>
                  
                  {conversation.related_trip && (
                    <div className="text-xs text-muted-foreground mb-2">
                      Trip: {conversation.related_trip.destination?.name}, {conversation.related_trip.destination?.country}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {conversation.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(conversation.updated_at || ""), "MMM d, h:mm a")}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="bg-muted inline-block p-3 rounded-full mb-3">
                  <User className="h-6 w-6" />
                </div>
                <p>No conversations found</p>
                <Button variant="link" onClick={createNewConversation} className="mt-2">
                  Start a new conversation
                </Button>
              </div>
            )}
          </ScrollArea>
        </Card>
        
        <div className="col-span-12 md:col-span-8">
            {selectedConversation ? (
            <div className="flex flex-col h-[700px]">
              <ChatWindow conversationId={selectedConversation} initialMessage={initialMessage} />
              
              {isAdmin && (
                <Card className="mt-4 p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Admin Actions</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const conversation = conversations.find(c => c.id === selectedConversation);
                          if (conversation) {
                            updateConversationStatus(
                              selectedConversation, 
                              conversation.status === "archived" ? "active" : "archived"
                            );
                          }
                        }}
                      >
                        {conversations.find(c => c.id === selectedConversation)?.status === "archived" 
                          ? "Reactivate" 
                          : "Archive"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone size={16} className="mr-2" />
                        Initiate Call
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-4 text-center h-[700px] flex flex-col items-center justify-center">
              <div className="bg-muted inline-block p-4 rounded-full mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">Select a conversation to start chatting</h3>
              <p className="text-muted-foreground mb-4">
                Or create a new conversation to get travel assistance
              </p>
              <Button onClick={createNewConversation}>
                <Plus size={16} className="mr-2" />
                New Conversation
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
