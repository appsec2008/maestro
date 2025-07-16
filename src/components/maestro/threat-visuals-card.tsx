'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayeredDiagram } from './layered-diagram';
import { RiskMatrix } from './risk-matrix';
import type { Threat } from '@/lib/types';

interface ThreatVisualsCardProps {
  threats: Threat[];
}

export function ThreatVisualsCard({ threats }: ThreatVisualsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Threat Visualizations</CardTitle>
        <CardDescription>
          Visualize the threat landscape across all MAESTRO layers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="layered-diagram">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="layered-diagram">Layered Diagram</TabsTrigger>
            <TabsTrigger value="risk-matrix">Risk Matrix</TabsTrigger>
          </TabsList>
          <TabsContent value="layered-diagram">
            <LayeredDiagram threats={threats} />
          </TabsContent>
          <TabsContent value="risk-matrix">
            <RiskMatrix threats={threats} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
