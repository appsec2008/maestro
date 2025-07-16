'use client';

import * as React from 'react';
import type { Threat } from '@/lib/types';
import { MAESTRO_LAYERS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface LayeredDiagramProps {
  threats: Threat[];
}

const riskLevelColors: Record<string, string> = {
  Low: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  High: 'bg-orange-100 text-orange-800 border-orange-200',
  Critical: 'bg-red-100 text-red-800 border-red-200',
};

export function LayeredDiagram({ threats }: LayeredDiagramProps) {
  const threatsByLayer = React.useMemo(() => {
    const grouped: { [key: string]: Threat[] } = {};
    for (const layer of MAESTRO_LAYERS) {
        grouped[layer.name] = [];
    }

    for (const threat of threats) {
        if(threat.layer === 'All') {
            for (const layer of MAESTRO_LAYERS) {
                if (!grouped[layer.name]) grouped[layer.name] = [];
                grouped[layer.name].push(threat);
            }
        } else {
            if (!grouped[threat.layer]) grouped[threat.layer] = [];
            grouped[threat.layer].push(threat);
        }
    }
    return grouped;
  }, [threats]);

  return (
    <div className="w-full space-y-4 rounded-lg border p-4">
      {MAESTRO_LAYERS.map(layer => {
        const LayerIcon = layer.icon;
        const layerThreats = threatsByLayer[layer.name] || [];
        return (
          <Card key={layer.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LayerIcon className="h-4 w-4 text-muted-foreground" />
                {layer.name}
              </CardTitle>
              <Badge variant="secondary">{layerThreats.length} threats</Badge>
            </CardHeader>
            <CardContent>
              {layerThreats.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {layerThreats.map(threat => (
                        <Badge key={threat.id} variant="outline" className={riskLevelColors[threat.risk]}>
                            {threat.name}
                        </Badge>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No threats specific to this layer.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
