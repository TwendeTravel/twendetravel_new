import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { destinationService, Destination } from '@/services/destinations';
import { toast } from '@/hooks/use-toast';

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [form, setForm] = useState({
    name: '', country: '', description: '', image: '', rating: ''
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (e: any) {
      toast({ title: 'Error loading destinations', description: e.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', country: '', description: '', image: '', rating: '' });
  };

  const handleSubmit = async () => {
    const payload = { ...form, rating: parseFloat(form.rating) };
    try {
      if (editing) {
        await destinationService.update(editing.id, payload);
        toast({ title: 'Destination updated' });
      } else {
        await destinationService.create(payload);
        toast({ title: 'Destination created' });
      }
      resetForm(); fetchAll();
    } catch (e: any) {
      toast({ title: 'Error saving', description: e.message, variant: 'destructive' });
    }
  };

  const handleEdit = (dest: Destination) => {
    setEditing(dest);
    setForm({
      name: dest.name, country: dest.country,
      description: dest.description, image: dest.image,
      rating: dest.rating.toString()
    });
  };

  // Handle deletion of a destination
  async function handleDelete(id: string) {
    if (!confirm('Delete this destination?')) {
      return;
    }
    try {
      await destinationService.remove(id);
      toast({ title: 'Deleted' });
      fetchAll();
    } catch (e: any) {
      toast({ title: 'Error deleting', description: e.message, variant: 'destructive' });
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link to="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-4">Manage Destinations</h1>
      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <Input placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
        <Input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
        <Input placeholder="Rating" type="number" step="0.01" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
        <Button onClick={handleSubmit}>{editing ? 'Update' : 'Add'}</Button>
      </div>
      <Table>
        <TableHeader><TableRow>
          <TableHead>Name</TableHead><TableHead>Country</TableHead><TableHead>Rating</TableHead><TableHead>Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {destinations.map(dest => (
            <TableRow key={dest.id}>
              <TableCell>{dest.name}</TableCell>
              <TableCell>{dest.country}</TableCell>
              <TableCell>{dest.rating}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(dest)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(dest.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
