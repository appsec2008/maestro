'use server';

import {genkit, GenkitPlugin, ModelReference} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {openai} from 'genkitx-openai';
import { openAICompatible } from '@genkit-ai/compat-oai';
import {ollama} from 'genkitx-ollama';

import {getActiveModels, selectModel} from '@/lib/models';
import type {ModelConfig} from '@/lib/models';

function configurePlugins(): GenkitPlugin[] {
  const plugins: GenkitPlugin[] = [];
  const activeModels = getActiveModels();

  const googleApiKeys = activeModels
    .filter(m => m.provider === 'google' && m.apiKey)
    .map(m => m.apiKey as string);

  const openAiApiKeys = activeModels
    .filter(m => m.provider === 'openai' && m.apiKey)
    .map(m => m.apiKey as string);

  const togetherConfigs = activeModels.filter(m => m.provider === 'together' && m.apiKey);
  
  const ollamaConfigs = activeModels.filter(m => m.provider === 'ollama');

  if (googleApiKeys.length > 0) {
    plugins.push(googleAI({apiKey: googleApiKeys}));
  }

  if (openAiApiKeys.length > 0) {
    plugins.push(openai({apiKey: openAiApiKeys[0]}));
  }
  
  if (togetherConfigs.length > 0) {
    plugins.push(
      openAICompatible({
        name: 'together',
        apiKey: togetherConfigs[0].apiKey as string,
        baseURL: 'https://api.together.xyz/v1',
      })
    );
  }

  ollamaConfigs.forEach(config => {
    plugins.push(
      ollama({
        models: [{name: config.modelId, type: 'generate'}],
        serverAddress: config.baseURL || 'http://127.0.0.1:11434',
      })
    );
  });

  return plugins;
}

const plugins = configurePlugins();
if (plugins.length === 0) {
  plugins.push(googleAI());
}


export const ai = genkit({
  plugins: plugins,
});

export async function getModelRef(config: ModelConfig): Promise<ModelReference> {
    switch (config.provider) {
        case 'google':
            return googleAI.model(config.modelId);
        case 'openai':
            return openai.model(config.modelId);
        case 'together':
            return {
                name: `together/${config.modelId}`,
                uid: `together-plugin-together-${config.modelId}`,
            }
        case 'ollama':
            return ollama.model(config.modelId);
        default:
            throw new Error(`Unsupported provider: ${config.provider}`);
    }
}

export async function getSelectedModel(): Promise<ModelReference> {
    const selected = selectModel();
    if (!selected) {
        console.warn("No models configured, falling back to Gemini Flash. Please configure a model in Settings.");
        return googleAI.model('gemini-1.5-flash-latest');
    }
    return await getModelRef(selected);
}
