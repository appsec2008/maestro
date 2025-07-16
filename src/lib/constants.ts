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
        name: 'Cross-Layer Information Leakage',
        description: 'Sensitive data or system-level details from one layer are inadvertently exposed in the outputs or logs of another layer, potentially revealing vulnerabilities or confidential information.',
        vulnerabilities: ['Insufficient data sanitization between layers', 'Verbose logging'],
        attackVectors: ['Probing agent with specific inputs to trigger revealing error messages', 'Gaining access to system logs'],
        risk: 'High',
        mitigations: ['Implement strict data filtering and redaction at layer boundaries.', 'Configure logging levels to avoid exposing sensitive details in production.'],
        tags: ['data-leakage', 'system-wide'],
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
