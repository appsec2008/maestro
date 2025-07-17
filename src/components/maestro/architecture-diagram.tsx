'use client';

import * as React from 'react';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateArchitectureDiagram } from '@/ai/flows/generate-architecture-diagram';
import { Sparkles, Bot } from 'lucide-react';

interface ArchitectureDiagramProps {
  systemDescription: string;
}

// Function to clean up common Mermaid syntax errors from LLM output
const cleanupMermaidCode = (code: string): string => {
  let cleanedCode = code;

  // Rule 1: Replace parentheses with brackets inside labels to avoid syntax errors
  cleanedCode = cleanedCode.replace(/\(([^)]+)\)/g, '[$1]');

  // Rule 2: Ensure any node text with special characters or spaces is quoted.
  // This regex finds nodes like `A[some text]` and ensures "some text" is quoted if needed.
  cleanedCode = cleanedCode.replace(
    /(\w+\[)([^\]]+)(\])/g,
    (match, start, content, end) => {
      // If content isn't already quoted and contains characters that should be quoted
      if (!content.startsWith('"') && /[\s-./(),\\]/.test(content)) {
        return `${start}"${content.replace(/"/g, '')}"${end}`;
      }
      return match; // Return original if no change needed
    }
  );

  return cleanedCode;
};


export function ArchitectureDiagram({ systemDescription }: ArchitectureDiagramProps) {
  const [mermaidCode, setMermaidCode] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const diagramRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initialize Mermaid on the client side only
  React.useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      fontFamily: '"Inter", sans-serif',
    });
  }, []);

  React.useEffect(() => {
    const renderDiagram = async () => {
      if (mermaidCode && diagramRef.current) {
        try {
          diagramRef.current.innerHTML = ''; // Clear previous diagram
          const { svg } = await mermaid.render(`mermaid-graph-${Date.now()}`, mermaidCode);
          diagramRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering failed:', error);
          toast({
            title: 'Diagram Rendering Failed',
            description: 'Could not render the architecture diagram.',
            variant: 'destructive',
          });
          if (diagramRef.current) {
            diagramRef.current.innerHTML = `<p class="text-destructive text-center">Failed to render diagram. The generated code may be invalid.</p><pre class="mt-2 p-2 bg-muted rounded-md text-xs">${mermaidCode}</pre>`;
          }
        }
      }
    };
    renderDiagram();
  }, [mermaidCode, toast]);

  const handleGenerateDiagram = async () => {
    if (!systemDescription.trim()) {
      toast({
        title: 'System Description Required',
        description: 'Please describe your system to generate a diagram.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setMermaidCode('');
    if (diagramRef.current) diagramRef.current.innerHTML = '';

    try {
      const result = await generateArchitectureDiagram({ systemDescription });
      if (result.mermaidCode) {
        const cleanedCode = cleanupMermaidCode(result.mermaidCode);
        setMermaidCode(cleanedCode);
        toast({
          title: 'Diagram Generated',
          description: 'Architecture diagram has been successfully generated.',
        });
      } else {
        throw new Error('Invalid response from AI.');
      }
    } catch (error) {
      console.error('Diagram generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate the architecture diagram. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-center mb-4">
          <Button onClick={handleGenerateDiagram} disabled={isLoading}>
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating Diagram...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Architecture Diagram
              </>
            )}
          </Button>
        </div>
        <div className="w-full min-h-[300px] p-4 border rounded-lg bg-gray-50 flex items-center justify-center dark:bg-gray-900/20">
          {isLoading && <Bot className="h-16 w-16 text-muted-foreground animate-pulse" />}
          {!isLoading && !mermaidCode && (
             <div className="text-center text-muted-foreground">
                <Bot className="h-16 w-16 mx-auto mb-2" />
                <p>Click "Generate Architecture Diagram" to visualize your system.</p>
            </div>
          )}
          <div ref={diagramRef} className="w-full flex justify-center items-center" />
        </div>
      </CardContent>
    </Card>
  );
}
