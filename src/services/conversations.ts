
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type Conversation = Database['public']['Tables']['conversations']['Row'];
type ConversationInsert = Database['public']['Tables']['conversations']['Insert'];

export const conversationService = {
  async getMyConversations() {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) return [];

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        admin:admin_id(*),
        traveler:traveler_id(*),
        messages:messages(*)
      `)
      .or(`traveler_id.eq.${sessionData.session.user.id},admin_id.eq.${sessionData.session.user.id}`)
      .order('updated_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching conversations",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  },
  /**
   * Find or create the shared traveler–Twende Travel conversation for a user.
   */
  async getOrCreateSupportConversation(travelerId: string) {
    // Try find existing support thread (admin_id null)
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('traveler_id', travelerId)
      .is('admin_id', null)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      return data as Conversation;
    }
    // Create new support conversation
    const { data: newConv, error: insertError } = await supabase
      .from('conversations')
      .insert({ traveler_id: travelerId, admin_id: null, title: 'Travel Support', status: 'active' })
      .select()
      .single();
    if (insertError) throw insertError;
    return newConv as Conversation;
  }
  
  subscribeToMyConversations(callback: (conversations: Conversation[]) => void) {
    return supabase
      .channel('my-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          // When any conversation changes, fetch all conversations again
          this.getMyConversations().then(data => {
            if (data) callback(data);
          });
        }
      )
      .subscribe();
  },

  async create(conversationData: Omit<ConversationInsert, 'traveler_id' | 'created_at' | 'updated_at'>) {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to start a conversation",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        ...conversationData,
        traveler_id: userId
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating conversation",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  }
};
