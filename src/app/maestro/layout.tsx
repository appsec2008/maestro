'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { MAESTRO_LAYERS } from '@/lib/constants';
import { Logo } from '@/components/logo';

export default function MaestroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const activeLayer = searchParams.get('layer') || MAESTRO_LAYERS[0].id;

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
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
