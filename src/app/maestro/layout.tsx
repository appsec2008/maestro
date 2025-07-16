'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Settings, Cog } from 'lucide-react';
import { MAESTRO_LAYERS } from '@/lib/constants';
import { Logo } from '@/components/logo';
import { ApiKeyDialog } from '@/components/maestro/api-key-dialog';

export default function MaestroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const activeLayer = searchParams.get('layer') || MAESTRO_LAYERS[0].id;
  const [isApiDialogOpen, setIsApiDialogOpen] = React.useState(false);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8" />
            <h1 className="font-headline text-2xl font-semibold text-primary">
              MaestroVision
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {MAESTRO_LAYERS.map(layer => {
              const Icon = layer.icon;
              return (
                <SidebarMenuItem key={layer.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeLayer === layer.id}
                    tooltip={layer.name}
                  >
                    <Link href={`/maestro?layer=${layer.id}`}>
                      <Icon />
                      <span>{layer.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
              <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setIsApiDialogOpen(true)} tooltip="Settings">
                      <Cog />
                      <span>Settings</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {children}
        <ApiKeyDialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen} />
      </SidebarInset>
    </SidebarProvider>
  );
}
