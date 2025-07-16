'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { setGoogleApiKey, getGoogleApiKey } from '@/lib/api-key';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      setApiKey(getGoogleApiKey() || '');
    }
  }, [open]);

  const handleSave = () => {
    setGoogleApiKey(apiKey);
    toast({
      title: 'API Key Saved',
      description: 'Your Google AI API key has been saved locally.',
    });
    onOpenChange(false);
     // Reload the page to apply the new API key
    window.location.reload();
  };
  
  const handleClear = () => {
    setApiKey('');
    setGoogleApiKey('');
     toast({
      title: 'API Key Cleared',
      description: 'Your Google AI API key has been cleared.',
    });
    onOpenChange(false);
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key Settings</DialogTitle>
          <DialogDescription>
            Provide your Google AI API key. This will be stored securely in your
            browser&apos;s local storage and will not be shared. If no key is provided, the
            application will attempt to use a default key from the environment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
              placeholder="Enter your Google AI API key"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>Clear Key</Button>
          <Button onClick={handleSave}>Save and Reload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
