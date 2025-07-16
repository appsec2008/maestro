import type { MaestroLayer, Threat } from '@/lib/types';
import { Layers, Database, Puzzle, Server, BarChart2, ShieldCheck, Group } from 'lucide-react';

export const MAESTRO_LAYERS: MaestroLayer[] = [
  { id: 'foundation-models', name: 'Foundation Models', description: 'Core AI models and their architectures.', icon: Layers },
  { id: 'data-operations', name: 'Data Operations', description: 'Data pipelines, storage, and processing.', icon: Database },
  { id: 'agent-frameworks', name: 'Agent Frameworks', description: 'Frameworks for building agents.', icon: Puzzle },
  { id: 'deployment-infrastructure', name: 'Deployment & Infrastructure', description: 'Hosting infrastructure for agents.', icon: Server },
  { id: 'evaluation-observability', name: 'Evaluation & Observability', description: 'Monitoring, logging, and evaluation.', icon: BarChart2 },
  { id: 'security-compliance', name: 'Security & Compliance', description: 'Security controls and compliance.', icon: ShieldCheck },
  { id: 'agent-ecosystem', name: 'Agent Ecosystem', description: 'Interactions with other systems.', icon: Group },
];

export const INITIAL_THREATS: Threat[] = [
    {
        id: 'threat-1',
        name: 'Initial Example Threat',
        description: 'This is a sample threat to demonstrate the tool\'s functionality. It exists across all layers for initial view.',
        vulnerabilities: ['Lack of input validation'],
        attackVectors: ['Crafted malicious input'],
        risk: 'Medium',
        mitigations: ['Implement strict input sanitization and validation.'],
        tags: ['example', 'initial'],
        layer: 'All',
    },
];

export const DEFAULT_SYSTEM_DESCRIPTION = `An autonomous financial research agent designed to help investors.

Core Functionality:
- The agent ingests real-time financial news from various online sources (APIs, RSS feeds).
- It uses a fine-tuned Large Language Model (LLM) based on a public finance-specific model to analyze sentiment and summarize articles.
- The agent has access to a "tool" which is a Python function that connects to a vector database (Pinecone) containing historical stock performance data.
- Based on the news analysis and historical data, the agent can autonomously decide to execute trades via an external brokerage API (e.g., Alpaca).
- All actions, decisions, and data sources are logged for auditability.

Technical Stack:
- Agent Framework: LangChain
- Foundation Model: Fine-tuned Llama 3 hosted on a private VPC in GCP.
- Data Operations: Pinecone for vector search, PostgreSQL for storing user data and trade history.
- Deployment: The agent runs in a Docker container on Google Kubernetes Engine (GKE).
- External Integrations: Alpaca API for trading, various news APIs.`;
