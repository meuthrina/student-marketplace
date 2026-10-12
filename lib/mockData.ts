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
    title: 'Pengembangan Prototype Website Ormawa & BEM Fakultas',
    description: 'Dibutuhkan mahasiswa frontend yang handal untuk membuat landing page interaktif & responsif menggunakan Next.js dan Tailwind CSS untuk portal kegiatan Ormawa.',
    category: 'Web Development',
    budget: 1500000,
    deadline: '2026-10-30',
    scope: 'CAMPUS_SPECIFIC',
    targetCampus: 'Universitas Pertamina',
    clientId: 'cli-001',
    clientName: 'Panitia CITE UP 2026',
    clientAvatar: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150',
    isClientVerifiedStudent: true,
    skillTags: ['Next.js', 'Tailwind CSS', 'TypeScript'],
    status: 'OPEN',
    createdAt: '2026-10-10',
  },
  {
    id: 'prj-102',
    title: 'Design System & UI Wireframe Dashboard Budgeting RKA',
    description: 'Membutuhkan UI/UX Designer untuk merancang komponen glassmorphism & tata letak visual dashboard manajemen anggaran berbasis web.',
    category: 'UI/UX Design',
    budget: 2000000,
    deadline: '2026-11-05',
    scope: 'PUBLIC',
    clientId: 'cli-002',
    clientName: 'Dr. Ahmad Subagja (Lecturer)',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    isClientVerifiedStudent: false,
    skillTags: ['Figma', 'Design System', 'Wireframing'],
    status: 'OPEN',
    createdAt: '2026-10-11',
  },
  {
    id: 'prj-103',
    title: 'Audit Aksesibilitas WCAG 2.2 AA Portal Perpustakaan',
    description: 'Pengerjaan audit semantik HTML dan ARIA attributes untuk memastikan website lulus uji pengujian screen reader dan Lighthouse dengan skor minimal 85.',
    category: 'Cybersecurity & Web',
    budget: 1200000,
    deadline: '2026-10-25',
    scope: 'CAMPUS_SPECIFIC',
    targetCampus: 'Universitas Pertamina',
    clientId: 'cli-003',
    clientName: 'Unit Perpustakaan Kampus',
    clientAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
    isClientVerifiedStudent: false,
    skillTags: ['Accessibility', 'HTML5', 'Lighthouse'],
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
    title: 'Jasa Pembuatan UI/UX Prototype Interactive Figma',
    description: 'Saya menyediakan jasa perancangan wireframe, design system, dan prototipe Figma berstandar industri dengan estetika modern Liquid Glassmorphism.',
    category: 'UI/UX Design',
    price: 350000,
    durationDays: 3,
    studentId: 'usr-001',
    studentName: 'Iman Dwi Satrio',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    campusName: 'Universitas Pertamina',
    isVerifiedStudent: true,
    rating: 4.9,
    reviewCount: 14,
    sampleImages: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'],
    createdAt: '2026-10-01',
  },
  {
    id: 'srv-202',
    title: 'Jasa Remediasi Kepatuhan Aksesibilitas & Slicing Next.js',
    description: 'Slicing Figma ke Next.js App Router responsif dengan jaminan skor Lighthouse Accessibility minimal 85.',
    category: 'Web Development',
    price: 500000,
    durationDays: 4,
    studentId: 'usr-002',
    studentName: 'Siti Rahma',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    campusName: 'Universitas Pertamina',
    isVerifiedStudent: true,
    rating: 5.0,
    reviewCount: 8,
    sampleImages: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'],
    createdAt: '2026-10-03',
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