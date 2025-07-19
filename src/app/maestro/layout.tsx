
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
import { Cog, LogOut } from 'lucide-react';
import { MAESTRO_LAYERS } from '@/lib/constants';
import { Logo } from '@/components/logo';
import { ModelSettingsDialog } from '@/components/maestro/model-settings-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import { SignInButton } from '@/components/auth/sign-in-button';

function UserNav() {
  const { data: session } = useSession();

  if (!session?.user) {
    return <SignInButton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image ?? ''} alt={session.user.name ?? ''} />
            <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function MaestroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const activeLayer = searchParams.get('layer') || MAESTRO_LAYERS[0].id;
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const { status } = useSession({ required: true });

  if (status === 'loading') {
     return (
        <div className="flex min-h-screen items-center justify-center">
            <Logo className="size-16 animate-pulse" />
        </div>
     );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Logo className="size-8" />
                <h1 className="font-headline text-2xl font-semibold text-primary">
                MaestroVision
                </h1>
            </div>
            <UserNav />
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
                  <SidebarMenuButton onClick={() => setIsSettingsOpen(true)} tooltip="Settings">
                      <Cog />
                      <span>Settings</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {children}
        <ModelSettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      </SidebarInset>
    </SidebarProvider>
  );
}
