import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { serviceRequestService, Service, ServiceRequestItem } from '@/services/service-requests';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface ServiceWithState extends Service {
  selected: boolean;
  qty: number;
}

export function ServiceRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [services, setServices] = useState<ServiceWithState[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    serviceRequestService.getServices()
      .then(data => setServices(data.map(s => ({ ...s, selected: false, qty: 1 }))))
      .catch(err => toast({ variant: 'destructive', title: 'Error', description: err.message }));
  }, [toast]);

  const toggleSelection = (idx: number) => {
    setServices(prev => {
      const next = [...prev];
      next[idx].selected = !next[idx].selected;
      return next;
    });
  };

  const updateQty = (idx: number, qty: number) => {
    setServices(prev => {
      const next = [...prev];
      next[idx].qty = qty;
      return next;
    });
  };

  const items: ServiceRequestItem[] = services
    .filter(s => s.selected)
    .map(s => ({ service_id: s.id, qty: s.qty }));

  const totalPrice = services
    .filter(s => s.selected)
    .reduce((sum, s) => sum + s.rate * s.qty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: 'destructive', title: 'Not logged in', description: 'Please log in.' });
      return;
    }
    if (items.length === 0) {
      toast({ variant: 'destructive', title: 'No services', description: 'Select at least one service.' });
      return;
    }
    if (budget < totalPrice) {
      toast({ variant: 'destructive', title: 'Budget too low', description: `Minimum $${totalPrice}.` });
      return;
    }
    setLoading(true);
    try {
      await serviceRequestService.createRequest(user.id, items, budget, totalPrice);
      toast({ title: 'Request submitted', description: 'We will follow up shortly.' });
      navigate('/dashboard?tab=requests');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {services.map((s, idx) => (
          <div key={s.id} className="flex items-center space-x-4">
            <Checkbox
              checked={s.selected}
              onCheckedChange={() => toggleSelection(idx)}
              id={`svc-${s.id}`}
            />
            <label htmlFor={`svc-${s.id}`} className="flex-1">
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-muted-foreground">${s.rate.toFixed(2)}</div>
            </label>
            {s.selected && (
              <input
                type="number"
                min={1}
                value={s.qty}
                onChange={e => updateQty(idx, parseInt(e.target.value) || 1)}
                className="input-field w-20"
              />
            )}
          </div>
        ))}
      </div>
      <div>
        <label className="font-medium">Budget ($):</label>
        <input
          type="number"
          min={0}
          value={budget}
          onChange={e => setBudget(parseFloat(e.target.value) || 0)}
          className="input-field w-32"
          required
        />
      </div>
      <div className="font-semibold">Total: ${totalPrice.toFixed(2)}</div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit'}
      </Button>
    </form>
  );
}
