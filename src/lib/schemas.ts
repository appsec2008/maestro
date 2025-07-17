import { z } from 'zod';
import type { ModelConfig } from '@/lib/models';

// Common Schemas
export const ModelConfigSchema = z.object({
  id: z.string(),
  provider: z.enum(['google', 'openai', 'together', 'ollama']),
  modelId: z.string(),
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
  label: z.string(),
});

// Schemas for llm-powered-threat-model.ts
export const LLMPoweredThreatModelInputSchema = z.object({
  systemDescription: z.string().describe('Description of the AI agent system.'),
  maestroLayer: z.string().describe('The MAESTRO layer to generate the threat model for.'),
  model: ModelConfigSchema.describe('The AI model configuration to use for generation.'),
});
export type LLMPoweredThreatModelInput = z.infer<typeof LLMPoweredThreatModelInputSchema>;

const ThreatSchema = z.object({
  name: z.string().describe('The name of the threat.'),
  description: z.string().describe('A detailed description of the threat.'),
  risk: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The assessed risk level of the threat.'),
});

export const LLMPoweredThreatModelOutputSchema = z.object({
  threatModel: z.array(ThreatSchema).describe('The generated threat model as an array of threat objects.'),
});
export type LLMPoweredThreatModelOutput = z.infer<typeof LLMPoweredThreatModelOutputSchema>;


// Schemas for generate-maestro-layer-prompt.ts
const MaestroLayerSchema = z.enum([
  'Foundation Models',
  'Data Operations',
  'Agent Frameworks',
  'Deployment & Infrastructure',
  'Evaluation & Observability',
  'Security & Compliance',
  'Agent Ecosystem',
]);

export const GenerateMaestroLayerPromptInputSchema = z.object({
  systemDescription: z
    .string()
    .describe('A description of the AI agent system being analyzed.'),
  maestroLayer: MaestroLayerSchema.describe('The MAESTRO layer to generate a prompt for.'),
  threatTemplates: z
    .string()
    .describe('A template of threats and vulnerabilities relevant to the MAESTRO layer.'),
});
export type GenerateMaestroLayerPromptInput = z.infer<typeof GenerateMaestroLayerPromptInputSchema>;

export const GenerateMaestroLayerPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated prompt for the Gemini API.'),
});
export type GenerateMaestroLayerPromptOutput = z.infer<typeof GenerateMaestroLayerPromptOutputSchema>;


// Schemas for generate-architecture-diagram.ts
export const GenerateArchitectureDiagramInputSchema = z.object({
  systemDescription: z.string().describe('A detailed description of the AI agent system.'),
  model: ModelConfigSchema.describe('The AI model configuration to use for generation.'),
});
export type GenerateArchitectureDiagramInput = z.infer<typeof GenerateArchitectureDiagramInputSchema>;

const NodeSchema = z.object({
  id: z.string().describe('Unique identifier for the node (e.g., "user", "agentFramework").'),
  label: z.string().describe('The display name of the node (e.g., "Investor", "LangChain Agent"). Keep it concise.'),
  type: z.enum(['user', 'agent', 'container', 'database', 'external', 'service']).describe('The category of the node.'),
});

const LinkSchema = z.object({
  source: z.string().describe('The id of the source node.'),
  target: z.string().describe('The id of the target node.'),
  label: z.string().optional().describe('An optional label for the link describing the interaction.'),
});

export const GenerateArchitectureDiagramOutputSchema = z.object({
  nodes: z.array(NodeSchema).describe('An array of all the nodes in the system.'),
  links: z.array(LinkSchema).describe('An array of all the links connecting the nodes.'),
});
export type GenerateArchitectureDiagramOutput = z.infer<typeof GenerateArchitectureDiagramOutputSchema>;
