import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Memulai seeding data sintetis Studance...");

  // 1. Bersihkan data lama dengan urutan aman (Bid terlebih dahulu karena batasan onDelete: Restrict)
  console.log("🧹 Membersihkan tabel Bid...");
  await prisma.bid.deleteMany();

  console.log("🧹 Membersihkan tabel Project...");
  await prisma.project.deleteMany();

  // 2. Data Proyek Sintetis (Minimal 5 entitas dengan variasi kategori & status)
  const proyekData = [
    {
      title: "Pengembangan Sistem Informasi Inventaris Lab Kampus",
      category: "Web Development",
      description: "Membangun sistem informasi inventaris laboratorium berbasis Next.js App Router dan PostgreSQL dengan otentikasi role-based untuk teknisi lab.",
      budget: 3500000,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 hari ke depan
      isCampusOnly: true,
      campusName: "Universitas Pertamina",
      skills: "Next.js, TypeScript, PostgreSQL, Tailwind CSS",
      status: "OPEN",
    },
    {
      title: "Redesain UI/UX Dashboard Monitoring Energi Terbarukan",
      category: "UI/UX Design",
      description: "Membuat rancangan wireframe, prototype interaktif Figma, dan design system berstandar WCAG 2.2 AA untuk portal pemantauan panel surya.",
      budget: 2500000,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 hari ke depan
      isCampusOnly: false,
      campusName: null,
      skills: "Figma, Prototyping, Design System, WCAG",
      status: "OPEN",
    },
    {
      title: "Analisis Sentimen Ulasan Aplikasi Mobile Berbasis NLP",
      category: "Data & AI",
      description: "Pembangunan model klasifikasi ulasan pelanggan Play Store menggunakan teknik Natural Language Processing dan visualisasi analitik interaktif.",
      budget: 4000000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari ke depan
      isCampusOnly: true,
      campusName: "Universitas Pertamina",
      skills: "Python, Scikit-Learn, Pandas, Streamlit",
      status: "OPEN",
    },
    {
      title: "Aplikasi Presensi Mahasiswa Berbasis Geolocation Flutter",
      category: "Mobile Apps",
      description: "Pembuatan aplikasi mobile presensi kehadiran berbasis radius koordinat GPS terintegrasi REST API backend.",
      budget: 5000000,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 hari ke depan
      isCampusOnly: false,
      campusName: null,
      skills: "Flutter, Dart, Geolocation, RESTful API",
      status: "IN_PROGRESS",
    },
    {
      title: "Portal Landing Page Komunitas Pengembang Kampus",
      category: "Web Development",
      description: "Pengembangan landing page interaktif dengan tema dark mode, integrasi kalender acara, dan form registrasi anggota komunitas.",
      budget: 1500000,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 hari ke depan
      isCampusOnly: true,
      campusName: "Institut Teknologi Bandung",
      skills: "HTML5, Tailwind CSS, TypeScript",
      status: "OPEN",
    },
    {
      title: "Desain Antarmuka Aplikasi Manajemen Keuangan Mahasiswa",
      category: "UI/UX Design",
      description: "Perancangan UI kit mobile modern untuk pencatatan pengeluaran harian dan budgeting bulanan mahasiswa kos.",
      budget: 2000000,
      deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 hari ke depan
      isCampusOnly: false,
      campusName: null,
      skills: "Figma, Wireframing, Usability Testing",
      status: "IN_PROGRESS",
    },
  ];

  console.log("🚀 Memasukkan entitas Project ke database...");
  const createdProjects = [];
  for (const item of proyekData) {
    const proj = await prisma.project.create({
      data: item,
    });
    createdProjects.push(proj);
  }

  // 3. Data Penawaran (Bid) Sintetis Berelasi (Minimal 6 entitas)
  const penawaranData = [
    {
      projectId: createdProjects[0].id,
      studentId: "mhs-up-001",
      studentName: "Ahmad Fauzi",
      studentEmail: "ahmad.fauzi@student.universitaspertamina.ac.id",
      campusName: "Universitas Pertamina",
      bidAmount: 3200000,
      durationDays: 12,
      message: "Saya mahasiswa tingkat akhir Ilmu Komputer yang telah mengerjakan 3 proyek web dengan arsitektur App Router dan relasi PostgreSQL.",
      portfolioUrl: "https://portfolio.synthetics.dev/ahmad-fauzi",
      status: "PENDING",
    },
    {
      projectId: createdProjects[0].id,
      studentId: "mhs-up-002",
      studentName: "Siti Nurhaliza",
      studentEmail: "siti.nurhaliza@student.universitaspertamina.ac.id",
      campusName: "Universitas Pertamina",
      bidAmount: 3400000,
      durationDays: 10,
      message: "Memiliki pengalaman sebagai asisten lab sistem informasi, memahami alur inventaris kampus dengan baik.",
      portfolioUrl: "https://portfolio.synthetics.dev/siti-nurhaliza",
      status: "PENDING",
    },
    {
      projectId: createdProjects[1].id,
      studentId: "mhs-ui-003",
      studentName: "Budi Pratama",
      studentEmail: "budi.pratama@ui.ac.id",
      campusName: "Universitas Indonesia",
      bidAmount: 2300000,
      durationDays: 15,
      message: "Portofolio Figma saya mencakup perancangan design system komponen dashboard analitik yang memenuhi rasio kontras WCAG 2.2 AA.",
      portfolioUrl: "https://dribbble.com/synthetics/budi-pratama",
      status: "PENDING",
    },
    {
      projectId: createdProjects[2].id,
      studentId: "mhs-up-004",
      studentName: "Dewi Anggraini",
      studentEmail: "dewi.anggraini@student.universitaspertamina.ac.id",
      campusName: "Universitas Pertamina",
      bidAmount: 3800000,
      durationDays: 20,
      message: "Telah menyelesaikan penelitian klasifikasi teks bahasa Indonesia dengan model Transformer dan Scikit-Learn.",
      portfolioUrl: "https://github.com/synthetics/dewi-nlp-research",
      status: "PENDING",
    },
    {
      projectId: createdProjects[3].id,
      studentId: "mhs-itb-005",
      studentName: "Farhan Mahendra",
      studentEmail: "farhan.m@itb.ac.id",
      campusName: "Institut Teknologi Bandung",
      bidAmount: 4800000,
      durationDays: 30,
      message: "Fokus pada pengembangan aplikasi Flutter multiplatform dengan integrasi REST API dan pemetaan geofencing akurat.",
      portfolioUrl: "https://github.com/synthetics/farhan-flutter-apps",
      status: "ACCEPTED",
    },
    {
      projectId: createdProjects[5].id,
      studentId: "mhs-ugm-006",
      studentName: "Nadia Saraswati",
      studentEmail: "nadia.saraswati@ugm.ac.id",
      campusName: "Universitas Gadjah Mada",
      bidAmount: 1950000,
      durationDays: 14,
      message: "Spesialis desain visual UI/UX aplikasi finansial dengan penekanan pada micro-interaction dan kemudahan navigasi pengguna.",
      portfolioUrl: "https://behance.net/synthetics/nadiasaraswati",
      status: "ACCEPTED",
    },
  ];

  console.log("🚀 Memasukkan entitas Bid ke database...");
  for (const bid of penawaranData) {
    await prisma.bid.create({
      data: bid,
    });
  }

  // 4. Sinkronisasi kalkulasi bidsCount pada masing-masing entitas Project
  console.log("🔄 Melakukan sinkronisasi bidsCount pada entitas Project...");
  for (const proj of createdProjects) {
    const count = await prisma.bid.count({
      where: { projectId: proj.id },
    });

    await prisma.project.update({
      where: { id: proj.id },
      data: { bidsCount: count },
    });
  }

  const finalProjectCount = await prisma.project.count();
  const finalBidCount = await prisma.bid.count();

  console.log("✅ Seeding selesai dengan sukses!");
  console.log(`📊 Total Project sintetis tersimpan: ${finalProjectCount}`);
  console.log(`📊 Total Bid sintetis tersimpan: ${finalBidCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Galat saat eksekusi seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

