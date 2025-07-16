import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { serviceRequestService } from '@/services/service-requests';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface ServiceRequest {
  id: string;
  user_id: string;
  origin: string;
  destination: string;
  description: string;
  status: string;
  items: any[];
  budget: number;
  total_price: number;
  created_at: string;
}

export default function AdminServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await serviceRequestService.getAll();
      setRequests(data);
    } catch (err: any) {
      toast({ title: 'Error loading requests', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'declined') => {
    try {
      await serviceRequestService.updateStatus(id, status);
      toast({ title: 'Request updated', description: `Status set to ${status}` });
      fetchRequests();
    } catch (err: any) {
      toast({ title: 'Error updating', description: err.message, variant: 'destructive' });
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" asChild className="mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell>{req.id}</TableCell>
                    <TableCell>{req.user_id}</TableCell>
                    <TableCell>{req.origin}</TableCell>
                    <TableCell>{req.destination}</TableCell>
                    <TableCell className="max-w-xs truncate">{req.description}</TableCell>
                    <TableCell>
                      <Badge variant={req.status === 'approved' ? 'default' : req.status === 'declined' ? 'destructive' : 'secondary'}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(req.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(req.id, 'declined')}>Decline</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
