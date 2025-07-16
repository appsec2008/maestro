'use client';

import * as React from 'react';
import type { Threat, RiskLevel } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RiskMatrixProps {
  threats: Threat[];
}

const riskLevels: RiskLevel[] = ['Low', 'Medium', 'High', 'Critical'];
// For this visualization, we'll map impact to risk level and use a fixed set of likelihoods.
const likelihoods = ['Low', 'Medium', 'High'];

const riskLevelColors: Record<RiskLevel, string> = {
  Low: 'bg-green-500 hover:bg-green-600',
  Medium: 'bg-yellow-500 hover:bg-yellow-600',
  High: 'bg-orange-500 hover:bg-orange-600',
  Critical: 'bg-red-500 hover:bg-red-600',
};

export function RiskMatrix({ threats }: RiskMatrixProps) {
  // This is a simplified mapping for visualization. A real app would have distinct likelihood/impact properties.
  const matrix: { [key: string]: { [key: string]: Threat[] } } = {};
  likelihoods.forEach(l => {
    matrix[l] = {};
    riskLevels.forEach(r => {
      matrix[l][r] = [];
    });
  });

  threats.forEach(threat => {
    // Simplified logic: Distribute threats somewhat randomly for a better visual demo
    const likelihoodIndex = (threat.name.length % 3);
    const likelihood = likelihoods[likelihoodIndex];
    if (matrix[likelihood] && matrix[likelihood][threat.risk]) {
      matrix[likelihood][threat.risk].push(threat);
    }
  });

  return (
    <TooltipProvider>
      <div className="w-full rounded-lg border p-4">
        <div className="grid grid-cols-[auto,1fr,1fr,1fr,1fr] items-center text-center font-semibold">
          <div />
          {riskLevels.map(level => (
            <div key={level} className="p-2 text-sm">
              {level} Impact
            </div>
          ))}

          {likelihoods.slice().reverse().map(likelihood => (
            <React.Fragment key={likelihood}>
              <div className="p-2 text-sm [writing-mode:vertical-rl]">{likelihood} Likelihood</div>
              {riskLevels.map(risk => {
                const cellThreats = matrix[likelihood][risk];
                return (
                  <div
                    key={`${likelihood}-${risk}`}
                    className="flex h-24 items-center justify-center border bg-muted/20 p-2"
                  >
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {cellThreats.map(threat => (
                        <Tooltip key={threat.id} delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                'h-4 w-4 rounded-full cursor-pointer transition-transform hover:scale-125',
                                riskLevelColors[threat.risk]
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">{threat.name}</p>
                            <p className="text-sm text-muted-foreground">{threat.layer}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Note: Likelihood is estimated for visualization purposes.
        </div>
      </div>
    </TooltipProvider>
  );
}
