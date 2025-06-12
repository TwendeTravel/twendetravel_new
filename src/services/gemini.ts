// Service to interact with Google Gemini API and handle offline caching of responses

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const CACHE_PREFIX = 'travel_assistant_cache_';

// Function to generate a cache key based on the user prompt
function getCacheKey(prompt: string): string {
  return CACHE_PREFIX + btoa(prompt);
}

interface GeminiResponse {
  candidates: { output: string }[];
}

// Ask Gemini model for a response to the given prompt
export async function askGemini(prompt: string): Promise<string> {
  const cacheKey = getCacheKey(prompt);
  // If offline, return cached response if available
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached) as string;
    } else {
      throw new Error('Offline: no cached response available');
    }
  }

  // Online: call Gemini API
  // Use Google's Generative Language API endpoint with API key
  // Try stable v1 endpoint for Generative Language API
  // Use beta2 endpoint for Generative Language API
  const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${API_KEY}`;
  const requestBody = {
    prompt: {
      text: prompt
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${errorText}`);
  }

  const data = (await response.json()) as GeminiResponse;
  const text = data.candidates?.[0]?.output?.trim() || '';

  // Cache the response
  try {
    localStorage.setItem(cacheKey, JSON.stringify(text));
  } catch {
    // ignore storage errors
  }

  return text;
}
