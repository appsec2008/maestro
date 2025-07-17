import { config } from 'dotenv';
config({ path: '.env' });

import { auth } from '@/app/api/auth/[...nextauth]/auth';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Allow access to auth routes and API routes
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/genkit')) {
    return NextResponse.next();
  }

  // If user is not logged in, redirect to sign-in page, unless they are already there.
  if (!session) {
    // To prevent redirect loops for the sign-in page.
    // This is a simplified check. A more robust solution might be needed if you have multiple unauthenticated pages.
    if (pathname.startsWith('/api/auth/signin')) {
        return NextResponse.next();
    }
    const signInUrl = new URL('/api/auth/signin', request.url);
    if (request.url !== signInUrl.toString()) {
        signInUrl.searchParams.set('callbackUrl', request.url);
        return NextResponse.redirect(signInUrl);
    }
  }

  // If user is logged in, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - anything in the public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
