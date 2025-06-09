
import { toast } from "@/components/ui/use-toast";

export type AdminAssignment = {
  id: string;
  admin_id: string;
  traveler_id: string;
  assigned_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Adding this type for the TravelerAssignments component
export type TravelerAssignment = AdminAssignment & {
  traveler?: {
    email?: string;
    id?: string;
  };
  admin?: {
    email?: string;
    id?: string;
  };
  trip_count?: number;
};

export const adminAssignmentService = {
  async getAssignmentsForAdmin(adminId: string) {
    try {
      const { data, error } = await supabase
        .from('admin_assignments')
        .select('*')
        .eq('admin_id', adminId)
        .eq('is_active', true);

      if (error) {
        toast({
          title: "Error fetching assignments",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data as AdminAssignment[];
    } catch (error) {
      console.error("Error in getAssignmentsForAdmin:", error);
      return [];
    }
  },

  async getAllAdminAssignments() {
    try {
      const { data, error } = await supabase
        .from('admin_assignments')
        .select('*')
        .order('assigned_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching assignments",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data as AdminAssignment[];
    } catch (error) {
      console.error("Error in getAllAdminAssignments:", error);
      return [];
    }
  },

  // Adding this method to process assignments for the TravelerAssignments component
  async getAllAssignments() {
    try {
      // First get all admin assignments
      const { data, error } = await supabase
        .from('admin_assignments')
        .select(`
          *,
          traveler:traveler_id(email, id),
          admin:admin_id(email, id)
        `)
        .order('assigned_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching assignments",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      // Mock trip count for now (would typically come from another query)
      const processedAssignments = data.map(assignment => ({
        ...assignment,
        trip_count: Math.floor(Math.random() * 10) // Just for demonstration
      }));

      return processedAssignments as TravelerAssignment[];
    } catch (error) {
      console.error("Error in getAllAssignments:", error);
      return [];
    }
  },

  // Adding toggle method for assignment status
  async toggleAssignmentStatus(assignmentId: string, currentStatus: boolean) {
    try {
      const { data, error } = await supabase
        .from('admin_assignments')
        .update({ is_active: !currentStatus })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error updating assignment status",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in toggleAssignmentStatus:", error);
      return false;
    }
  },

  async assignTravelerToAdmin(travelerId: string, adminId: string) {
    try {
      // First check if there's an existing active assignment
      const { data: existingAssignments, error: fetchError } = await supabase
        .from('admin_assignments')
        .select('*')
        .eq('traveler_id', travelerId)
        .eq('is_active', true);

      if (fetchError) {
        toast({
          title: "Error checking existing assignments",
          description: fetchError.message,
          variant: "destructive",
        });
        return null;
      }

      // If traveler is already assigned to the same admin, return that assignment
      const existingAdminAssignment = existingAssignments?.find(
        assignment => assignment.admin_id === adminId
      );
      
      if (existingAdminAssignment) {
        return existingAdminAssignment as AdminAssignment;
      }

      // Deactivate any existing assignments for this traveler
      if (existingAssignments && existingAssignments.length > 0) {
        const { error: updateError } = await supabase
          .from('admin_assignments')
          .update({ is_active: false })
          .eq('traveler_id', travelerId)
          .eq('is_active', true);

        if (updateError) {
          toast({
            title: "Error deactivating existing assignments",
            description: updateError.message,
            variant: "destructive",
          });
          return null;
        }
      }

      // Create new assignment
      const { data, error } = await supabase
        .from('admin_assignments')
        .insert([
          { admin_id: adminId, traveler_id: travelerId, is_active: true }
        ])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error assigning traveler to admin",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      if (data) {
        toast({
          title: "Assignment successful",
          description: `Traveler has been assigned to admin`,
        });
        return data as AdminAssignment;
      }
      
      return null;
    } catch (error) {
      console.error("Error in assignTravelerToAdmin:", error);
      return null;
    }
  },

  async removeTravelerFromAdmin(travelerId: string) {
    try {
      const { data, error } = await supabase
        .from('admin_assignments')
        .update({ is_active: false })
        .eq('traveler_id', travelerId)
        .eq('is_active', true)
        .select();

      if (error) {
        toast({
          title: "Error removing assignment",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Assignment removed",
        description: `Traveler has been unassigned`,
      });
      return true;
    } catch (error) {
      console.error("Error in removeTravelerFromAdmin:", error);
      return false;
    }
  }
};
