import { useState } from 'react';
import { getFlightItinerary, Itinerary, PricingOption } from '@/services/flights';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function FlightSearch() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getFlightItinerary(origin, destination, date);
      setItinerary(data);
    } catch (err: any) {
      toast({ title: 'Error fetching flights', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Find Cheapest Flights</h1>
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Origin (e.g. LAX)"
          className="input-field"
          value={origin}
          onChange={e => setOrigin(e.target.value.toUpperCase())}
          required
        />
        <input
          type="text"
          placeholder="Destination (e.g. JFK)"
          className="input-field"
          value={destination}
          onChange={e => setDestination(e.target.value.toUpperCase())}
          required
        />
        <input
          type="date"
          className="input-field"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </Button>
      </form>

      {itinerary && (
        <div className="space-y-4">
          {itinerary.pricingOptions
            .sort((a, b) => a.totalPrice - b.totalPrice)
            .map((opt: PricingOption, idx: number) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>Price: ${opt.totalPrice.toFixed(2)}</span>
                    <a href={opt.agents[0]?.url} target="_blank" rel="noreferrer" className="text-twende-teal underline">
                      Book
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Agent: {opt.agents[0]?.name} (Rating: {opt.agents[0]?.price ? `$${opt.agents[0]?.price}` : 'N/A'})
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
