'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { llmPoweredThreatModel } from '@/ai/flows/llm-powered-threat-model';
import type { MaestroLayer, Threat } from '@/lib/types';
import { Sparkles } from 'lucide-react';
import { selectModel } from '@/lib/models';

interface ThreatGenerationCardProps {
  activeLayer: MaestroLayer;
  systemDescription: string;
  onSystemDescriptionChange: (value: string) => void;
  onThreatsGenerated: (threats: Partial<Threat>[]) => void;
}

export function ThreatGenerationCard({
  activeLayer,
  systemDescription,
  onSystemDescriptionChange,
  onThreatsGenerated,
}: ThreatGenerationCardProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleRunAnalysis = async () => {
    const selectedModel = selectModel();
    if (!selectedModel) {
        toast({
            title: 'Model Not Configured',
            description: 'Please configure an active AI model in the settings panel.',
            variant: 'destructive',
        });
        return;
    }

    if (!systemDescription.trim()) {
      toast({
        title: 'System Description Required',
        description: 'Please describe your AI agent system before running the analysis.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await llmPoweredThreatModel({
        systemDescription,
        maestroLayer: activeLayer.name,
        model: selectedModel,
      });

      if (result?.threatModel && Array.isArray(result.threatModel)) {
        onThreatsGenerated(result.threatModel);
        toast({
          title: 'Analysis Complete',
          description: `${result.threatModel.length} new threat(s) identified for the ${activeLayer.name} layer.`,
        });
      } else {
        throw new Error('Invalid response from analysis.');
      }
    } catch (error) {
      console.error('Threat generation failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not generate threats. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-xl">LLM-Powered Analysis</CardTitle>
        <CardDescription>
          Describe your AI agent system to generate potential threats for the{' '}
          <span className="font-semibold text-accent">{activeLayer.name}</span> layer.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Textarea
          placeholder="e.g., A customer service chatbot using Langchain, accessing a PostgreSQL user database, deployed on AWS..."
          value={systemDescription}
          onChange={(e) => onSystemDescriptionChange(e.target.value)}
          className="min-h-[150px] text-sm"
          aria-label="System Description"
        />
        <Button onClick={handleRunAnalysis} disabled={isLoading}>
            {isLoading ? (
                <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                </>
            ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Threats
                </>
            )}
        </Button>
      </CardContent>
    </Card>
  );
}
