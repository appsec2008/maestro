'use client';

import { z } from 'zod';
import { ModelConfigSchema } from '@/lib/schemas';

const MODEL_CONFIG_STORAGE_KEY = 'maestro-model-configs';
const LAST_MODEL_INDEX_KEY = 'maestro-last-model-index';

export type ModelConfig = z.infer<typeof ModelConfigSchema>;

const ModelsSchema = z.array(ModelConfigSchema);

export function saveModels(models: ModelConfig[]): void {
  if (typeof window !== 'undefined') {
    try {
      const validatedModels = ModelsSchema.parse(models);
      localStorage.setItem(MODEL_CONFIG_STORAGE_KEY, JSON.stringify(validatedModels));
    } catch (error) {
      console.error("Failed to save models:", error);
    }
  }
}

export function getModels(): ModelConfig[] {
  if (typeof window !== 'undefined') {
    const storedModels = localStorage.getItem(MODEL_CONFIG_STORAGE_KEY);
    if (storedModels) {
      try {
        return ModelsSchema.parse(JSON.parse(storedModels));
      } catch (error) {
        console.error("Failed to parse stored models, returning default.", error);
        // If parsing fails, clear the invalid data
        localStorage.removeItem(MODEL_CONFIG_STORAGE_KEY);
      }
    }
  }
  // Return a default configuration if nothing is stored
  return [{
      id: 'default-google',
      provider: 'google',
      modelId: 'gemini-1.5-flash-latest',
      label: 'Default Google Gemini',
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''
  }];
}

export function getActiveModels(): ModelConfig[] {
    const allModels = getModels();
    return allModels.filter(m => {
        if (m.provider === 'ollama') {
            return m.modelId && m.baseURL;
        }
        return m.apiKey && m.modelId;
    });
}

export function selectModel(): ModelConfig | null {
  if (typeof window === 'undefined') {
    const models = getActiveModels();
    return models.length > 0 ? models[0] : null;
  }

  const activeModels = getActiveModels();
  if (activeModels.length === 0) {
    return null;
  }

  let lastIndex = parseInt(localStorage.getItem(LAST_MODEL_INDEX_KEY) || '-1', 10);
  
  const nextIndex = (lastIndex + 1) % activeModels.length;
  
  localStorage.setItem(LAST_MODEL_INDEX_KEY, nextIndex.toString());
  
  console.log(`Using model: ${activeModels[nextIndex].label} (${activeModels[nextIndex].provider})`);
  return activeModels[nextIndex];
}
