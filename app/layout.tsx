import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { Google_Sans } from 'next/font/google';
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { RoleProvider } from '@/contexts/RoleContext';

const googleSans = Google_Sans({
  subsets: ['latin'],
  variable: '--font-main',
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: 'Studance — Marketplace Talenta & Jasa Mahasiswa Terverifikasi',
  description:
    'Platform marketplace berbasis kampus yang menghubungkan mahasiswa aktif dengan proyek profesional, industri, dan peluang kolaborasi terpercaya.',
  keywords: [
    'Studance',
    'Marketplace Mahasiswa',
    'Freelance Mahasiswa',
    'Universitas Pertamina',
    'Talenta Kampus',
    'Portofolio Terverifikasi',
  ],
  authors: [{ name: 'Iman Dwi Satrio' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4338ca',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * RootLayout Component (app/layout.tsx)
 *
 * Induk penataan (layout) utama untuk seluruh halaman Next.js App Router.
 * Menyediakan struktur HTML5 semantik, bar navigasi global (Desktop & Mobile),
 * area konten dinamis {children}, serta penutup halaman (Footer).
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" className={`scroll-smooth ${googleSans.variable}`} >
      <body className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)] antialiased selection:bg-[var(--color-primary)] selection:text-white">
        {/* Link Aksesibilitas Langsung ke Konten Utama (WCAG 2.2 AA) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[var(--color-primary)] text-white font-semibold rounded-[var(--radius-md)] shadow-lg"
        >
          Lompat ke konten utama
        </a>

        <RoleProvider>
          {/* 1. Navbar Navigation Bar (Floating Glassmorphism Header) */}
          <Navbar />

          {/* 2. Main Active Page Content Container */}
          <main id="main-content" className="flex-1 w-full focus:outline-none pb-20 sm:pb-0">
            {children}
          </main>

          {/* 3. Footer Section (Kepercayaan, Navigasi, & Hak Cipta) */}
          <Suspense fallback={null}>
            <Footer />
          </Suspense>

          {/* 4. Mobile Bottom Navigation Bar (Khusus Layar <= 640px) */}
          <MobileNav />
        </RoleProvider>
      </body>
    </html>
  );
}