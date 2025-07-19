
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

// The middleware is initialized with the database-free authConfig.
// This ensures no Node.js modules are pulled into the Edge runtime.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - anything in the public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
