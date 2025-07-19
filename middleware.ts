
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { NextResponse, type NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;

  // Allow access to auth routes and API routes
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/genkit')) {
    return NextResponse.next();
  }

  // If user is not logged in, redirect to sign-in page
  if (!request.auth) {
    const signInUrl = new URL('/api/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user is logged in, allow the request
  return NextResponse.next();
});

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
