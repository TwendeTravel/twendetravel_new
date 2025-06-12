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
  const result = { skyId: airport.skyId || airport.id, entityId: airport.entityId };
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

/**
 * Fetches flight itinerary from RapidAPI Air Scraper API
 */
export async function getFlightItinerary(
  origin: string,
  destination: string,
  date: string
): Promise<Itinerary> {
  // Lookup origin/destination sky and entity IDs
  const org = await searchAirport(origin);
  const dest = await searchAirport(destination);
  // Initiate flight search to get sessionId and itineraryId
  const searchUrl = `https://${API_HOST}/api/v2/flights/searchFlights?originSkyId=${encodeURIComponent(
    org.skyId
  )}&destinationSkyId=${encodeURIComponent(dest.skyId)}&originEntityId=${encodeURIComponent(
    org.entityId
  )}&destinationEntityId=${encodeURIComponent(dest.entityId)}&date=${encodeURIComponent(
    date
  )}&adults=1&currency=USD&locale=en-US&market=en-US&cabinClass=economy&countryCode=US`;
  const searchRes = await fetch(searchUrl, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST,
    },
  });
  const searchJson = await searchRes.json();
  if (!searchJson.status) {
    throw new Error('Error initiating flight search: ' + JSON.stringify(searchJson.message));
  }
  // Extract session and itinerary info
  const sessionId: string = searchJson.data.context.sessionId;
  const itineraryId: string = searchJson.data.context.itineraryId ?? searchJson.data.id;
  // Use legs array returned by initial search for details
  const legsParam = searchJson.data.context.legs;

  // Fetch detailed flight information using returned legs
  const detailsUrl = `https://${API_HOST}/api/v1/flights/getFlightDetails?sessionId=${encodeURIComponent(
    sessionId
  )}&itineraryId=${encodeURIComponent(itineraryId)}&legs=${encodeURIComponent(
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
    .maybeSingle();
  if (cached?.itinerary) {
    return cached.itinerary as Itinerary;
  }

  // Fetch new data from API
  const res = await fetch(detailsUrl, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  });
  const json = await res.json();
  if (!json.status) {
    // Include API error details
    throw new Error('Error fetching flights: ' + JSON.stringify(json.message));
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
