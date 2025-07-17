'use client';

import * as React from 'react';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateArchitectureDiagram } from '@/ai/flows/generate-architecture-diagram';
import { Sparkles, Bot } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    background: '#ffffff',
    primaryColor: '#F9FAFB',
    primaryTextColor: '#1F2937',
    primaryBorderColor: '#E5E7EB',
    lineColor: '#6B7280',
    secondaryColor: '#E5E7EB',
    tertiaryColor: '#F3F4F6',
  }
});

interface ArchitectureDiagramProps {
  systemDescription: string;
}

export function ArchitectureDiagram({ systemDescription }: ArchitectureDiagramProps) {
  const [mermaidCode, setMermaidCode] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const diagramRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
        setMermaidCode(result.mermaidCode);
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
        <div className="w-full min-h-[300px] p-4 border rounded-lg bg-gray-50 flex items-center justify-center">
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
