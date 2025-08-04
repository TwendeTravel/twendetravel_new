import { COLLECTIONS, FlightSearch, AirportCache } from '@/lib/firebase-types';
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';

const flightSearchService = new FirestoreService<FlightSearch>(COLLECTIONS.FLIGHT_SEARCHES);
const airportCacheService = new FirestoreService<AirportCache>(COLLECTIONS.AIRPORT_CACHE);

const API_HOST = 'sky-scrapper.p.rapidapi.com';
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY as string;

/**
 * Search airport by IATA code to get skyId and entityId
 */
async function searchAirport(code: string): Promise<{ skyId: string; entityId: string }> {
  try {
    // Check persistent cache in Firebase
    const cachedAirports = await airportCacheService.getWithQuery([
      firestoreHelpers.where('code', '==', code)
    ]);

    if (cachedAirports.length > 0) {
      const cachedAirport = cachedAirports[0];
      return { skyId: cachedAirport.skyId, entityId: cachedAirport.entityId };
    }

    // Fetch from external API if not in cache
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
    const result = {
      skyId: airport.displayCode,
      entityId: airport.entityId || airport.id
    };
    
    // Cache in Firebase
    await airportCacheService.create({
      code,
      skyId: result.skyId,
      entityId: result.entityId,
      fetchedAt: firestoreHelpers.now(),
    });
    
    return result;
  } catch (error) {
    console.error('Error searching airport:', error);
    throw error;
  }
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
 * Suggest airport or city locations using v1 airport search
 */
export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  try {
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
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

/**
 * Fetches flight itinerary from RapidAPI Air Scraper API
 */
export async function getFlightItinerary(
  origin: string,
  destination: string,
  date: string
): Promise<Itinerary> {
  const currentUser = auth.currentUser;
  
  try {
    // Log the flight query request in Firebase
    if (currentUser) {
      await flightSearchService.create({
        userId: currentUser.uid,
        origin,
        destination,
        date,
        searchedAt: firestoreHelpers.now(),
      });
    }
    
    console.log(`Flight query logged: user ${currentUser?.uid} requested ${origin} -> ${destination} on ${date}`);

    // Return empty placeholder itinerary for now
    // This can be enhanced to call the actual flight API
    return {
      legs: [],
      pricingOptions: []
    };
  } catch (error) {
    console.error('Error getting flight itinerary:', error);
    throw error;
  }
}

/**
 * Fetches the cheapest flight itinerary from v2 search results
 */
export async function getCheapestFlight(
  origin: string,
  destination: string,
  date: string
): Promise<Itinerary> {
  try {
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
  } catch (error) {
    console.error('Error getting cheapest flight:', error);
    throw error;
  }
}

export const flightsService = {
  searchAirport,
  searchLocations,
  getFlightItinerary,
  getCheapestFlight,
  
  // Additional Firebase-specific methods
  async getFlightSearchHistory(userId?: string) {
    const currentUser = auth.currentUser;
    const targetUserId = userId || currentUser?.uid;
    
    if (!targetUserId) {
      return [];
    }

    try {
      return await flightSearchService.getWithQuery([
        firestoreHelpers.where('userId', '==', targetUserId),
        firestoreHelpers.orderBy('searchedAt', 'desc'),
        firestoreHelpers.limit(50)
      ]);
    } catch (error) {
      console.error('Error fetching flight search history:', error);
      return [];
    }
  }
};
