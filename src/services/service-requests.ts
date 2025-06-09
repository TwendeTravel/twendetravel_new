const API_URL = 'https://twendetravel.infinityfreeapp.com/api';

export interface ServiceRequest {
  id: string;
  user_id: string;
  service_type: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const serviceRequestService = {
  async getUserRequests(): Promise<ServiceRequest[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/service-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch service requests');
    }
    
    return response.json();
  },

  async create(data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/service-requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create service request');
    }
    
    return response.json();
  },
};