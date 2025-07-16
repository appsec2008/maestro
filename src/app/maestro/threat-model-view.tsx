'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { MAESTRO_LAYERS, INITIAL_THREATS, DEFAULT_SYSTEM_DESCRIPTION } from '@/lib/constants';
import type { Threat } from '@/lib/types';
import { ThreatSimulationCard } from '@/components/maestro/threat-simulation-card';
import { ThreatListCard } from '@/components/maestro/threat-list-card';
import { ThreatVisualsCard } from '@/components/maestro/threat-visuals-card';

export function ThreatModelView() {
  const searchParams = useSearchParams();
  const activeLayerId = searchParams.get('layer') || MAESTRO_LAYERS[0].id;
  const activeLayer = MAESTRO_LAYERS.find(l => l.id === activeLayerId) || MAESTRO_LAYERS[0];
  
  const [systemDescription, setSystemDescription] = React.useState(DEFAULT_SYSTEM_DESCRIPTION);
  const [threats, setThreats] = React.useState<Threat[]>(INITIAL_THREATS);

  const addThreat = (newThreat: Omit<Threat, 'id'>) => {
    setThreats(prev => [...prev, { ...newThreat, id: `threat-${Date.now()}` }]);
  };
  
  const updateThreat = (updatedThreat: Threat) => {
    setThreats(prev => prev.map(t => t.id === updatedThreat.id ? updatedThreat : t));
  };

  const deleteThreat = (threatId: string) => {
    setThreats(prev => prev.filter(t => t.id !== threatId));
  }

  const addGeneratedThreats = (generatedThreats: Partial<Threat>[]) => {
    const newThreats: Threat[] = generatedThreats.map((t, index) => ({
      id: `gen-threat-${Date.now()}-${index}`,
      name: t.name || 'Untitled Threat',
      description: t.description || 'No description provided.',
      vulnerabilities: t.vulnerabilities || [],
      attackVectors: t.attackVectors || [],
      risk: t.risk || 'Medium',
      mitigations: t.mitigations || [],
      tags: t.tags || ['generated'],
      layer: t.layer || activeLayer.name,
    }));
    setThreats(prev => [...prev, ...newThreats]);
  };
  
  const filteredThreats = React.useMemo(() => {
    return threats.filter(threat => threat.layer === 'All' || threat.layer === activeLayer.name);
  }, [threats, activeLayer]);

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">
          Threat Modeling Dashboard
        </h1>
        <p className="text-muted-foreground">
          Analyzing the <span className="font-semibold text-foreground">{activeLayer.name}</span> layer.
        </p>
      </header>
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
            <ThreatSimulationCard
                activeLayer={activeLayer}
                systemDescription={systemDescription}
                onSystemDescriptionChange={setSystemDescription}
                onThreatsGenerated={addGeneratedThreats}
            />
        </div>
        <main className="lg:col-span-3">
            <ThreatListCard 
              threats={filteredThreats} 
              activeLayerName={activeLayer.name}
              onAddThreat={addThreat}
              onUpdateThreat={updateThreat}
              onDeleteThreat={deleteThreat}
            />
        </main>
      </div>
      <div className="w-full">
        <ThreatVisualsCard threats={threats} />
      </div>
    </div>
  );
}
