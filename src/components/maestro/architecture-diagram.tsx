'use client';

import * as React from 'react';
import * as d3 from 'd3';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateArchitectureDiagram } from '@/ai/flows/generate-architecture-diagram';
import { Sparkles, Bot } from 'lucide-react';
import { useTheme } from 'next-themes';
import { selectModel } from '@/lib/models';

interface ArchitectureDiagramProps {
  systemDescription: string;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  label?: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const nodeColors: Record<string, string> = {
  user: 'hsl(var(--primary))',
  agent: 'hsl(var(--accent))',
  container: 'hsl(var(--secondary-foreground))',
  database: '#34d399', // emerald-400
  external: '#fb923c', // orange-400
  service: '#60a5fa',  // blue-400
};

export function ArchitectureDiagram({ systemDescription }: ArchitectureDiagramProps) {
  const [graphData, setGraphData] = React.useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!graphData || !svgRef.current) return;

    const width = svgRef.current.parentElement?.clientWidth || 800;
    const height = 500;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .style('max-width', '100%')
      .style('height', 'auto');
    
    svg.selectAll("*").remove(); // Clear previous render

    const links = graphData.links.map(d => ({ ...d }));
    const nodes = graphData.nodes.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(0, 0))
      .on('tick', ticked);

    const link = svg.append('g')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', resolvedTheme === 'dark' ? '#4b5563' : '#9ca3af') // gray-600 dark:gray-500
      .attr('stroke-width', 1.5);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(drag(simulation) as any);
      
    node.append('circle')
      .attr('r', 20)
      .attr('fill', d => nodeColors[d.type] || '#ccc')
      .attr('stroke', resolvedTheme === 'dark' ? '#f9fafb' : '#1f2937') // gray-50 dark:gray-800
      .attr('stroke-width', 2);
    
    node.append('text')
      .text(d => d.label)
      .attr('x', 0)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-family', 'Inter, sans-serif')
      .attr('fill', resolvedTheme === 'dark' ? '#e5e7eb' : '#374151'); // gray-200 dark:gray-700
      
    function ticked() {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    }

    function drag(simulation: d3.Simulation<Node, undefined>) {
      function dragstarted(event: d3.D3DragEvent<any, Node, any>, d: Node) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(event: d3.D3DragEvent<any, Node, any>, d: Node) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event: d3.D3DragEvent<any, Node, any>, d: Node) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
    
  }, [graphData, resolvedTheme]);

  const handleGenerateDiagram = async () => {
    const selectedModel = selectModel();
    if (!selectedModel) {
        toast({
            title: 'Model Not Configured',
            description: 'Please configure an active AI model in the settings panel.',
            variant: 'destructive',
        });
        return;
    }

    if (!systemDescription.trim()) {
      toast({
        title: 'System Description Required',
        description: 'Please describe your system to generate a diagram.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setGraphData(null);

    try {
      const result = await generateArchitectureDiagram({ systemDescription, model: selectedModel });
      if (result.nodes && result.links) {
        setGraphData(result);
        toast({
          title: 'Diagram Generated',
          description: 'Architecture diagram has been successfully generated.',
        });
      } else {
        throw new Error('Invalid response from AI.');
      }
    } catch (error) {
      console.error('Diagram generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate the architecture diagram. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-center mb-4">
          <Button onClick={handleGenerateDiagram} disabled={isLoading}>
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating Diagram...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Architecture Diagram
              </>
            )}
          </Button>
        </div>
        <div className="w-full min-h-[500px] p-0 border rounded-lg bg-card flex items-center justify-center relative">
          {isLoading && <Bot className="h-16 w-16 text-muted-foreground animate-pulse" />}
          {!isLoading && !graphData && (
             <div className="text-center text-muted-foreground">
                <Bot className="h-16 w-16 mx-auto mb-2" />
                <p>Click "Generate Architecture Diagram" to visualize your system.</p>
            </div>
          )}
          <svg ref={svgRef} className={!graphData ? 'hidden' : ''}></svg>
        </div>
      </CardContent>
    </Card>
  );
}
