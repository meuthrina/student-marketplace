import "server-only";
import {
  buatSession,
  bacaSession,
  hapusSession,
  type SessionUser,
} from "./session";

/**
 * Adapter kompatibilitas modul sesi bahasa Indonesia (Pekan 4-5)
 * Mendukung fungsi legacy `buatSesi`, `bacaSesi`, dan `hapusSesi`
 * yang didukung penuh oleh modul kriptografi JWT di `lib/session.ts`.
 */

export type Sesi = {
  id?: string;
  nama?: string;
  email: string;
  role?: string;
  kedaluwarsa?: number;
};

export async function buatSesi(email: string, role: string = "CLIENT"): Promise<void> {
  const user: SessionUser = {
    id: `usr-${Date.now().toString(36)}`,
    nama: email.split("@")[0],
    email,
    role: (role as SessionUser["role"]) || "CLIENT",
  };
  await buatSession(user);
}

export async function bacaSesi(): Promise<Sesi | null> {
  const user = await bacaSession();
  if (!user) return null;
  return {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    kedaluwarsa: Date.now() + 60 * 60 * 8 * 1000,
  };
}

export async function hapusSesi(): Promise<void> {
  await hapusSession();
}

export { buatSession, bacaSession, hapusSession, type SessionUser };
