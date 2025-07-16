const API_KEY_STORAGE_KEY = 'google-api-key';

export function setGoogleApiKey(apiKey: string): void {
  if (typeof window !== 'undefined') {
    if (apiKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }
}

export function getGoogleApiKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  }
  // On the server, we might use environment variables
  return process.env.GOOGLE_API_KEY || null;
}
