import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { chatService } from "@/services/chat";
import { messageService, ChatMessage as ChatMessageType } from "@/services/messages";
import { ChatMessage } from "./ChatMessage";
import { supabase } from '@/lib/supabaseClient';
import { ChatInput } from "./ChatInput";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "@/components/Loader";
import { Phone, User, Calendar, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ChatWindowProps {
  conversationId: string;
  initialMessage?: string;
}

interface ConversationData {
  id: string;
  admin_id: string | null;
  traveler_id: string;
  title: string;
  status: string | null;
}

export function ChatWindow({ conversationId, initialMessage }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [participantInfo, setParticipantInfo] = useState<{
    name: string;
    role: string;
    isOnline?: boolean;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoadingConversation(true);
      try {
        // Fetch conversation without nested joins
        const { data: conversationData, error: convError } = await supabase
          .from('conversations')
          .select('id, title, traveler_id, admin_id, status')
          .eq('id', conversationId)
          .single();
          
        if (convError) throw convError;
        
        // Safely cast the data with type assertion
        const typedConversation = conversationData as unknown as ConversationData;
        setConversation(typedConversation);
        
        // Set participant info based on user role
        if (user) {
          if (typedConversation.traveler_id === user.id) {
            setParticipantInfo({ name: 'Twende Travel', role: 'Admin' });
          } else {
            // Try to fetch traveler name/email from conversation object if available
            const travelerName = (typedConversation as any)?.traveler?.name;
            const travelerEmail = (typedConversation as any)?.traveler?.email;
            setParticipantInfo({
              name: travelerName
                ? `Traveler: ${travelerName} (${travelerEmail})`
                : travelerEmail
                  ? `Traveler: ${travelerEmail}`
                  : `Traveler: ${typedConversation.traveler_id}`,
              role: 'Traveler'
            });
          }
        }
        
        // Load messages
        const data = await chatService.getMessages(conversationId);
        setMessages(data);
      } catch (error) {
        console.error("Error loading conversation:", error);
      } finally {
        setIsLoadingConversation(false);
      }
    };

    if (conversationId) {
      loadMessages();
    }

    // Set up real-time subscription for messages
    const messageSubscription = messageService.subscribeToNewMessages(
      conversationId,
      async () => {
        // Re-fetch full message list (includes sender emails)
        const updated = await chatService.getMessages(conversationId);
        setMessages(updated);
      }
    );
    
    // Set up real-time subscription for conversation updates
    const conversationSubscription = chatService.subscribeToConversationUpdates(conversationId, 
      (updatedConversation) => {
        setConversation(prev => {
          if (!prev) return updatedConversation as unknown as ConversationData;
          return {...prev, ...updatedConversation};
        });
      }
    );

    // Simulate typing indicator for demo purposes (in a real app, this would be based on actual typing events)
    const typingChannel = supabase
      .channel(`typing-${conversationId}`)
      .on(
        'broadcast',
        { event: 'typing' },
        (payload) => {
          if (payload.payload.user_id !== user?.id) {
            setIsTyping(true);
            
            // Auto-clear typing indicator after 3 seconds
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            
            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false);
            }, 3000);
          }
        }
      )
      .subscribe();

    return () => {
      // Clean up subscriptions
      supabase.removeChannel(messageSubscription);
      supabase.removeChannel(conversationSubscription);
      supabase.removeChannel(typingChannel);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Send the message
      await messageService.send({ content, conversation_id: conversationId });
      // Refresh full message list to include new message
      const updated = await chatService.getMessages(conversationId);
      setMessages(updated);
      // Scroll to the bottom to show the new message
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTyping = () => {
    // Broadcast typing event
    supabase
      .channel(`typing-${conversationId}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: user?.id }
      });
  };

  if (isLoadingConversation) {
    return (
      <Card className="flex flex-col h-[600px] items-center justify-center">
        <Loader size="lg" />
        <p className="text-muted-foreground mt-4">Loading conversation...</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Chat header with participant info */}
      {conversation && (
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <User size={18} />
            </div>
            <div>
              <h3 className="font-medium">{participantInfo?.name}</h3>
              <div className="text-xs text-muted-foreground flex items-center">
                <Badge variant="outline" className="mr-2 text-xs">
                  {participantInfo?.role}
                </Badge>
                {participantInfo?.isOnline && (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Online
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* no related_trip info available */}
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-muted rounded-full p-4 mb-4">
              <User size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Start the conversation</h3>
            <p className="text-muted-foreground text-sm">
              Send a message to begin chatting about your travel plans.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-muted-foreground text-sm pl-4 animate-pulse">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            )}
          </>
        )}
        <div ref={scrollRef} />
      </ScrollArea>
      <ChatInput 
        onSend={handleSendMessage}
        onTyping={handleTyping} 
        isLoading={isLoading} 
        initialMessage={initialMessage}
      />
    </Card>
  );
}
