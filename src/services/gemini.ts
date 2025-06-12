// Service to interact with Google Gemini API and handle offline caching of responses

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const CACHE_PREFIX = 'travel_assistant_cache_';

// Function to generate a cache key based on the user prompt
function getCacheKey(prompt: string): string {
  return CACHE_PREFIX + btoa(prompt);
}

// Response shape for generateContent endpoint
interface GeminiResponse {
  candidates: { content: { text: string } }[];
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

  // Online: call Gemini 2.0 Flash generateContent endpoint
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const requestBody = {
    contents: [
      { parts: [ { text: prompt } ] }
    ]
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
  const text = data.candidates?.[0]?.content.text.trim() || '';

  // Cache the response
  try {
    localStorage.setItem(cacheKey, JSON.stringify(text));
  } catch {
    // ignore storage errors
  }

  return text;
}
