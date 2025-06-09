
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, UserCheck, UserX, RefreshCw } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { adminAssignmentService, TravelerAssignment } from "@/services/admin-assignments";

export function TravelerAssignments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<TravelerAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    if (!user) return;
    
    try {
      setLoading(true);
      const processedAssignments = await adminAssignmentService.getAllAssignments();
      setAssignments(processedAssignments);
    } catch (err) {
      console.error("Error loading assignments:", err);
      toast({
        title: "Error loading assignments",
        description: "There was a problem loading the traveler assignments.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function refreshAssignments() {
    setRefreshing(true);
    await loadAssignments();
    setRefreshing(false);
  }

  async function toggleAssignmentStatus(assignment: TravelerAssignment) {
    try {
      await adminAssignmentService.toggleAssignmentStatus(assignment.id, assignment.is_active || false);
      
      setAssignments(assignments.map(a => 
        a.id === assignment.id 
          ? { ...a, is_active: !a.is_active }
          : a
      ));
      
      toast({
        title: "Status updated",
        description: `Assignment ${!assignment.is_active ? "activated" : "deactivated"} successfully.`
      });
    } catch (err) {
      console.error("Error updating assignment:", err);
      toast({
        title: "Update failed",
        description: "There was a problem updating the assignment status.",
        variant: "destructive"
      });
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Traveler Assignments</CardTitle>
          <CardDescription>Manage admin assignments to travelers</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshAssignments} 
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="w-20 h-8" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No assignments found.
              </div>
            ) : (
              assignments.map(assignment => (
                <div 
                  key={assignment.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md"
                >
                  <div className="flex items-start md:items-center space-x-4 mb-4 md:mb-0">
                    <Avatar>
                      <AvatarFallback>
                        {assignment.traveler?.email?.charAt(0).toUpperCase() || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{assignment.traveler?.email || 'Unknown Traveler'}</div>
                      <div className="text-sm text-muted-foreground">
                        <span className="flex items-center space-x-2">
                          <User className="h-3 w-3" />
                          <span>{assignment.trip_count} trips</span>
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Assigned to: {assignment.admin?.email || 'Unknown Admin'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={assignment.is_active ? "outline" : "secondary"}>
                      {assignment.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button 
                      size="sm"
                      variant={assignment.is_active ? "destructive" : "default"} 
                      onClick={() => toggleAssignmentStatus(assignment)}
                    >
                      {assignment.is_active ? (
                        <><UserX className="h-4 w-4 mr-1" /> Deactivate</>
                      ) : (
                        <><UserCheck className="h-4 w-4 mr-1" /> Activate</>
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
