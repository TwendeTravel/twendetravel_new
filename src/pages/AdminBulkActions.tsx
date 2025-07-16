import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import PageTransition from '@/components/PageTransition';

export default function AdminBulkActions() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', description: '', rate: '' });

  const loadServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: false });
    if (error) {
      toast({ title: 'Error loading services', description: error.message, variant: 'destructive' });
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadServices(); }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', description: '', rate: '' });
  };

  const handleSubmit = async () => {
    try {
      const payload = { name: form.name, description: form.description, rate: form.rate ? Number(form.rate) : null };
      if (editing) {
        await supabase.from('services').update(payload).eq('id', editing.id);
        toast({ title: 'Service updated' });
      } else {
        await supabase.from('services').insert(payload);
        toast({ title: 'Service created' });
      }
      resetForm();
      loadServices();
    } catch (e: any) {
      toast({ title: 'Error saving service', description: e.message, variant: 'destructive' });
    }
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description || '', rate: item.rate?.toString() || '' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    try {
      await supabase.from('services').delete().eq('id', id);
      toast({ title: 'Service deleted' });
      loadServices();
    } catch (e: any) {
      toast({ title: 'Error deleting', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" asChild className="mb-6">
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-4">{editing ? 'Edit Service' : 'Manage Services'}</h1>
        <div className="mb-6 flex flex-col gap-4">
          <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          <Input type="number" placeholder="Rate" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} />
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>{editing ? 'Update' : 'Add'}</Button>
            {editing && <Button variant="secondary" onClick={resetForm}>Cancel</Button>}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map(svc => (
              <TableRow key={svc.id}>
                <TableCell>{svc.name}</TableCell>
                <TableCell>{svc.rate}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(svc)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(svc.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageTransition>
  );
}
