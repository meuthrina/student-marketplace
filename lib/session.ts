import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * MODUL PENGELOLAAN SESI & COOKIE KEAMANAN TINGGI (PEKAN 5 PAW)
 * 
 * Mengimplementasikan pola Session Tanpa Status (Stateless Signed Cookie / JWT)
 * menggunakan kriptografi algoritma HS256 dengan secret key terlindungi.
 * Penanda 'server-only' mencegah modul bocor atau terimpor ke Client Component.
 */

export interface SessionUser {
  id: string;
  nama: string;
  email: string;
  role: "STUDENT" | "CLIENT" | "ADMIN";
  campusName?: string;
  isVerifiedStudent?: boolean;
}

const COOKIE_NAME = "sesi";
const DELAPAN_JAM = 60 * 60 * 8; // 8 jam masa aktif (dalam detik)

/**
 * Mengambil kunci rahasia HMAC-SHA256 dari variabel lingkungan
 */
function dapatkanKunciRahasia(): Uint8Array {
  const rahasia =
    process.env.SESSION_SECRET ||
    "studance-default-jwt-secret-key-32-chars-minimum-paw-crypto-2026";
  return new TextEncoder().encode(rahasia);
}

/**
 * Membuat token JWT sesi bertanda tangan dan menyimpannya ke cookie HttpOnly yang aman
 * 
 * Atribut Keamanan Cookie:
 * - httpOnly: Mencegah eksfiltrasi token melalui serangan XSS / JavaScript client-side
 * - secure: Memastikan cookie hanya ditransmisikan melalui kanal HTTPS terenkripsi di lingkungan produksi
 * - sameSite: "lax" Memberikan proteksi standar terhadap serangan Cross-Site Request Forgery (CSRF)
 * - path: "/" Berlaku untuk seluruh rute aplikasi
 * - maxAge: 8 jam (28800 detik) sesuai kebijakan sesi aman
 */
export async function buatSession(user: SessionUser): Promise<void> {
  const kunci = dapatkanKunciRahasia();

  const token = await new SignJWT({
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    campusName: user.campusName,
    isVerifiedStudent: user.isVerifiedStudent,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(kunci);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DELAPAN_JAM,
  });
}

/**
 * Membaca cookie sesi, memverifikasi tanda tangan digital HS256,
 * serta memastikan integritas dan masa berlaku payload.
 * 
 * @returns Objek SessionUser jika valid, atau null bila cookie tidak ada atau token rusak / kadaluwarsa
 */
export async function bacaSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const kunci = dapatkanKunciRahasia();
    const { payload } = await jwtVerify(token, kunci);

    if (!payload.id || !payload.email || !payload.role) {
      return null;
    }

    const validRoles: Array<SessionUser["role"]> = ["STUDENT", "CLIENT", "ADMIN"];
    const role = validRoles.includes(payload.role as SessionUser["role"])
      ? (payload.role as SessionUser["role"])
      : "STUDENT";

    return {
      id: String(payload.id),
      nama: String(payload.nama || payload.name || payload.email),
      email: String(payload.email),
      role,
      campusName: payload.campusName ? String(payload.campusName) : undefined,
      isVerifiedStudent:
        typeof payload.isVerifiedStudent === "boolean"
          ? payload.isVerifiedStudent
          : undefined,
    };
  } catch {
    // Verifikasi gagal (token rusak, dimanipulasi, atau kedaluwarsa)
    return null;
  }
}

/**
 * Mencabut sesi aktif dengan menghapus cookie sesi di peramban
 */
export async function hapusSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

