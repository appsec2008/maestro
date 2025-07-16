// use server'
'use server';

/**
 * @fileOverview Generates prompts for the Gemini API based on MAESTRO layer, system description, threat templates, and risk factors.
 *
 * - generateMaestroLayerPrompt - A function that generates a prompt for a given MAESTRO layer.
 * - GenerateMaestroLayerPromptInput - The input type for the generateMaestroLayerPrompt function.
 * - GenerateMaestroLayerPromptOutput - The return type for the generateMaestroLayerPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MaestroLayerSchema = z.enum([
  'Foundation Models',
  'Data Operations',
  'Agent Frameworks',
  'Deployment & Infrastructure',
  'Evaluation & Observability',
  'Security & Compliance',
  'Agent Ecosystem',
]);

const GenerateMaestroLayerPromptInputSchema = z.object({
  systemDescription: z
    .string()
    .describe('A description of the AI agent system being analyzed.'),
  maestroLayer: MaestroLayerSchema.describe('The MAESTRO layer to generate a prompt for.'),
  threatTemplates: z
    .string()
    .describe('A template of threats and vulnerabilities relevant to the MAESTRO layer.'),
});
export type GenerateMaestroLayerPromptInput = z.infer<
  typeof GenerateMaestroLayerPromptInputSchema
>;

const GenerateMaestroLayerPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated prompt for the Gemini API.'),
});
export type GenerateMaestroLayerPromptOutput = z.infer<
  typeof GenerateMaestroLayerPromptOutputSchema
>;

export async function generateMaestroLayerPrompt(
  input: GenerateMaestroLayerPromptInput
): Promise<GenerateMaestroLayerPromptOutput> {
  return generateMaestroLayerPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMaestroLayerPrompt',
  input: {schema: GenerateMaestroLayerPromptInputSchema},
  output: {schema: GenerateMaestroLayerPromptOutputSchema},
  prompt: `You are an expert security analyst specializing in AI agent systems.  Your task is to generate a prompt for the Gemini API that will be used to identify potential threats and vulnerabilities in a specific MAESTRO layer of an AI agent system.

MAESTRO Layer: {{{maestroLayer}}}

System Description: {{{systemDescription}}}

Threat Templates: {{{threatTemplates}}}

Agentic AI Risk Factors:
- Non-Determinism: How might the non-deterministic nature of AI models lead to unpredictable behavior and security vulnerabilities?
- Agent Autonomy: How does the agent's ability to make decisions and take actions without human intervention increase the attack surface?
- Dynamic Nature of Agent Identity: How do dynamically changing agent identities and verifiable credentials impact trust and authentication?
- Unintended Tool Use: How can agents use tools incorrectly or maliciously, even without explicit malicious intent?
- Message Injection: How can attackers inject malicious content into messages to manipulate agent behavior?
- Data Poisoning: How can compromised data sources or malicious data injected during task execution impact decision-making?
- Cross-Layer Attacks: How can vulnerabilities in one MAESTRO layer be exploited to compromise another?
- Multi-Agent Interactions: How can unintended consequences arise when multiple agents interact, especially given their autonomy and changing identities?
- Emergent Behavior: How might unexpected and potentially harmful behaviors emerge from complex interactions between agents and their environment?

Given the MAESTRO layer, system description, threat templates, and agentic AI risk factors, generate a prompt for the Gemini API that will elicit a comprehensive threat model for the specified layer. The prompt should encourage the Gemini API to consider the unique risks associated with AI agent systems and to identify potential vulnerabilities that might not be apparent in traditional security assessments.

Ensure the prompt is clear, concise, and specific, guiding the Gemini API to focus on the most relevant threats and vulnerabilities for the given context.

Output the prompt:

`, // No Handlebars logic here, just a string.
});

const generateMaestroLayerPromptFlow = ai.defineFlow(
  {
    name: 'generateMaestroLayerPromptFlow',
    inputSchema: GenerateMaestroLayerPromptInputSchema,
    outputSchema: GenerateMaestroLayerPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
