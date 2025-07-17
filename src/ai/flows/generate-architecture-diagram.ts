'use server';

/**
 * @fileOverview Generates a D3.js-compatible graph data structure from a system description.
 *
 * - generateArchitectureDiagram - A function that generates graph data.
 * - GenerateArchitectureDiagramInput - The input type for the generateArchitectureDiagram function.
 * - GenerateArchitectureDiagramOutput - The return type for the generateArchitectureDiagram function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateArchitectureDiagramInputSchema = z.object({
  systemDescription: z.string().describe('A detailed description of the AI agent system.'),
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

const GenerateArchitectureDiagramOutputSchema = z.object({
  nodes: z.array(NodeSchema).describe('An array of all the nodes in the system.'),
  links: z.array(LinkSchema).describe('An array of all the links connecting the nodes.'),
});
export type GenerateArchitectureDiagramOutput = z.infer<typeof GenerateArchitectureDiagramOutputSchema>;

export async function generateArchitectureDiagram(
  input: GenerateArchitectureDiagramInput
): Promise<GenerateArchitectureDiagramOutput> {
  return generateArchitectureDiagramFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArchitectureDiagramPrompt',
  input: { schema: GenerateArchitectureDiagramInputSchema },
  output: { schema: GenerateArchitectureDiagramOutputSchema },
  prompt: `You are an expert system architect. Your task is to create a graph data structure in JSON format based on the provided system description. This structure will be used to render a diagram with D3.js.

System Description:
{{{systemDescription}}}

Instructions:
1.  Analyze the system description to identify all key components.
2.  Categorize each component into one of the following types: 'user', 'agent', 'container', 'database', 'external', 'service'.
3.  Create a node for each component with a unique 'id', a concise 'label', and its 'type'.
4.  Identify the relationships and data flows between these components.
5.  Create a link for each relationship, specifying the 'source' and 'target' node ids.
6.  Ensure that the 'id' fields are short, camelCased, and unique.
7.  Ensure that the 'label' for each node is brief and human-readable.
8.  Return the final output as a single JSON object with two keys: "nodes" and "links". Do not include any explanations, just the raw JSON.

Example Output Format:
{
  "nodes": [
    { "id": "investor", "label": "Investor", "type": "user" },
    { "id": "agentUi", "label": "Agent UI", "type": "container" },
    { "id": "newsApi", "label": "News API", "type": "external" }
  ],
  "links": [
    { "source": "investor", "target": "agentUi" },
    { "source": "agentUi", "target": "newsApi" }
  ]
}
`,
});

const generateArchitectureDiagramFlow = ai.defineFlow(
  {
    name: 'generateArchitectureDiagramFlow',
    inputSchema: GenerateArchitectureDiagramInputSchema,
    outputSchema: GenerateArchitectureDiagramOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate architecture diagram from LLM.');
    }
    return output;
  }
);
