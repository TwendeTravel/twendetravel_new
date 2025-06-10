// Generic API helper for communicating with your PHP backend

const API_BASE = 'https://twendetravel.infinityfreeapp.com/api';

export interface ApiError {
  error: string;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/${path}`, {
    ...options,
    headers,
  });
  
  // Handle unauthorized: clear token and redirect to login
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await res.json();
  if (!res.ok) {
    // API returned error payload
    const err: ApiError = data;
    throw new Error(err.error || res.statusText);
  }
  return data;
}
