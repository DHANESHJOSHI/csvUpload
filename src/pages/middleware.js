import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
  const token = request.cookies.get('authToken');
  
  // Environment validation
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in the environment variables.');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Check if user is accessing login or logout pages
  const isLoginPage = request.url.includes('/admin/login');
  const isLogoutPage = request.url.includes('/admin/logout');

  // If user is already logged in and accessing the login page, redirect to dashboard
  if (token && isLoginPage) {
    const referrer = request.headers.get('referer');
    if (referrer && (referrer.includes('/admin/scholarship') || referrer.includes('/admin/user') || referrer.includes('/admin/dashboard'))) {
      return NextResponse.redirect(new URL(referrer, request.url));
    }
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // If no token exists and user is not on login or logout pages, redirect to login
  if (!token && !isLoginPage && !isLogoutPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Handle logout: clear cookie and redirect to login
  if (isLogoutPage) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('authToken'); // Clear token
    return response;
  }

  // If a token exists, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded); // Optional: debug log
    return NextResponse.next(); // Proceed to the requested route
  } catch (err) {
    console.error('Invalid or expired token:', err.message);
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'], // Apply middleware to all /admin routes
};
