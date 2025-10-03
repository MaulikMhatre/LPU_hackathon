

import { NextResponse, NextRequest } from 'next/server';

const SIGN_IN_PAGE = '/sections/signin';
const AUTH_PAGES = [SIGN_IN_PAGE, '/sections/register']; 
const AUTH_COOKIE_NAME = 'mock_auth_token';

// --- Authentication Check (Internal Helper) ---
function isAuthenticated(request: NextRequest): boolean {
    const sessionToken = request.cookies.get(AUTH_COOKIE_NAME);
    return !!sessionToken; 
}

// --- Main Middleware Function ---
export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isLoggedIn = isAuthenticated(request);
    
    const isAuthPage = AUTH_PAGES.includes(pathname);

    if (isLoggedIn) {
        if (isAuthPage) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    } else {
        if (!isAuthPage) {
            const signinUrl = new URL(SIGN_IN_PAGE, request.url);
            signinUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(signinUrl);
        }
    }

    return NextResponse.next();
}

// --- Matcher Configuration (The final crash fix) ---
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};