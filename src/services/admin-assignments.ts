
import { toast } from "@/components/ui/use-toast";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

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
      const q = query(
        collection(db, 'admin_assignments'),
        where('admin_id', '==', adminId),
        where('is_active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const assignments: AdminAssignment[] = [];
      
      querySnapshot.forEach((doc) => {
        assignments.push({ id: doc.id, ...doc.data() } as AdminAssignment);
      });

      return assignments;
    } catch (error) {
      console.error("Error in getAssignmentsForAdmin:", error);
      toast({
        title: "Error fetching assignments",
        description: "Failed to fetch admin assignments",
        variant: "destructive",
      });
      return [];
    }
  },

  async getAllAdminAssignments() {
    try {
      const q = query(
        collection(db, 'admin_assignments'),
        orderBy('assigned_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const assignments: AdminAssignment[] = [];
      
      querySnapshot.forEach((doc) => {
        assignments.push({ id: doc.id, ...doc.data() } as AdminAssignment);
      });

      return assignments;
    } catch (error) {
      console.error("Error in getAllAdminAssignments:", error);
      toast({
        title: "Error fetching assignments",
        description: "Failed to fetch admin assignments",
        variant: "destructive",
      });
      return [];
    }
  },

  // Adding this method to process assignments for the TravelerAssignments component
  async getAllAssignments() {
    try {
      // First get all admin assignments
      const q = query(
        collection(db, 'admin_assignments'),
        orderBy('assigned_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const assignments: TravelerAssignment[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        assignments.push({
          id: doc.id,
          ...data,
          trip_count: Math.floor(Math.random() * 10) // Mock data for now
        } as TravelerAssignment);
      });

      return assignments;
    } catch (error) {
      console.error("Error in getAllAssignments:", error);
      toast({
        title: "Error fetching assignments",
        description: "Failed to fetch assignments",
        variant: "destructive",
      });
      return [];
    }
  },

  // Adding toggle method for assignment status
  async toggleAssignmentStatus(assignmentId: string, currentStatus: boolean) {
    try {
      const assignmentRef = doc(db, 'admin_assignments', assignmentId);
      await updateDoc(assignmentRef, {
        is_active: !currentStatus,
        updated_at: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error("Error in toggleAssignmentStatus:", error);
      toast({
        title: "Error updating assignment status",
        description: "Failed to update assignment status",
        variant: "destructive",
      });
      return false;
    }
  },

  async assignTravelerToAdmin(travelerId: string, adminId: string) {
    try {
      // First check if there's an existing active assignment
      const q = query(
        collection(db, 'admin_assignments'),
        where('traveler_id', '==', travelerId),
        where('is_active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const existingAssignments: AdminAssignment[] = [];
      
      querySnapshot.forEach((doc) => {
        existingAssignments.push({ id: doc.id, ...doc.data() } as AdminAssignment);
      });

      // If traveler is already assigned to the same admin, return that assignment
      const existingAdminAssignment = existingAssignments.find(
        assignment => assignment.admin_id === adminId
      );
      
      if (existingAdminAssignment) {
        return existingAdminAssignment;
      }

      // Deactivate any existing assignments for this traveler
      if (existingAssignments.length > 0) {
        for (const assignment of existingAssignments) {
          const assignmentRef = doc(db, 'admin_assignments', assignment.id);
          await updateDoc(assignmentRef, {
            is_active: false,
            updated_at: new Date().toISOString()
          });
        }
      }

      // Create new assignment
      const newAssignment = {
        admin_id: adminId,
        traveler_id: travelerId,
        is_active: true,
        assigned_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'admin_assignments'), newAssignment);
      
      toast({
        title: "Assignment successful",
        description: `Traveler has been assigned to admin`,
      });
      
      return { id: docRef.id, ...newAssignment } as AdminAssignment;
    } catch (error) {
      console.error("Error in assignTravelerToAdmin:", error);
      toast({
        title: "Error assigning traveler to admin",
        description: "Failed to assign traveler to admin",
        variant: "destructive",
      });
      return null;
    }
  },

  async removeTravelerFromAdmin(travelerId: string) {
    try {
      const q = query(
        collection(db, 'admin_assignments'),
        where('traveler_id', '==', travelerId),
        where('is_active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      const updatePromises: Promise<void>[] = [];
      querySnapshot.forEach((doc) => {
        updatePromises.push(updateDoc(doc.ref, {
          is_active: false,
          updated_at: new Date().toISOString()
        }));
      });

      await Promise.all(updatePromises);

      toast({
        title: "Assignment removed",
        description: `Traveler has been unassigned`,
      });
      return true;
    } catch (error) {
      console.error("Error in removeTravelerFromAdmin:", error);
      toast({
        title: "Error removing assignment",
        description: "Failed to remove assignment",
        variant: "destructive",
      });
      return false;
    }
  },

  async getAssignmentForTraveler(travelerId: string) {
    try {
      const q = query(
        collection(db, 'admin_assignments'),
        where('traveler_id', '==', travelerId),
        where('is_active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as AdminAssignment;
    } catch (error) {
      console.error("Error in getAssignmentForTraveler:", error);
      return null;
    }
  }
};
