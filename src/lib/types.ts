export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type Threat = {
  id: string;
  name: string;
  description: string;
  vulnerabilities: string[];
  attackVectors: string[];
  risk: RiskLevel;
  mitigations: string[];
  tags: string[];
  layer: string;
};

export type MaestroLayer = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};
