import { toast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";

/** A saved destination record */
export interface SavedDestination {
  id: string;
  destination_id: string;
  user_id: string;
  created_at: string;
}
/** Data to save a new destination */
export type SavedDestinationInsert = Omit<SavedDestination, 'id' | 'created_at'>;

export const savedDestinationService = {
  async getAll(): Promise<SavedDestination[]> {
    try {
      return await apiFetch<SavedDestination[]>('saved-destinations');
    } catch (error: any) {
      toast({
        title: "Error fetching saved destinations",
        description: error.message || 'Unable to load saved destinations',
        variant: "destructive",
      });
      throw error;
    }
  },

  /** Toggle saving a destination: adds if not saved, removes if already saved */
  async toggleSave(destinationId: string): Promise<SavedDestination | null> {
    try {
      // Backend should handle toggling or provide separate endpoints
      return await apiFetch<SavedDestination | null>(
        `saved-destinations/toggle/${destinationId}`,
        { method: 'POST' }
      );
    } catch (error: any) {
      toast({
        title: error instanceof Error ? error.message : 'Error toggling save',
        description: 'Unable to update saved destinations',
        variant: 'destructive',
      });
      throw error;
    }
  }
};
