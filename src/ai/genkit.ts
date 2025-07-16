import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {getGoogleApiKey} from '@/lib/api-key';

const apiKey = getGoogleApiKey();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey || undefined,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
