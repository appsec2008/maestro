'use server';

import {genkit, GenkitPlugin, ModelReference} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {openAI as openai} from 'genkitx-openai';
import { openAICompatible } from '@genkit-ai/compat-oai';
import {ollama} from 'genkitx-ollama';

import type {ModelConfig} from '@/lib/models';
import { getModels } from '@/lib/models';

function configurePlugins(): GenkitPlugin[] {
  const plugins: GenkitPlugin[] = [];
  
  // Note: Since we can't access localStorage on the server, we initialize plugins that don't strictly require keys at startup.
  // The actual model used will be determined by the config passed from the client.
  
  plugins.push(googleAI()); // Always available
  
  // Do NOT initialize openai() or openAICompatible() here, as they require an environment variable.
  // The API keys will be passed dynamically in getModelRef.

  // Enable Ollama, assuming a default address.
  // The client can provide a different one if needed.
  plugins.push(
    ollama({
      models: [{name: 'llama3', type: 'generate'}], // A default model
      serverAddress: 'http://127.0.0.1:11434',
    })
  );

  return plugins;
}

export const ai = genkit({
  plugins: configurePlugins(),
});

export async function getModelRef(config: ModelConfig): Promise<ModelReference> {
    const options: any = {};
    if (config.apiKey) options.apiKey = config.apiKey;

    switch (config.provider) {
        case 'google':
            return googleAI.model(config.modelId);
        case 'openai':
            return openai.model(config.modelId, options);
        case 'together':
             return {
                name: `together/${config.modelId}`,
                uid: `together-plugin-${config.modelId}`,
                config: { apiKey: config.apiKey },
            }
        case 'ollama':
            return ollama.model(config.modelId, {serverAddress: config.baseURL});
        default:
            throw new Error(`Unsupported provider: ${config.provider}`);
    }
}
