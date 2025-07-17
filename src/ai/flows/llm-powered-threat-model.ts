'use server';

/**
 * @fileOverview Generates a threat model using an LLM based on a system description and MAESTRO layer.
 *
 * - llmPoweredThreatModel - A function that uses an LLM to generate a threat model.
 * - LLMPoweredThreatModelInput - The input type for the llmPoweredThreatModel function.
 * - LLMPoweredThreatModelOutput - The return type for the llmPoweredThreatModel function.
 */

import {ai, getModelRef} from '@/ai/genkit';
import {z} from 'genkit';
import { ModelConfigSchema, type ModelConfig } from '@/lib/models';

const LLMPoweredThreatModelInputSchema = z.object({
  systemDescription: z.string().describe('Description of the AI agent system.'),
  maestroLayer: z.string().describe('The MAESTRO layer to generate the threat model for.'),
  model: ModelConfigSchema.describe('The AI model configuration to use for generation.'),
});
export type LLMPoweredThreatModelInput = z.infer<
  typeof LLMPoweredThreatModelInputSchema
>;

const ThreatSchema = z.object({
  name: z.string().describe('The name of the threat.'),
  description: z.string().describe('A detailed description of the threat.'),
  risk: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The assessed risk level of the threat.'),
});

const LLMPoweredThreatModelOutputSchema = z.object({
    threatModel: z.array(ThreatSchema).describe('The generated threat model as an array of threat objects.'),
});

export type LLMPoweredThreatModelOutput = z.infer<
  typeof LLMPoweredThreatModelOutputSchema
>;

export async function llmPoweredThreatModel(
  input: LLMPoweredThreatModelInput
): Promise<LLMPoweredThreatModelOutput> {
  return llmPoweredThreatModelFlow(input);
}


const llmPoweredThreatModelFlow = ai.defineFlow(
  {
    name: 'llmPoweredThreatModelFlow',
    inputSchema: LLMPoweredThreatModelInputSchema,
    outputSchema: LLMPoweredThreatModelOutputSchema,
  },
  async (input) => {
    const modelRef = await getModelRef(input.model);

    const prompt = await ai.definePrompt({
      name: 'llmPoweredThreatModelPrompt',
      input: {schema: LLMPoweredThreatModelInputSchema},
      output: {schema: LLMPoweredThreatModelOutputSchema},
      prompt: `You are an expert AI security analyst specializing in threat modeling for complex AI agent systems using the MAESTRO framework.

Your task is to analyze the provided system description and identify potential threats within the specified MAESTRO layer.

Generate a list of 2-3 detailed and specific threats. For each threat, provide a name, a comprehensive description, and assess its risk level (Low, Medium, High, or Critical).

System Description:
{{{systemDescription}}}

MAESTRO Layer to Analyze:
{{{maestroLayer}}}

Return the output as a JSON object containing a 'threatModel' array. Each object in the array should represent a single threat and have 'name', 'description', and 'risk' fields. Ensure your analysis is directly relevant to the provided system and layer.`,
      model: modelRef,
    });

    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate threat model from LLM.");
    }
    // The model now directly returns the object in the correct format.
    return output;
  }
);
