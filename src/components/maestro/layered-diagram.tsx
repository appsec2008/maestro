
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

export function LayeredDiagram({ threats }: LayeredDiagramProps) {
  const threatsByLayer = React.useMemo(() => {
    const grouped: { [key: string]: Threat[] } = {};
    for (const layer of MAESTRO_LAYERS) {
        grouped[layer.name] = [];
    }

    for (const threat of threats) {
        const layerName = threat.layer;
        if (layerName === 'All') {
            for (const layer of MAESTRO_LAYERS) {
                grouped[layer.name].push(threat);
            }
        } else if (grouped[layerName]) {
             grouped[layerName].push(threat);
        }
    }
    return grouped;
  }, [threats]);

  return (
    <div className="w-full space-y-2 rounded-lg border p-4">
      {MAESTRO_LAYERS.map(layer => {
        const LayerIcon = layer.icon;
        const layerThreats = threatsByLayer[layer.name] || [];
        return (
          <Card key={layer.id} className="bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LayerIcon className="h-4 w-4 text-muted-foreground" />
                {layer.name}
              </CardTitle>
              <Badge variant="secondary">{layerThreats.length} threats</Badge>
            </CardHeader>
            {layerThreats.length > 0 && (
                <CardContent className="p-3 pt-0">
                    <div className="flex flex-wrap gap-1">
                        {layerThreats.map(threat => (
                            <Badge key={threat.id} variant="outline" className={cn("font-normal", riskLevelColors[threat.risk])}>
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
