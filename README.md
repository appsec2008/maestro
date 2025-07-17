# MaestroVision

## What is this project?

MaestroVision is an advanced, web-based tool designed for comprehensive threat modeling of AI agent systems. It leverages the **MAESTRO framework**—a seven-layer model for analyzing risks in agentic AI—and integrates Large Language Models (LLMs) to automate and enhance the identification of potential security threats, vulnerabilities, and attack vectors.

## Why does this project exist?

Traditional security paradigms fall short when applied to the dynamic and non-deterministic nature of modern AI agents. Risks like emergent behavior, unintended tool use, and data poisoning require a specialized approach. MaestroVision was created to solve this problem by providing a structured, interactive platform for security analysis.

**Who benefits from MaestroVision?**
*   **AI/ML Engineers**: To build more secure and resilient agentic systems from the ground up.
*   **Security Analysts & Red Teams**: To systematically probe and identify novel attack surfaces in AI deployments.
*   **Compliance & Governance Teams**: To audit and document AI systems against a structured security framework.

## Technical Details

### Technology Stack

*   **Frontend**: Next.js, React, TypeScript
*   **Styling**: Tailwind CSS, ShadCN UI
*   **AI Integration**: Google Genkit
*   **Visualization**: D3.js
*   **State Management**: React Hooks & Context

### Key Features

*   **MAESTRO Layer Navigation**: Analyze your system across all seven layers of the MAESTRO framework.
*   **LLM-Powered Threat Generation**: Use configurable LLMs (Google Gemini, OpenAI, Anthropic, Ollama, etc.) to automatically identify threats based on your system description.
*   **Interactive Visualizations**: Understand the threat landscape with a Layered Diagram, Risk Matrix, and a D3.js-powered Architecture Diagram.
*   **Customizable Threat Library**: Manually add, edit, and manage threats tailored to your specific system.
*   **Multi-Model Support**: Easily switch between different local and cloud-based LLMs via a simple settings panel.

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 20.x or later recommended)
*   npm or a compatible package manager

### Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd MaestroVision
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project. You can add your Google API key here if you plan to use it as the default model.
    ```env
    # Example for Google AI
    NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
    ```
    Other models (OpenAI, Anthropic, Ollama, etc.) can be configured directly in the application's UI via the Settings panel.

4.  **Run the development server:**
    The application runs on two parallel processes: the Next.js frontend and the Genkit AI backend.

    *   **Terminal 1: Start the Genkit server:**
        ```bash
        npm run genkit:watch
        ```

    *   **Terminal 2: Start the Next.js development server:**
        ```bash
        npm run dev
        ```

5.  Open [http://localhost:9002](http://localhost:9002) in your browser to view the application.

### Architecture Diagram

The following diagram illustrates the high-level architecture of the MaestroVision application and its interaction with various AI models.

```mermaid
graph TD
    subgraph User Browser
        A[User] -->|Interacts with| B(Next.js Frontend);
    end

    subgraph "MaestroVision Backend (Server Components & API Routes)"
        B -->|Invokes| C{Genkit Flows};
    end

    C -->|Selects Model (Round-Robin)| D[Model Selection Logic];

    subgraph "Configured AI Models"
        D --> E[Google Gemini];
        D --> F[OpenAI GPT];
        D --> G[Anthropic Claude];
        D --> H[Ollama (Local)];
        D --> I[... and others];
    end

    subgraph "Local Storage"
        J[Model Configs & API Keys] <-.->|Load/Save| B;
    end

    style A fill:#4B0082,stroke:#fff,color:#fff
    style B fill:#F0F8FF,stroke:#4B0082
    style C fill:#8F00FF,stroke:#fff,color:#fff
    style J fill:#fef9c3,stroke:#f59e0b
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact

For questions, issues, or contributions, please open an issue on the GitHub repository.
