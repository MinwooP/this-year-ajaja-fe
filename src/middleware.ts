import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkIsSeason } from './utils/checkIsSeason';

export function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const hasCookies = cookies.has('auth');

  if (request.nextUrl.pathname === '/') {
    if (hasCookies) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  } else if (request.nextUrl.pathname === '/home') {
    if (!hasCookies) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else if (
    request.nextUrl.pathname === '/create' ||
    request.nextUrl.pathname.startsWith('/edit')
  ) {
    if (!hasCookies) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!checkIsSeason()) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  } else if (request.nextUrl.pathname === '/my') {
    if (!hasCookies) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else if (request.nextUrl.pathname === '/login') {
    if (hasCookies) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  } else if (request.nextUrl.pathname.startsWith('/plans')) {
    if (!hasCookies) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else if (request.nextUrl.pathname.startsWith('/reminds')) {
    if (!hasCookies) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/home',
    '/create',
    '/edit/:path*',
    '/my',
    '/login',
    '/plans/:path*',
    '/reminds/:path*',
  ],
};
