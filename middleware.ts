import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'

const PROTECTED_PREFIXES = ['/dashboard', '/calendar']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) {
    const token = req.cookies.get('access_token')?.value
    if (!token) return NextResponse.redirect(new URL('/', req.url))
    const payload = verifyAccessToken(token)
    if (!payload) return NextResponse.redirect(new URL('/', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/calendar/:path*']
}
