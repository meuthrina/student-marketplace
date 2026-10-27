import { User, Project } from '@/types';
import { mockProjects, mockCurrentUser } from './mockData';
import type { MasukanProyek, RegisterInput } from './skema';

// Menyimpan data tiruan proyek pada globalThis agar persisten saat Fast Refresh
const g = globalThis as unknown as { daftarProyek?: Project[]; daftarPengguna?: User[] };
export const daftarProyek: Project[] = (g.daftarProyek ??= [...mockProjects]);
export const daftarPengguna: User[] = (g.daftarPengguna ??= [
  mockCurrentUser,
  {
    id: 'usr-demo-student',
    name: 'Nadia Putri',
    email: 'nadia.putri@student.universitaspertamina.ac.id',
    activeRole: 'STUDENT',
    isVerifiedStudent: true,
    campusName: 'Universitas Pertamina',
    campusDomain: 'student.universitaspertamina.ac.id',
    studentId: '105224099',
    major: 'Ilmu Komputer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    skills: ['UI/UX', 'Figma', 'React'],
  },
  {
    id: 'usr-demo-client',
    name: 'Panitia Klien Demo',
    email: 'klien@pertamina.ac.id',
    activeRole: 'CLIENT',
    isVerifiedStudent: true,
    campusName: 'Universitas Pertamina',
    campusDomain: 'student.universitaspertamina.ac.id',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    skills: ['Project Management'],
  },
]);

/**
 * Validasi Semantik: Memeriksa apakah judul proyek sudah pernah diterbitkan
 */
export function judulProyekSudahAda(judul: string, clientEmail?: string): boolean {
  void clientEmail;
  const judulNormal = judul.trim().toLowerCase();
  return mockProjects.some(
    (p) => p.title.trim().toLowerCase() === judulNormal
  );
}

/**
 * Mutasi Data: Menambahkan proyek baru ke lapisan data tiruan
 */
export function tambahProyek(masukan: MasukanProyek, clientEmail: string): Project {
  const idBaru = `prj-${Date.now().toString().slice(-4)}`;
  const skillsArray = masukan.keahlian
    ? masukan.keahlian.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const proyekBaru: Project = {
    id: idBaru,
    title: masukan.judul,
    category: masukan.kategori,
    budget: masukan.anggaran,
    deadline: masukan.tenggatWaktu,
    description: masukan.deskripsi,
    isCampusOnly: masukan.eksklusifKampus,
    skills: skillsArray,
    scope: masukan.eksklusifKampus ? 'CAMPUS_SPECIFIC' : 'PUBLIC',
    skillTags: skillsArray.length > 0 ? skillsArray : [masukan.kategori],
    status: 'OPEN',
    clientId: 'cli-001',
    clientName: clientEmail || 'Panitia Kampus',
    clientAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    clientRole: 'Verified Client',
    targetCampus: masukan.eksklusifKampus ? 'Universitas Pertamina' : undefined,
    createdAt: new Date().toISOString(),
    bidsCount: 0,
  };

  mockProjects.unshift(proyekBaru);
  if (!daftarProyek.some((p) => p.id === idBaru)) {
    daftarProyek.unshift(proyekBaru);
  }

  return proyekBaru;
}

/**
 * Menemukan data proyek berdasarkan ID
 */
export function cariProyek(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id) || daftarProyek.find((p) => p.id === id);
}

/**
 * Validasi Semantik Pengguna: Memeriksa apakah email sudah terdaftar
 */
export function emailPenggunaSudahAda(email: string): boolean {
  const normal = email.trim().toLowerCase();
  return daftarPengguna.some((u) => u.email.trim().toLowerCase() === normal);
}

/**
 * Mutasi Data: Menambahkan pengguna baru ke penyimpanan data tiruan
 */
export function tambahPengguna(masukan: RegisterInput): User {
  const isKampus = masukan.email.toLowerCase().endsWith('.ac.id');
  const userBaru: User = {
    id: `usr-${Date.now().toString().slice(-4)}`,
    name: masukan.fullName.trim(),
    email: masukan.email.trim().toLowerCase(),
    activeRole: isKampus ? 'STUDENT' : 'CLIENT',
    isVerifiedStudent: isKampus,
    campusName: isKampus ? 'Universitas Pertamina' : undefined,
    campusDomain: isKampus ? 'student.universitaspertamina.ac.id' : undefined,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    skills: [],
  };
  daftarPengguna.unshift(userBaru);
  return userBaru;
}

/**
 * Menemukan data pengguna berdasarkan email
 */
export function cariPengguna(email: string) {
  const emailNorm = email.trim().toLowerCase();
  return daftarPengguna.find((u) => u.email.trim().toLowerCase() === emailNorm);
}

