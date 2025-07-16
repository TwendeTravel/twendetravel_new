import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import PageTransition from '@/components/PageTransition';
import { format } from 'date-fns';

export default function AdminTrips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ origin: '', destination: '', start_date: '', end_date: '', status: 'scheduled' });

  const loadTrips = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error loading trips', description: error.message, variant: 'destructive' });
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadTrips(); }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({ origin: '', destination: '', start_date: '', end_date: '', status: 'scheduled' });
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await supabase.from('trips').update(form).eq('id', editing.id);
        toast({ title: 'Trip updated' });
      } else {
        await supabase.from('trips').insert({ ...form });
        toast({ title: 'Trip created' });
      }
      resetForm(); loadTrips();
    } catch (e: any) {
      toast({ title: 'Error saving trip', description: e.message, variant: 'destructive' });
    }
  };

  const handleEdit = (trip: any) => {
    setEditing(trip);
    setForm({
      origin: trip.origin,
      destination: trip.destination,
      start_date: trip.start_date,
      end_date: trip.end_date,
      status: trip.status
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trip?')) return;
    try {
      await supabase.from('trips').delete().eq('id', id);
      toast({ title: 'Trip deleted' }); loadTrips();
    } catch (e: any) {
      toast({ title: 'Error deleting', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" asChild className="mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-4">Manage Trips</h1>
        {/* Form */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Input placeholder="Origin" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} />
          <Input placeholder="Destination" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
          <Input type="date" placeholder="Start Date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
          <Input type="date" placeholder="End Date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
          <Select value={form.status} onChange={val => setForm({ ...form, status: val })}>
            <Select.Trigger className="w-[120px]">
              <Select.Value placeholder="Status" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="scheduled">Scheduled</Select.Item>
              <Select.Item value="completed">Completed</Select.Item>
              <Select.Item value="cancelled">Cancelled</Select.Item>
            </Select.Content>
          </Select>
          <Button onClick={handleSubmit}>{editing ? 'Update' : 'Add'}</Button>
          {editing && <Button variant="secondary" onClick={resetForm}>Cancel</Button>}
        </div>
        {/* Table */}
        <Table>
          <TableHeader><TableRow>
            <TableHead>Origin</TableHead><TableHead>Destination</TableHead><TableHead>Dates</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {trips.map(trip => (
              <TableRow key={trip.id}>
                <TableCell>{trip.origin}</TableCell>
                <TableCell>{trip.destination}</TableCell>
                <TableCell>{format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}</TableCell>
                <TableCell>{trip.status}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(trip)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(trip.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageTransition>
  );
}
