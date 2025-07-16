'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Threat, RiskLevel } from '@/lib/types';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface ThreatListCardProps {
  threats: Threat[];
  activeLayerName: string;
  onAddThreat: (threat: Omit<Threat, 'id'>) => void;
  onUpdateThreat: (threat: Threat) => void;
  onDeleteThreat: (id: string) => void;
}

const riskLevelColors: Record<RiskLevel, string> = {
  Low: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  High: 'bg-orange-100 text-orange-800 border-orange-200',
  Critical: 'bg-red-100 text-red-800 border-red-200',
};

const ThreatForm = ({ threat, onSave, activeLayerName }: { threat?: Threat | null, onSave: (data: any) => void, activeLayerName: string }) => {
  const [formData, setFormData] = React.useState({
    name: threat?.name || '',
    description: threat?.description || '',
    risk: threat?.risk || 'Medium',
    layer: threat?.layer || activeLayerName,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="risk" className="text-right">Risk</Label>
        <Select value={formData.risk} onValueChange={(value: RiskLevel) => setFormData({ ...formData, risk: value })}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select risk level" />
          </SelectTrigger>
          <SelectContent>
            {(['Low', 'Medium', 'High', 'Critical'] as RiskLevel[]).map(level => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  )
}

export function ThreatListCard({ threats, activeLayerName, onAddThreat, onUpdateThreat, onDeleteThreat }: ThreatListCardProps) {
  const [isAddEditDialogOpen, setAddEditDialogOpen] = React.useState(false);
  const [editingThreat, setEditingThreat] = React.useState<Threat | null>(null);

  const handleSave = (data: any) => {
    const threatData = {
        ...data,
        vulnerabilities: [], // Default values for new/simplified edit
        attackVectors: [],
        mitigations: [],
        tags: [],
    };

    if (editingThreat) {
      onUpdateThreat({ ...editingThreat, ...threatData });
    } else {
      onAddThreat(threatData);
    }
    setEditingThreat(null);
    setAddEditDialogOpen(false);
  };
  
  const openEditDialog = (threat: Threat) => {
    setEditingThreat(threat);
    setAddEditDialogOpen(true);
  }

  const openAddDialog = () => {
    setEditingThreat(null);
    setAddEditDialogOpen(true);
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Identified Threats</CardTitle>
        <CardDescription>Review and manage threats for the current layer.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Threat</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {threats.map((threat) => (
                <TableRow key={threat.id}>
                    <TableCell className="font-medium">{threat.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={riskLevelColors[threat.risk]}>{threat.risk}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(threat)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the threat "{threat.name}".
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onDeleteThreat(threat.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        {threats.length === 0 && (
            <div className="text-center text-muted-foreground p-8">No threats identified for this layer yet.</div>
        )}
      </CardContent>
      <CardFooter>
          <Dialog open={isAddEditDialogOpen} onOpenChange={setAddEditDialogOpen}>
              <DialogTrigger asChild>
                  <Button onClick={openAddDialog}>
                      <Plus className="mr-2 h-4 w-4" /> Add Threat Manually
                  </Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>{editingThreat ? 'Edit Threat' : 'Add New Threat'}</DialogTitle>
                      <DialogDescription>
                          {editingThreat ? 'Update the details of the existing threat.' : `Add a new threat to the ${activeLayerName} layer.`}
                      </DialogDescription>
                  </DialogHeader>
                  <ThreatForm threat={editingThreat} onSave={handleSave} activeLayerName={activeLayerName} />
              </DialogContent>
          </Dialog>
      </CardFooter>
    </Card>
  );
}
