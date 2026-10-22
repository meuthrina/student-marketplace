// ==========================================
// STUDANCE MOCK DATA (v0.1)
// Data Tiruan Sintetis & Realistis untuk Tugas 1 PAW
// ==========================================

import { User, Project, ServiceOffering, Bid, PortfolioItem } from '@/types';

/**
 * Mock Data Akun Pengguna Aktif (Default User)
 */
export const mockCurrentUser: User = {
  id: 'usr-001',
  name: 'Iman Dwi Satrio',
  email: '105224029@student.universitaspertamina.ac.id',
  activeRole: 'STUDENT',
  isVerifiedStudent: true,
  campusName: 'Universitas Pertamina',
  campusDomain: 'student.universitaspertamina.ac.id',
  studentId: '105224029',
  major: 'Ilmu Komputer',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  bio: 'Full-stack Web Developer & Interface Designer yang antusias membangun solusi digital dan teknologi AI terapan.',
  skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Oracle SQL', 'C++'],
};

/**
 * Mock Data Proyek Klien (FR-01, FR-02, FR-09)
 * Memuat sampel Public Projects & Campus-Specific Projects
 */
export const mockProjects: Project[] = [
  {
    id: 'prj-101',
    title: 'Website Registrasi Event Kampus',
    description: 'Bangun registrasi responsif dan dashboard panitia untuk acara mahasiswa.',
    category: 'Web Dev',
    budget: 1500000,
    deadline: '2026-10-24',
    scope: 'CAMPUS_SPECIFIC',
    targetCampus: 'Universitas Pertamina',
    clientId: 'cli-001',
    clientName: 'Ratih Arini',
    clientRole: 'Panitia Campus Week',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isClientVerifiedStudent: true,
    skillTags: ['React', 'Tailwind', 'Web Dev'],
    status: 'OPEN',
    createdAt: '2026-10-10',
  },
  {
    id: 'prj-102',
    title: 'Desain UI Aplikasi Komunitas',
    description: 'Rancang alur komunitas yang mudah dipahami, lengkap dengan handoff Figma.',
    category: 'UI/UX',
    budget: 850000,
    deadline: '2026-10-24',
    scope: 'PUBLIC',
    clientId: 'cli-002',
    clientName: 'Ratih Arini',
    clientRole: 'Panitia Campus Week',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isClientVerifiedStudent: false,
    skillTags: ['Figma', 'UI/UX'],
    status: 'OPEN',
    createdAt: '2026-10-11',
  },
  {
    id: 'prj-103',
    title: 'Visualisasi Data Kegiatan Kampus',
    description: 'Olah data partisipasi dan sajikan dashboard insight yang informatif.',
    category: 'Data',
    budget: 950000,
    deadline: '2026-10-24',
    scope: 'CAMPUS_SPECIFIC',
    targetCampus: 'Universitas Pertamina',
    clientId: 'cli-003',
    clientName: 'Ratih Arini',
    clientRole: 'Panitia Campus Week',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isClientVerifiedStudent: false,
    skillTags: ['Python', 'Data'],
    status: 'OPEN',
    createdAt: '2026-10-08',
  },
];

/**
 * Mock Data Penawaran Jasa Mandiri / Gigs Mahasiswa (FR-01, FR-03)
 */
export const mockServices: ServiceOffering[] = [
  {
    id: 'srv-201',
    title: 'Jasa Front-End Next.js & Tailwind',
    description: 'Web Dev · Layout responsif, komponen rapi, dan dokumentasi handoff.',
    category: 'Web Dev',
    price: 350000,
    durationDays: 3,
    studentId: 'usr-002',
    studentName: 'Nadia Putri',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    campusName: 'Universitas Pertamina',
    isVerifiedStudent: true,
    rating: 4.9,
    reviewCount: 12,
    sampleImages: ['/mock/service-preview-1.svg'],
    createdAt: '2026-10-01',
  },
  {
    id: 'srv-202',
    title: 'Jasa UI/UX Aplikasi Mobile',
    description: 'UI/UX · Alur, wireframe, dan desain siap dikembangkan.',
    category: 'UI/UX',
    price: 350000,
    durationDays: 4,
    studentId: 'usr-002',
    studentName: 'Nadia Putri',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    campusName: 'Universitas Pertamina',
    isVerifiedStudent: true,
    rating: 4.9,
    reviewCount: 12,
    sampleImages: ['/mock/service-preview-2.svg'],
    createdAt: '2026-10-03',
  },
  {
    id: 'srv-203',
    title: 'Jasa Dashboard Data Interaktif',
    description: 'Data · Dashboard ringkas untuk insight kegiatan kampus.',
    category: 'Data',
    price: 350000,
    durationDays: 5,
    studentId: 'usr-002',
    studentName: 'Nadia Putri',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    campusName: 'Universitas Pertamina',
    isVerifiedStudent: true,
    rating: 4.9,
    reviewCount: 12,
    sampleImages: ['/mock/service-preview-3.svg'],
    createdAt: '2026-10-05',
  },
];

/**
 * Mock Data Bids / Proposal Lamaran Proyek (FR-04)
 */
export const mockBids: Bid[] = [
  {
    id: 'bid-301',
    projectId: 'prj-101',
    studentId: 'usr-001',
    studentName: 'Iman Dwi Satrio',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isVerifiedStudent: true,
    campusName: 'Universitas Pertamina',
    bidAmount: 1400000,
    estimatedDays: 5,
    proposalMessage: 'Halo! Saya memiliki pengalaman membangun website ormawa dengan Next.js dan Tailwind CSS. Portofolio saya terverifikasi di platform ini.',
    attachmentUrl: '/portfolio/sample-proposal.pdf',
    status: 'PENDING',
    createdAt: '2026-10-11',
  },
];

/**
 * Mock Data Portofolio Terverifikasi Mahasiswa (FR-05, FR-07)
 */
export const mockPortfolios: PortfolioItem[] = [
  {
    id: 'prf-401',
    studentId: 'usr-001',
    title: 'Dashboard MATE-UP Mentoring System',
    description: 'Wireframe dan UI layout untuk platform pencocokan tim dan mentoring dosen.',
    category: 'UI/UX Design',
    fileUrl: '/portfolio/mateup-spec.pdf',
    fileSize: '3.2 MB',
    uploadDate: '2026-06-15',
    isVerifiedWork: true,
    projectRefTitle: 'MATE-UP Project',
  },
  {
    id: 'prf-402',
    studentId: 'usr-001',
    title: 'BioHub ESG Compliance Tracker Layout',
    description: 'Desain antarmuka pemantauan metrik keberlanjutan lingkungan dan laporan ESG.',
    category: 'Web Design',
    fileUrl: '/portfolio/biohub-ui.png',
    fileSize: '1.8 MB',
    uploadDate: '2026-07-20',
    isVerifiedWork: true,
  },
];