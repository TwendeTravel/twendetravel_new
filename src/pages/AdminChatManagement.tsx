import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { chatService } from '@/services/chat';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Search, User, Filter, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export default function AdminChatManagement() {
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useRole();
  const [conversations, setConversations] = useState<any[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [initialMessage, setInitialMessage] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [travellers, setTravellers] = useState<{ id: string; email: string }[]>([]);
  const [selectedTraveller, setSelectedTraveller] = useState<string | null>(null);

  // Load conversations and travellers
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data: convs, error: convErr } = await supabase
          .from('conversations')
          .select('id, title, traveler_id, admin_id, status, priority, created_at, updated_at, related_trip ( id, start_date, end_date, destination ( name, country ) )')
          .order('updated_at', { ascending: false });
        if (convErr) throw convErr;
        // fetch user emails
        const userIds = Array.from(new Set(convs.flatMap(c => [c.traveler_id, c.admin_id]).filter(Boolean)));
        const { data: users } = await supabase.from('user_emails_view').select('*').in('id', userIds as string[]);
        const enriched = convs.map(c => ({
          ...c,
          traveler: c.traveler_id && users?.find(u => u.id === c.traveler_id) ? { email: users.find(u => u.id === c.traveler_id)!.email } : null,
          admin: c.admin_id && users?.find(u => u.id === c.admin_id) ? { email: users.find(u => u.id === c.admin_id)!.email } : null
        }));
        setConversations(enriched);
        setFilteredConversations(enriched);
        if (enriched.length && !selectedConversation) setSelectedConversation(enriched[0].id);
      } catch (err) {
        console.error('Error loading conversations:', err);
        toast({ title: 'Error loading conversations', description: 'Please try again.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    loadConversations();
    // load travellers list
    if (user && isAdmin) {
      supabase
        .from('twende_permissions')
        .select('twende_user, user:twende_user(email)')
        .eq('permission', 0)
        .then(({ data, error }) => {
          if (!error && data) {
            setTravellers(data.map(rec => ({ id: rec.twende_user, email: rec.user.email })));
          }
        });
    }
    const channel = supabase.channel('public:conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => loadConversations())
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [user, isAdmin]);

  // Filters
  useEffect(() => {
    let filtered = [...conversations];
    if (searchTerm) filtered = filtered.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (statusFilter) filtered = filtered.filter(c => c.status === statusFilter);
    if (priorityFilter) filtered = filtered.filter(c => c.priority === priorityFilter);
    if (activeTab === 'active') filtered = filtered.filter(c => c.status === 'active');
    if (activeTab === 'archived') filtered = filtered.filter(c => c.status === 'archived');
    setFilteredConversations(filtered);
  }, [searchTerm, statusFilter, priorityFilter, activeTab, conversations]);

  // Start new chat
  const createNewChat = async () => {
    if (!selectedTraveller || !user) return;
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ traveler_id: selectedTraveller, admin_id: user.id, title: `Chat with ${selectedTraveller}`, status: 'active', priority: 'normal', category: 'general' })
        .select('id')
        .single();
      if (error) throw error;
      setSelectedConversation(data.id);
      toast({ title: 'Conversation created' });
    } catch (err) {
      console.error('Error creating chat:', err);
      toast({ title: 'Error', description: 'Could not start chat', variant: 'destructive' });
    }
  };

  // Admin Actions
  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('conversations').update({ status }).eq('id', id);
      if (error) throw error;
      toast({ title: 'Status updated', description: `Status set to ${status}` });
    } catch (err) {
      console.error('Error updating status:', err);
      toast({ title: 'Error', description: 'Could not update status', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Chat</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedTraveller ? travellers.find(t => t.id === selectedTraveller)?.email : 'Select Traveller'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {travellers.map(t => (
                <DropdownMenuItem key={t.id} onClick={() => setSelectedTraveller(t.id)}>{t.email}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={createNewChat}><Plus className="mr-1" />New Chat</Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 md:col-span-4 h-[600px] flex flex-col">
          <div className="p-4 border-b flex gap-2">
            <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="icon" variant="outline"><Filter /></Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPriorityFilter(null)}>All Priorities</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('high')}>High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('normal')}>Normal</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('low')}>Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ScrollArea className="flex-1 p-4">
            {isLoading ? <div>Loading...</div> : filteredConversations.map(conv => (
              <button key={conv.id} onClick={() => setSelectedConversation(conv.id)} className={cn('w-full p-2 text-left', selectedConversation===conv.id?'bg-muted':'')}>                
                <div className="font-medium truncate">{conv.title}</div>
                <div className="text-xs text-muted-foreground">{format(new Date(conv.updated_at), 'MMM d, h:mm a')}</div>
              </button>
            ))}
          </ScrollArea>
        </Card>
        <div className="col-span-12 md:col-span-8">
          {selectedConversation ? <ChatWindow conversationId={selectedConversation} initialMessage={initialMessage} /> : <Card className="p-4">Select a chat</Card>}
          {selectedConversation && <Card className="mt-4 p-4 flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => updateStatus(selectedConversation, conversations.find(c=>c.id===selectedConversation)?.status==='archived'?'active':'archived')}>{conversations.find(c=>c.id===selectedConversation)?.status==='archived'?'Reactivate':'Archive'}</Button>
            <Button variant="outline" size="sm"><Phone className="mr-1" />Call</Button>
          </Card>}
        </div>
      </div>
    </div>
  );
}
