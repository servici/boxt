import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJWTPayload } from './lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('drama_token')?.value;
  const payload = token ? decodeJWTPayload(token) : null;

  // Protect Admin routes
  if (pathname.startsWith('/admin')) {
    if (!payload || payload.role !== 'ADMIN') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Profile route
  if (pathname.startsWith('/profile')) {
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
};
