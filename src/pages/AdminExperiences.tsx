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
import { format } from 'date-fns';

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', image: '' });

  const loadExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error loading experiences', description: error.message, variant: 'destructive' });
    } else {
      setExperiences(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadExperiences(); }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', description: '', category: '', image: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await supabase.from('experiences').update(form).eq('id', editing.id);
        toast({ title: 'Experience updated' });
      } else {
        await supabase.from('experiences').insert(form);
        toast({ title: 'Experience created' });
      }
      resetForm();
      loadExperiences();
    } catch (e: any) {
      toast({ title: 'Error saving experience', description: e.message, variant: 'destructive' });
    }
  };

  const handleEdit = (exp: any) => {
    setEditing(exp);
    setForm({ title: exp.title, description: exp.description, category: exp.category, image: exp.image });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      await supabase.from('experiences').delete().eq('id', id);
      toast({ title: 'Experience deleted' });
      loadExperiences();
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
        <h1 className="text-3xl font-bold mb-4">{editing ? 'Edit Experience' : 'Manage Experiences'}</h1>
        <div className="mb-6 flex flex-col gap-4">
          <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <Input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} />
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>{editing ? 'Update' : 'Add'}</Button>
            {editing && <Button variant="secondary" onClick={resetForm}>Cancel</Button>}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map(exp => (
              <TableRow key={exp.id}>
                <TableCell>{exp.title}</TableCell>
                <TableCell>{exp.category}</TableCell>
                <TableCell>{format(new Date(exp.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(exp)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(exp.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageTransition>
  );
}
