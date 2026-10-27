import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy Penjaga Optimistik (Next.js 16 File Convention)
 * Memeriksa keberadaan cookie "sesi" pada rute target sebelum request diteruskan ke render pipeline.
 * Menjaga batas kepercayaan T31 -> T32: Pengunjung tanpa cookie sesi langsung dialihkan ke /login.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has('sesi')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ['/client/projects/create'],
};
