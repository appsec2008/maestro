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
3.  The code MUST start with 'graph TD;'.
4.  CRITICAL RULE: If a node's text contains ANY special characters (like parentheses, brackets, hyphens, slashes) or multiple words, you MUST enclose the entire text in double quotes.
5.  CRITICAL RULE: NEVER have multi-line text inside node brackets. All text for a node must be on a single line. Use <br/> for line breaks inside a quoted string if necessary.
6.  Do not include any explanations, just the raw MermaidJS code.

Example of correct syntax:
GOOD: A["Node with (parentheses)"]
GOOD: B["Node with - hyphen"]
GOOD: C["Multi-word<br/>(and line break)"]

Example of incorrect syntax:
BAD: A[Node with (parentheses)]
BAD: B[Node with - hyphen]
BAD: C[Multi-word
(and line break)]

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
