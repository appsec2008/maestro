'use server';

/**
 * @fileOverview Generates a Mermaid architecture diagram from a system description.
 *
 * - generateArchitectureDiagram - A function that generates a Mermaid diagram.
 * - GenerateArchitectureDiagramInput - The input type for the generateArchitectureDiagram function.
 * - GenerateArchitectureDiagramOutput - The return type for the generateArchitectureDiagram function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateArchitectureDiagramInputSchema = z.object({
  systemDescription: z.string().describe('A detailed description of the AI agent system.'),
});
export type GenerateArchitectureDiagramInput = z.infer<typeof GenerateArchitectureDiagramInputSchema>;

const GenerateArchitectureDiagramOutputSchema = z.object({
  mermaidCode: z.string().describe('The generated MermaidJS code for the architecture diagram.'),
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
  prompt: `You are an expert system architect. Your task is to create a C4-style architecture diagram in MermaidJS format based on the provided system description.

The diagram should clearly illustrate the main components (containers), databases, external systems, and user interactions. Use standard C4 modeling concepts.

System Description:
{{{systemDescription}}}

Instructions:
1.  Analyze the system description to identify key software systems, containers (applications, data stores, microservices), and external dependencies.
2.  Represent these components using MermaidJS syntax, specifically for a flowchart.
3.  Show the relationships and data flow between components.
4.  The code must start with 'graph TD;'.
5.  IMPORTANT: If any node text contains special characters like parentheses, brackets, or hyphens, you MUST enclose the entire text in double quotes. For example, use 'A["Node with (parentheses)"]' instead of 'A[Node with (parentheses)]'.
6.  Do not include any explanations, just the raw MermaidJS code.

Return the output as a JSON object containing the 'mermaidCode' field.`,
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
