import { config } from 'dotenv';
config();

import '@/ai/flows/llm-powered-threat-model.ts';
import '@/ai/flows/generate-maestro-layer-prompt.ts';
import '@/ai/flows/generate-architecture-diagram.ts';
