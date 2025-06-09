
import { useState, useEffect } from 'react';
import { roleService } from '@/services/roles';
import { adminAssignmentService } from '@/services/admin-assignments';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Loader } from '@/components/Loader';
import { Shield, Users, UserCheck, Calendar, PieChart } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    travellerUsers: 0,
    totalTrips: 0
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const roles = await roleService.getAllUserRoles();
        setUsers(roles);
        
        // Calculate stats
        if (roles) {
          const adminCount = roles.filter(role => role.role === 'admin').length;
          const travellerCount = roles.filter(role => role.role === 'traveller').length;
          
          setStats({
            totalUsers: roles.length,
            adminUsers: adminCount,
            travellerUsers: travellerCount,
            totalTrips: Math.floor(Math.random() * 100) // Mock data for demo
          });
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Failed to fetch users",
          description: "There was an error loading the user data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId: string, newRole: 'admin' | 'traveller') => {
    try {
      await roleService.updateUserRole(userId, newRole);
      
      // Update local state
      setUsers(users.map(user => 
        user.user_id === userId ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Failed to update role",
        description: "There was an error updating the user role.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Admin Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{stats.adminUsers}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Traveller Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserCheck className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{stats.travellerUsers}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{stats.totalTrips}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* User Management Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage user roles across the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">{user.user_id}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.role === 'admin' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRoleUpdate(user.user_id, 'traveller')}
                        >
                          Make Traveller
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRoleUpdate(user.user_id, 'admin')}
                        >
                          Make Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* System Health Overview - placeholder for future features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              System Overview
            </CardTitle>
            <CardDescription>
              Monitor system health and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              System analytics dashboard coming soon
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
