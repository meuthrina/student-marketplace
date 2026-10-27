import 'server-only';
import { cookies } from 'next/headers';

export type Sesi = {
  email: string;
  role?: string;
  kedaluwarsa: number;
};

const DELAPAN_JAM = 60 * 60 * 8; // 8 jam dalam detik

// Penyimpanan sementara di memori dengan globalThis agar selamat dari Fast Refresh
const g = globalThis as unknown as { sesiTiruan?: Map<string, Sesi> };
const penyimpanan = (g.sesiTiruan ??= new Map<string, Sesi>());

/**
 * Membuat sesi baru dan menyematkan cookie HttpOnly ke peramban
 */
export async function buatSesi(email: string, role: string = 'CLIENT'): Promise<void> {
  const id = crypto.randomUUID();
  penyimpanan.set(id, {
    email,
    role,
    kedaluwarsa: Date.now() + DELAPAN_JAM * 1000,
  });

  (await cookies()).set('sesi', id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DELAPAN_JAM,
  });
}

/**
 * Membaca data sesi dari cookie peramban
 */
export async function bacaSesi(): Promise<Sesi | null> {
  const cookieStore = await cookies();
  const id = cookieStore.get('sesi')?.value;
  const sesi = id ? penyimpanan.get(id) : undefined;

  if (!sesi || sesi.kedaluwarsa < Date.now()) {
    return null;
  }

  return sesi;
}

/**
 * Menghapus sesi dari penyimpanan memori dan menghapus cookie di peramban
 */
export async function hapusSesi(): Promise<void> {
  const cookieStore = await cookies();
  const id = cookieStore.get('sesi')?.value;
  if (id) {
    penyimpanan.delete(id);
  }
  cookieStore.delete('sesi');
}
