/**
 * Peran Pengguna pada Sistem (Supporting RBAC & Context Switcher)
 */
export type Role = 'STUDENT' | 'CLIENT' | 'ADMIN';

/**
 * Cakupan Akses Proyek (Public vs Campus-Restricted)
 */
export type ProjectScope = 'PUBLIC' | 'CAMPUS_SPECIFIC';

/**
 * Status Siklus Hidup Proyek
 */
export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

/**
 * Status Proposal Penawaran (Bid)
 */
export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

/**
 * Interface Identitas Pengguna Utama
 */
export interface User {
  id: string;
  name: string;
  email: string;
  activeRole: Role;
  isVerifiedStudent: boolean;
  campusName?: string;
  campusDomain?: string; // misal: "student.universitaspertamina.ac.id"
  studentId?: string; 
  major?: string;    
  avatarUrl: string;
  bio?: string;
  skills: string[];
}

/**
 * Interface Proyek Klien (Dipublikasikan oleh Dosen/UMKM/Mahasiswa Klien)
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;        // Nilai nominal IDR
  deadline: string;      // Format ISO Date String
  scope: ProjectScope;
  targetCampus?: string; // Kampus sasaran jika CAMPUS_SPECIFIC
  clientId: string;
  clientName: string;
  clientAvatar: string;
  isClientVerifiedStudent?: boolean; // True jika Klien juga Mahasiswa Terverifikasi
  skillTags: string[];
  status: ProjectStatus;
  createdAt: string;
}

/**
 * Interface Penawaran Jasa Mandiri oleh Mahasiswa (Service Offering / Gig)
 */
export interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;         // Patokan harga awal (IDR)
  durationDays: number;  // Estimasi durasi pengerjaan
  studentId: string;
  studentName: string;
  studentAvatar: string;
  campusName: string;
  isVerifiedStudent: boolean;
  rating: number;        // Nilai rating (misal: 4.9)
  reviewCount: number;
  sampleImages: string[];
  createdAt: string;
}

/**
 * Interface Proposal Penawaran Mahasiswa (Project Bidding Payload)
 */
export interface Bid {
  id: string;
  projectId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  isVerifiedStudent: boolean;
  campusName: string;
  bidAmount: number;     // Nilai tawaran harga (IDR)
  estimatedDays: number;
  proposalMessage: string;
  attachmentUrl?: string;
  status: BidStatus;
  createdAt: string;
}

/**
 * Interface Item Portofolio Terverifikasi (Verified Experience)
 */
export interface PortfolioItem {
  id: string;
  studentId: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileSize: string;      // Ukuran berkas (misal: "2.4 MB")
  uploadDate: string;
  isVerifiedWork: boolean; // Bukti pengerjaan selesai di Studance
  projectRefTitle?: string;
}