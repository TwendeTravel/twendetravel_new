
import { toast } from "@/components/ui/use-toast";
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export type UserStats = {
  id: string;
  user_id: string;
  total_trips: number;
  countries_visited: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
};

export const userStatsService = {
  async getCurrentUserStats() {
    if (!auth.currentUser) return null;

    try {
      const q = query(
        collection(db, 'user_stats'),
        where('user_id', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserStats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }
};
