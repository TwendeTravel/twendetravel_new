import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { serviceRequestService, Service, ServiceRequestItem } from '@/services/service-requests';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { adminAssignmentService } from '@/services/admin-assignments';
import { conversationService } from '@/services/conversations';
import { messageService } from '@/services/messages';

interface ServiceWithState extends Service {
  selected: boolean;
  qty: number;
}

export function ServiceRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState<ServiceWithState[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // New fields
  const [origin, setOrigin] = useState<string>('');
  const [destinationInput, setDestinationInput] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Prefill destination from URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dest = params.get('destination');
    if (dest) {
      setDestinationInput(dest);
    }
  }, [location.search]);

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
    .reduce((sum, s) => sum + ((s.rate ?? 0) * s.qty), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate origin/destination/description
    if (!origin.trim() || !destinationInput.trim()) {
      toast({ variant: 'destructive', title: 'Missing info', description: 'Provide origin and destination.' });
      return;
    }
    if (!description.trim()) {
      toast({ variant: 'destructive', title: 'Missing description', description: 'Describe your ideal experience.' });
      return;
    }
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
      const newReq = await serviceRequestService.createRequest(
        user.id,
        items,
        budget,
        totalPrice,
        origin.trim(),
        destinationInput.trim(),
        description.trim()
      );
      toast({ title: 'Request submitted', description: 'We will follow up shortly.' });
      // Auto-message admin about new service request
      (async () => {
        try {
          const adminId = await adminAssignmentService.getAssignmentForTraveler(user.id);
          if (adminId) {
            const conv = await conversationService.create({ admin_id: adminId });
            const servicesList = items
              .map(({ service_id, qty }) => {
                const svc = services.find(s => s.id === service_id);
                return `${svc?.name ?? 'Service'} x${qty}`;
              })
              .join(', ');
            const msgText = `New service request from ${origin.trim()} ➔ ${destinationInput.trim()}: ${servicesList}. Budget: $${budget}.`;
            await messageService.sendMessage(conv.id, msgText);
          }
        } catch (err) {
          console.error('Failed to auto-notify admin:', err);
        }
      })();
      navigate('/dashboard?tab=requests');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* New inputs for origin & destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Origin</label>
          <input
            type="text"
            value={origin}
            onChange={e => setOrigin(e.target.value)}
            placeholder="e.g. Ghana"
            className="input-field w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Destination</label>
          <input
            type="text"
            value={destinationInput}
            onChange={e => setDestinationInput(e.target.value)}
            placeholder="e.g. Kenya"
            className="input-field w-full"
            required
          />
        </div>
      </div>

      {/* New description textarea */}
      <div>
        <label className="block font-medium">Describe your ideal experience</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Tell us what you'd like..."
          className="textarea-field w-full"
          rows={4}
          required
        />
      </div>

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
              {s.rate != null && (
                <div className="text-sm text-muted-foreground">${s.rate.toFixed(2)}</div>
              )}
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
