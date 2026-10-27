import { redirect } from 'next/navigation';

/**
 * Rute Kompatibilitas Praktikum Modul 5:
 * Mengarahkan pengunjung /masuk langsung ke rute autentikasi resmi /login.
 */
export default function HalamanMasukRedirect() {
  redirect('/login');
}
