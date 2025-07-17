'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getModels, saveModels, type ModelConfig } from '@/lib/models';
import { Trash2, PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const modelConfigSchema = z.object({
  id: z.string(),
  provider: z.enum(['google', 'openai', 'together', 'ollama']),
  modelId: z.string().min(1, 'Model ID is required.'),
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
  label: z.string().min(1, 'Label is required.'),
});

const formSchema = z.object({
  models: z.array(modelConfigSchema),
});

const PROVIDER_CONFIG = {
  google: { name: 'Google', requires: ['apiKey'], suggests: { modelId: 'gemini-2.0-flash' } },
  openai: { name: 'OpenAI', requires: ['apiKey'], suggests: { modelId: 'gpt-4o' } },
  together: { name: 'Together AI', requires: ['apiKey'], suggests: { modelId: 'meta-llama/Llama-3-8b-chat-hf' } },
  ollama: { name: 'Ollama (Local)', requires: ['baseURL', 'modelId'], suggests: { modelId: 'llama3', baseURL: 'http://localhost:11434' } },
};

interface ModelSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModelSettingsDialog({ open, onOpenChange }: ModelSettingsDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      models: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'models',
  });

  React.useEffect(() => {
    if (open) {
      const savedModels = getModels();
      form.reset({ models: savedModels });
    }
  }, [open, form]);
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    saveModels(data.models);
    toast({
      title: 'Settings Saved',
      description: 'Your model configurations have been updated.',
    });
    onOpenChange(false);
    window.location.reload();
  };

  const handleAddNewModel = () => {
    append({
        id: `model-${Date.now()}`,
        provider: 'google',
        modelId: PROVIDER_CONFIG.google.suggests.modelId,
        apiKey: '',
        baseURL: '',
        label: 'New Google Model'
    });
  }

  const handleProviderChange = (index: number, provider: keyof typeof PROVIDER_CONFIG) => {
      form.setValue(`models.${index}.provider`, provider);
      const suggestions = PROVIDER_CONFIG[provider].suggests;
      form.setValue(`models.${index}.modelId`, suggestions.modelId || '');
      form.setValue(`models.${index}.baseURL`, suggestions.baseURL || '');
      form.setValue(`models.${index}.label`, `New ${PROVIDER_CONFIG[provider].name} Model`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Model Settings</DialogTitle>
          <DialogDescription>
            Configure the AI models for the application. The system will use the active models in a round-robin fashion.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] p-1">
                <div className="space-y-6 pr-4">
                {fields.map((field, index) => {
                  const currentProvider = form.watch(`models.${index}.provider`);
                  const config = PROVIDER_CONFIG[currentProvider];
                  
                  return (
                  <div key={field.id} className="space-y-4 rounded-lg border p-4 relative">
                     <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                     </Button>

                    <FormField
                        control={form.control}
                        name={`models.${index}.label`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g., My Local Llama" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                      control={form.control}
                      name={`models.${index}.provider`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider</FormLabel>
                          <Select onValueChange={(value) => handleProviderChange(index, value as any)} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(PROVIDER_CONFIG).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {config.requires.includes('modelId') && (
                       <FormField
                          control={form.control}
                          name={`models.${index}.modelId`}
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Model ID / Name</FormLabel>
                                  <FormControl><Input {...field} placeholder={config.suggests.modelId} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                        />
                    )}
                    
                    {config.requires.includes('apiKey') && (
                       <FormField
                          control={form.control}
                          name={`models.${index}.apiKey`}
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>API Key</FormLabel>
                                  <FormControl><Input type="password" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                        />
                    )}
                     {config.requires.includes('baseURL') && (
                       <FormField
                          control={form.control}
                          name={`models.${index}.baseURL`}
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Base URL</FormLabel>
                                  <FormControl><Input {...field} placeholder={config.suggests.baseURL} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                        />
                    )}

                  </div>
                )})}

                <Button type="button" variant="outline" className="w-full" onClick={handleAddNewModel}>
                    <PlusCircle className="mr-2" />
                    Add New Model
                </Button>
                </div>
            </ScrollArea>
            <DialogFooter className="mt-6">
              <Button type="submit">Save and Reload</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
