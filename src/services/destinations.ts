const API_URL = 'https://twendetravel.infinityfreeapp.com/api';

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  rating: number;
  popular: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const destinationService = {
  async getAll(): Promise<Destination[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/destinations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }
    
    return response.json();
  },

  async getById(id: string): Promise<Destination> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/destinations/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch destination');
    }
    
    return response.json();
  },
};