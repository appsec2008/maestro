
'use client';

import * as React from 'react';
import type { Threat } from '@/lib/types';
import { MAESTRO_LAYERS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LayeredDiagramProps {
  threats: Threat[];
}

const riskLevelColors: Record<string, string> = {
  Low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  High: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800',
  Critical: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
};

const layerColors: { [key: string]: string } = {
  'Foundation Models': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
  'Data Operations': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800',
  'Agent Frameworks': 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/50 dark:text-pink-300 dark:border-pink-800',
  'Deployment & Infrastructure': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800',
  'Evaluation & Observability': 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-800',
  'Security & Compliance': 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-800',
  'Agent Ecosystem': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800',
  'All': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
};


export function LayeredDiagram({ threats }: LayeredDiagramProps) {
  const threatsByLayer = React.useMemo(() => {
    const grouped: { [key: string]: Threat[] } = {};
    for (const layer of MAESTRO_LAYERS) {
      grouped[layer.name] = [];
    }
    grouped['All'] = []; // For threats that apply to all layers

    for (const threat of threats) {
      const layerName = threat.layer;
      if (layerName === 'All') {
        grouped['All'].push(threat);
      } else if (grouped[layerName]) {
        grouped[layerName].push(threat);
      }
    }
    return grouped;
  }, [threats]);

  const allLayerThreats = threatsByLayer['All'] || [];

  return (
    <div className="w-full space-y-2 rounded-lg border p-4">
      {MAESTRO_LAYERS.map(layer => {
        const LayerIcon = layer.icon;
        const layerThreats = threatsByLayer[layer.name] || [];
        const totalThreats = layerThreats.length + allLayerThreats.length;

        return (
          <Card key={layer.id} className="bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LayerIcon className="h-4 w-4 text-muted-foreground" />
                {layer.name}
              </CardTitle>
              <Badge variant="secondary">{totalThreats} threat{totalThreats !== 1 ? 's' : ''}</Badge>
            </CardHeader>
            {totalThreats > 0 && (
                <CardContent className="p-3 pt-0">
                    <div className="flex flex-wrap gap-1">
                        {layerThreats.map(threat => (
                            <Badge key={threat.id} variant="outline" className={cn("font-normal", layerColors[layer.name] || layerColors['All'])}>
                                {threat.name}
                            </Badge>
                        ))}
                        {allLayerThreats.map(threat => (
                            <Badge key={`${threat.id}-${layer.id}`} variant="outline" className={cn("font-normal", layerColors['All'])}>
                                {threat.name}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
             )}
          </Card>
        );
      })}
    </div>
  );
}
