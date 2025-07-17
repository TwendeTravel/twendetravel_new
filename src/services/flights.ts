import { supabase } from '@/lib/supabaseClient';

const API_HOST = 'sky-scrapper.p.rapidapi.com';
// Supabase table for airport caching
const AIRPORT_TABLE = 'airport_cache';
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY as string;

/**
 * Search airport by IATA code to get skyId and entityId
 */
async function searchAirport(code: string): Promise<{ skyId: string; entityId: string }> {
  // Check persistent cache in Supabase
  const { data: cachedAirport, error: cacheErr } = await supabase
    .from(AIRPORT_TABLE)
    .select('skyId, entityId')
    .eq('code', code)
    .single();
  if (cachedAirport) {
    return { skyId: cachedAirport.skyId, entityId: cachedAirport.entityId };
  }
  // Correct endpoint for airport search
  // Note: endpoint is singular 'searchAirport'
  const url = `https://${API_HOST}/api/v1/flights/searchAirport?query=${encodeURIComponent(code)}`;
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST,
    },
  });
  const json = await res.json();
  if (!json.status || !json.data || json.data.length === 0) {
    throw new Error(`Airport not found for code: ${code}`);
  }
  const airport = json.data[0];
  // Use the IATA displayCode as skyId and entityId or fallback to id
  const result = {
    skyId: airport.displayCode,
    entityId: airport.entityId || airport.id
  };
  // Persist cache in Supabase
  await supabase.from(AIRPORT_TABLE).insert({
    code,
    skyId: result.skyId,
    entityId: result.entityId,
    fetched_at: new Date().toISOString(),
  });
  return result;
}

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

// Location suggestion type
export interface LocationSuggestion {
  skyId: string;
  entityId: string;
  title: string;
  subtitle?: string;
}

/**
 * Suggest origin or destination locations (cities/airports)
 */
/**
 * Suggest airport or city locations using v1 airport search
 */
export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  const url = `https://${API_HOST}/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST,
    },
  });
  const json = await res.json();
  if (!json.status || !json.data || !Array.isArray(json.data)) {
    return [];
  }
  return json.data.map((item: any) => ({
    skyId: item.skyId || item.id,
    entityId: item.entityId,
    title: `${item.name} (${item.displayCode})`,  
    subtitle: item.city,
  }));
}

/**
 * Fetches flight itinerary from RapidAPI Air Scraper API
 */
export async function getFlightItinerary(
  origin: string,
  destination: string,
  date: string
): Promise<Itinerary> {
  // Log the flight query request in DB
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  await supabase.from('flight_searches').insert({
    user_id: userId,
    origin,
    destination,
    date,
    searched_at: new Date().toISOString()
  });
  // Notify system of new query
  console.log(`Flight query logged: user ${userId} requested ${origin} -> ${destination} on ${date}`);

  // Return empty placeholder itinerary
  return {
    legs: [],
    pricingOptions: []
  };
}

/**
 * Fetches the cheapest flight itinerary from v2 search results
 */
export async function getCheapestFlight(
  origin: string,
  destination: string,
  date: string
): Promise<Itinerary> {
  const org = await searchAirport(origin);
  const dest = await searchAirport(destination);
  const url = `https://${API_HOST}/api/v2/flights/searchFlights?originSkyId=${encodeURIComponent(
    org.skyId
  )}&destinationSkyId=${encodeURIComponent(dest.skyId)}&originEntityId=${encodeURIComponent(
    org.entityId
  )}&destinationEntityId=${encodeURIComponent(dest.entityId)}&adults=1&sortBy=price&currency=USD&market=en-US&countryCode=US&cabinClass=economy&locale=en-US&date=${encodeURIComponent(
    date
  )}`;
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST,
    },
  });
  const json = await res.json();
  if (!json.status || !json.data || !Array.isArray(json.data.itineraries)) {
    throw new Error('No itineraries found');
  }
  // Pick cheapest
  const cheapest = json.data.itineraries.reduce((a: any, b: any) =>
    a.price.raw <= b.price.raw ? a : b
  );
  // Map to Itinerary
  return {
    legs: cheapest.legs,
    pricingOptions: [
      {
        totalPrice: cheapest.price.raw,
        agents: [
          { id: '', name: '', url: '', price: cheapest.price.raw }
        ],
      },
    ],
  };
}
