'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayeredDiagram } from './layered-diagram';
import { RiskMatrix } from './risk-matrix';
import { ArchitectureDiagram } from './architecture-diagram';
import type { Threat } from '@/lib/types';

interface ThreatVisualsCardProps {
  threats: Threat[];
  systemDescription: string;
}

export function ThreatVisualsCard({ threats, systemDescription }: ThreatVisualsCardProps) {
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layered-diagram">Layered Diagram</TabsTrigger>
            <TabsTrigger value="risk-matrix">Risk Matrix</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>
          <TabsContent value="layered-diagram">
            <LayeredDiagram threats={threats} />
          </TabsContent>
          <TabsContent value="risk-matrix">
            <RiskMatrix threats={threats} />
          </TabsContent>
           <TabsContent value="architecture">
            <ArchitectureDiagram systemDescription={systemDescription} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
