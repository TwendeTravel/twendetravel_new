import { useState, useRef, useEffect } from "react";
import { useRole } from "@/hooks/useRole";
import { useNavigate } from "react-router-dom";
import { Send, User, Bot, ArrowLeft, ThumbsUp, ThumbsDown, Copy, Paperclip, Image, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { askGemini } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';

const SAMPLE_SUGGESTIONS = [
  "What are the best beaches in Ghana?",
  "Tell me about Kenyan cuisine",
  "What should I pack for a safari trip?",
  "How much money should I budget for a week in Accra?",
  "What's the best time to visit Nairobi?",
  "What are must-visit attractions in Cape Coast?"
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content: "Hello! I'm your Twende Travel Assistant. I can help you plan your trip to Ghana or Kenya, suggest activities, provide local insights, or answer any travel-related questions you might have. How can I assist you today?"
  }
];

const TravelAssistant = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();
  useEffect(() => {
    if (!roleLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, roleLoading, navigate]);
  if (!roleLoading && isAdmin) return null;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) as Message[] : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    try {
      const response = await askGemini(input);
      setMessages([...newMessages, { role: 'assistant' as const, content: response }]);
    } catch (error: any) {
      const msg = error.message.includes('Offline')
        ? 'You are offline and no cached response is available.'
        : 'Sorry, something went wrong. Please try again later.';
      setMessages([...newMessages, { role: 'assistant' as const, content: msg }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };
  
  // Persist messages and scroll into view on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-4 px-6">
        <div className="container mx-auto flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-4">
            <Link to="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Travel Assistant</h1>
            <p className="text-sm text-muted-foreground">Get personalized travel advice and recommendations</p>
          </div>
        </div>
      </header>
      
      <div className="flex-1 container mx-auto flex flex-col md:flex-row gap-6 p-6">
        <div className="flex-1 bg-card rounded-lg shadow-md border border-border flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground"
                  }`}>
                    <div className="flex items-start">
                      {message.role === "assistant" && (
                        <div className="mr-2 mt-1">
                          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <Bot className="h-3.5 w-3.5 text-primary" />
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="prose prose-sm dark:prose-invert">
                          <ReactMarkdown>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                      {message.role === "user" && (
                        <div className="ml-2 mt-1">
                          <div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {message.role === "assistant" && (
                      <div className="flex items-center justify-end mt-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted text-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={endOfMessagesRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Textarea
                  className="min-h-[80px] resize-none pr-10 bg-background text-foreground"
                  placeholder="Ask me anything about traveling to Ghana or Kenya..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="absolute right-3 bottom-3 flex space-x-1">
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                    <Image className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button type="submit" className="rounded-full h-10 w-10 p-2 flex items-center justify-center">
                    <Send className="h-5 w-5" />
                  </Button>
                </div> {/* close toolbar div */}
              </div> {/* close input wrapper */}
            </form>
          </div>
        </div>
        
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-card rounded-lg shadow-md border border-border p-4">
            <h2 className="font-medium mb-3 text-foreground">Suggested Questions</h2>
            <div className="space-y-2">
              {SAMPLE_SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  className="block w-full text-left p-2 hover:bg-muted rounded-md text-sm transition-colors text-muted-foreground hover:text-foreground"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          <div className="glass-card bg-gradient-to-br from-primary/90 to-primary rounded-lg shadow-md p-4">
            <h2 className="font-medium mb-2 text-primary-foreground">Need a personalized trip plan?</h2>
            <p className="text-sm mb-4 text-primary-foreground/90">
              Let our travel experts create a custom itinerary just for you.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => navigate(`/chat?message=${encodeURIComponent('I would like a personalized trip plan')}`)}
            >
              Plan My Trip
            </Button>
          </div>
          
          <div className="bg-card rounded-lg shadow-md border border-border p-4">
            <h2 className="font-medium mb-3 text-foreground">Popular Destinations</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative rounded-md overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1580323956505-169e32a678fe?auto=format&fit=crop&w=600&q=80" 
                  alt="Accra" 
                  className="w-full h-20 object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex items-end p-2">
                  <span className="text-white text-xs font-medium">Accra, Ghana</span>
                </div>
              </div>
              <div className="relative rounded-md overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1611348524140-53c9a25467bf?auto=format&fit=crop&w=600&q=80" 
                  alt="Nairobi" 
                  className="w-full h-20 object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex items-end p-2">
                  <span className="text-white text-xs font-medium">Nairobi, Kenya</span>
                </div>
              </div>
              <div className="relative rounded-md overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=600&q=80" 
                  alt="Maasai Mara" 
                  className="w-full h-20 object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex items-end p-2">
                  <span className="text-white text-xs font-medium">Maasai Mara</span>
                </div>
              </div>
              <div className="relative rounded-md overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1599056377758-4808a7e79fc6?auto=format&fit=crop&w=600&q=80" 
                  alt="Cape Coast" 
                  className="w-full h-20 object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex items-end p-2">
                  <span className="text-white text-xs font-medium">Cape Coast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelAssistant;
