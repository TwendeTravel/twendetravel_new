import { supabase } from '@/lib/supabaseClient';

const API_HOST = 'sky-scrapper.p.rapidapi.com';
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY as string;

export interface AgentOption {
  id: string;
  name: string;
  url: string;
  price: number;
}

export interface PricingOption {
  agents: AgentOption[];
  totalPrice: number;
}

export interface Itinerary {
  legs: any[];
  pricingOptions: PricingOption[];
}

/**
 * Fetches flight itinerary from RapidAPI Air Scraper API
 */
export async function getFlightItinerary(
  origin: string,
  destination: string,
  date: string
): Promise<Itinerary> {
  const legsParam = [{ destination, origin, date }];
  const path = `/api/v1/flights/getFlightDetails?legs=${encodeURIComponent(
    JSON.stringify(legsParam)
  )}&adults=1&currency=USD&locale=en-US&market=en-US&cabinClass=economy&countryCode=US`;

  // Check cache in Supabase for current user
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  const { data: cached, error: cacheError } = await supabase
    .from('flight_searches')
    .select('itinerary')
    .eq('origin', origin)
    .eq('destination', destination)
    .eq('date', date)
    .eq('user_id', userId)
    .order('searched_at', { ascending: false })
    .limit(1)
    .single();
  if (cached?.itinerary) {
    return cached.itinerary as Itinerary;
  }

  // Fetch new data from API
  const res = await fetch(`https://${API_HOST}${path}`, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  });
  const json = await res.json();
  if (!json.status) {
    throw new Error('Error fetching flights');
  }
  const itinerary: Itinerary = json.data.itinerary;

  // Cache search and results in Supabase under user
  await supabase.from('flight_searches').insert({
    user_id: userId,
    origin,
    destination,
    date,
    itinerary,
    searched_at: new Date().toISOString(),
  });

  return itinerary;
}
