'use server';

/**
 * @fileOverview Generates a D3.js-compatible graph data structure from a system description.
 *
 * - generateArchitectureDiagram - A function that generates graph data.
 */

import { ai, getModelRef } from '@/ai/genkit';
import { 
    GenerateArchitectureDiagramInputSchema, 
    GenerateArchitectureDiagramOutputSchema,
    type GenerateArchitectureDiagramInput,
    type GenerateArchitectureDiagramOutput
} from '@/lib/schemas';


export async function generateArchitectureDiagram(
  input: GenerateArchitectureDiagramInput
): Promise<GenerateArchitectureDiagramOutput> {
  return generateArchitectureDiagramFlow(input);
}

const generateArchitectureDiagramFlow = ai.defineFlow(
  {
    name: 'generateArchitectureDiagramFlow',
    inputSchema: GenerateArchitectureDiagramInputSchema,
    outputSchema: GenerateArchitectureDiagramOutputSchema,
  },
  async (input) => {
    const modelRef = await getModelRef(input.model);
    
    const prompt = await ai.definePrompt({
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
      model: modelRef,
    });

    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate architecture diagram from LLM.');
    }
    return output;
  }
);
