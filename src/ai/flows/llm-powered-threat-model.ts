'use server';

/**
 * @fileOverview Generates a threat model using an LLM based on a system description and MAESTRO layer.
 *
 * - llmPoweredThreatModel - A function that uses an LLM to generate a threat model.
 */

import {ai, getModelRef} from '@/ai/genkit';
import { 
  LLMPoweredThreatModelInputSchema, 
  LLMPoweredThreatModelOutputSchema,
  type LLMPoweredThreatModelInput,
  type LLMPoweredThreatModelOutput
} from '@/lib/schemas';


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
