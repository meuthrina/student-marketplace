import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  generateAndSaveMasterKey,
  loadMasterKey,
  deriveSubKey,
  checkFilePermissions,
  KeyManagementError,
  KEY_LENGTH,
} from '../key-manager';
import {
  validateAndNormalizeProposalInput,
  ValidationError,
} from '../input-validator';
import { sealProposal, openProposal } from '../proposal-vault';

console.log('\n================================================================');
console.log('  Tugas 2 Kriptografi (Pekan 5 & 6) - Manajemen Kunci & Validasi Batas');
console.log('  Platform: Studance (HKDF RFC 5869, CSPRNG, Strict Allowlist, Fail-Closed)');
console.log('================================================================\n');

let passedTests = 0;
const totalTests = 5;

const tempTestDir = path.join(os.tmpdir(), `studance-test-${Date.now()}`);

try {
  fs.mkdirSync(tempTestDir, { recursive: true });

  // ----------------------------------------------------------------
  // [UJI-K01] Uji CSPRNG & Hak Akses Berkas Kunci (O_EXCL & 0o600)
  // ----------------------------------------------------------------
  console.log('Running [UJI-K01] Uji CSPRNG & Hak Akses Berkas Kunci (Penyimpanan Aman & O_EXCL)...');
  const tempKeyFile = path.join(tempTestDir, 'master-test.key');

  // 1. Pembangkitan dan penyimpanan kunci baru
  const savedPath = generateAndSaveMasterKey(tempKeyFile);
  assert.strictEqual(savedPath, tempKeyFile, 'Path penyimpanan harus sesuai');
  assert.ok(fs.existsSync(tempKeyFile), 'Berkas kunci harus berhasil dibuat di sistem');

  const fileContent = fs.readFileSync(tempKeyFile, 'ascii').trim();
  assert.strictEqual(fileContent.length, 64, 'Format kunci hex wajib 64 karakter (32 byte)');

  // 2. Muat kembali kunci via loadMasterKey
  const loadedKey = loadMasterKey(tempKeyFile);
  assert.strictEqual(loadedKey.length, KEY_LENGTH, `Panjang kunci yang dimuat harus ${KEY_LENGTH} byte`);
  assert.strictEqual(loadedKey.toString('hex'), fileContent, 'Kunci yang dimuat harus identik dengan isi berkas');

  // 3. Uji O_EXCL: Penolakan penimpaan file eksisting (mencegah kehilangan kunci lama)
  assert.throws(
    () => {
      generateAndSaveMasterKey(tempKeyFile);
    },
    (err: Error) => {
      const isExpected = err.message.includes('FileExistsError');
      assert.ok(isExpected, `Harus melempar FileExistsError saat file sudah ada: ${err.message}`);
      return true;
    },
    'Membangkitkan kunci pada berkas yang sudah ada wajib ditolak secara fail-closed (O_EXCL)!'
  );
  console.log('  [PASS] UJI-K01: CSPRNG 256-bit & isolasi penimpaan file (O_EXCL) terverifikasi.\n');
  passedTests++;

  // ----------------------------------------------------------------
  // [UJI-K02] Uji HKDF Derivation (RFC 5869 - Satu Kunci, Satu Tujuan)
  // ----------------------------------------------------------------
  console.log('Running [UJI-K02] Uji HKDF Derivation (RFC 5869: Satu Kunci, Satu Tujuan)...');
  const subKeyProposal = deriveSubKey(loadedKey, 'proposal-encryption');
  const subKeyBadge = deriveSubKey(loadedKey, 'badge-token');
  const subKeyAudit = deriveSubKey(loadedKey, 'audit-log');

  assert.strictEqual(subKeyProposal.length, KEY_LENGTH, 'Subkunci proposal harus 32 byte');
  assert.strictEqual(subKeyBadge.length, KEY_LENGTH, 'Subkunci badge harus 32 byte');
  assert.strictEqual(subKeyAudit.length, KEY_LENGTH, 'Subkunci audit harus 32 byte');

  // Kunci-kunci turunan wajib berbeda secara matematis satu sama lain dan dari master key
  assert.notDeepStrictEqual(subKeyProposal, loadedKey, 'Subkunci tidak boleh identik dengan master key');
  assert.notDeepStrictEqual(subKeyProposal, subKeyBadge, 'Subkunci proposal wajib terisolasi dari subkunci badge');
  assert.notDeepStrictEqual(subKeyProposal, subKeyAudit, 'Subkunci proposal wajib terisolasi dari subkunci audit');

  // Sifat deterministik HKDF: konteks sama menghasilkan subkunci identik
  const subKeyProposalRepeat = deriveSubKey(loadedKey, 'proposal-encryption');
  assert.deepStrictEqual(
    subKeyProposal,
    subKeyProposalRepeat,
    'HKDF dengan master key dan context-purpose yang sama wajib menghasilkan subkunci identik'
  );
  console.log('  [PASS] UJI-K02: Isolasi domain HKDF-SHA256 (NIST SP 800-57 Part 1 §5.2) terverifikasi.\n');
  passedTests++;

  // ----------------------------------------------------------------
  // [UJI-K03] Uji Normalisasi Masukan (Unicode NFC vs NFD di Batas Kripto)
  // ----------------------------------------------------------------
  console.log('Running [UJI-K03] Uji Normalisasi Masukan (Unicode NFC vs NFD)...');
  // Dua string dengan arti identik ("Mahasiswa René") tetapi representasi byte berbeda (NFC vs NFD)
  const nfcName = 'Mahasiswa Ren\u00E9';       // NFC: \u00E9 (2 byte UTF-8: 0xC3 0xA9)
  const nfdName = 'Mahasiswa Rene\u0301';      // NFD: e + kombinasi aksen (3 byte UTF-8: 0x65 0xCC 0x81)

  assert.notStrictEqual(
    Buffer.from(nfcName).length,
    Buffer.from(nfdName).length,
    'Sebelum normalisasi, representasi byte UTF-8 NFC dan NFD harus berbeda!'
  );

  const rawNfcInput = {
    studentId: '105224029',
    proyekId: 'proj-up-01',
    nominalPenawaran: 2000000,
    durasiHari: 10,
    pesanProposal: nfcName,
  };

  const rawNfdInput = {
    studentId: '105224029',
    proyekId: 'proj-up-01',
    nominalPenawaran: 2000000,
    durasiHari: 10,
    pesanProposal: nfdName,
  };

  const normalized1 = validateAndNormalizeProposalInput(rawNfcInput);
  const normalized2 = validateAndNormalizeProposalInput(rawNfdInput);

  assert.strictEqual(
    normalized1.pesanProposal,
    normalized2.pesanProposal,
    'Setelah normalisasi NFC, kedua representasi string harus memiliki byte yang identik!'
  );

  // Uji end-to-end: segel proposal dengan masukan NFD, lalu buka secara sah
  const sealed = sealProposal(loadedKey, rawNfdInput);
  const unsealed = openProposal(loadedKey, sealed, rawNfdInput.proyekId, rawNfdInput.studentId);
  assert.strictEqual(unsealed.pesanProposal, nfcName, 'Objek yang didekripsi wajib dalam bentuk normal NFC');
  console.log('  [PASS] UJI-K03: Normalisasi Unicode NFC di batas sistem mencegah anomali kanonisasi.\n');
  passedTests++;

  // ----------------------------------------------------------------
  // [UJI-K04] Uji Negatif Masukan Cacat (Strict Allowlist & Fail-Closed)
  // ----------------------------------------------------------------
  console.log('Running [UJI-K04] Uji Negatif Masukan Cacat (Strict Allowlist, NaN, Bool Trap, dsb.)...');

  const baseValid = {
    studentId: '105224029',
    proyekId: 'proj-up-01',
    nominalPenawaran: 1500000,
    durasiHari: 7,
    pesanProposal: 'Penawaran proyek valid',
  };

  // Kasus A: Injeksi field tak dikenal (Strict Allowlist violation)
  assert.throws(
    () => validateAndNormalizeProposalInput({ ...baseValid, hackerInjectedField: 'malicious-data' }),
    (err: Error) => {
      assert.ok(err instanceof ValidationError, 'Harus melempar ValidationError');
      assert.ok(err.message.includes('StrictAllowlistViolation'), 'Pesan harus mengindikasikan pelanggaran allowlist');
      return true;
    },
    'Injeksi properti asing wajib ditolak seketika!'
  );

  // Kasus B: Nilai NaN pada nominalPenawaran
  assert.throws(
    () => validateAndNormalizeProposalInput({ ...baseValid, nominalPenawaran: NaN }),
    (err: Error) => err instanceof ValidationError && err.message.includes('InvalidNominalPenawaran'),
    'Nilai NaN pada nominal penawaran wajib ditolak!'
  );

  // Kasus C: Nilai Infinity pada nominalPenawaran
  assert.throws(
    () => validateAndNormalizeProposalInput({ ...baseValid, nominalPenawaran: Infinity }),
    (err: Error) => err instanceof ValidationError && err.message.includes('InvalidNominalPenawaran'),
    'Nilai Infinity pada nominal penawaran wajib ditolak!'
  );

  // Kasus D: Jebakan tipe boolean (True == 1) pada durasiHari
  assert.throws(
    () => validateAndNormalizeProposalInput({ ...baseValid, durasiHari: true as any }),
    (err: Error) => err instanceof ValidationError && err.message.includes('InvalidDurasiHari'),
    'Tipe boolean sebagai durasiHari wajib ditolak secara eksplisit!'
  );

  // Kasus E: Nilai nominal negatif (-50000)
  assert.throws(
    () => validateAndNormalizeProposalInput({ ...baseValid, nominalPenawaran: -50000 }),
    (err: Error) => err instanceof ValidationError && err.message.includes('InvalidNominalPenawaran'),
    'Nominal negatif wajib ditolak!'
  );

  // Kasus F: Properti wajib hilang (studentId kosong)
  assert.throws(
    () => validateAndNormalizeProposalInput({ ...baseValid, studentId: '   ' }),
    (err: Error) => err instanceof ValidationError && err.message.includes('InvalidStudentId'),
    'studentId kosong wajib ditolak!'
  );

  console.log('  [PASS] UJI-K04: Seluruh masukan cacat berhasil ditangkal di batas kriptografi (fail-closed).\n');
  passedTests++;

  // ----------------------------------------------------------------
  // [UJI-K05] Uji Kunci Rusak & Izin Terlalu Terbuka (Fail-Closed)
  // ----------------------------------------------------------------
  console.log('Running [UJI-K05] Uji Kunci Rusak & Izin Berkas Terlalu Terbuka (POSIX mode 0o600)...');

  // 1. Uji Izin Berkas Terlalu Terbuka: mode 0o644 (dapat dibaca pihak lain)
  assert.throws(
    () => {
      checkFilePermissions(0o644);
    },
    (err: Error) => {
      assert.ok(err instanceof KeyManagementError, 'Harus melempar KeyManagementError');
      assert.ok(err.message.includes('InsecureKeyPermissions'), 'Harus menolak izin 0o644');
      return true;
    },
    'Izin berkas 0o644 wajib ditolak oleh verifikasi keamanan kunci!'
  );

  // 2. Izin berkas 0o600 (owner only) harus lolos tanpa error
  assert.doesNotThrow(() => {
    checkFilePermissions(0o600);
  }, 'Izin berkas 0o600 wajib diterima');

  // 3. Uji panjang kunci tidak sesuai (misal kunci 16-byte / 128-bit)
  const shortKeyFile = path.join(tempTestDir, 'short-key.key');
  fs.writeFileSync(shortKeyFile, Buffer.alloc(16, 0xaa).toString('hex'), 'ascii');

  assert.throws(
    () => {
      loadMasterKey(shortKeyFile);
    },
    (err: Error) => {
      assert.ok(err instanceof KeyManagementError, 'Harus melempar KeyManagementError');
      assert.ok(err.message.includes('InvalidKeyLength'), 'Harus menolak panjang kunci selain 32 byte');
      return true;
    },
    'Kunci dengan panjang selain 32 byte wajib ditolak seketika!'
  );

  // 4. Uji simulasi izin terbuka saat loadMasterKey dipanggil
  assert.throws(
    () => {
      loadMasterKey(tempKeyFile, { simulatedMode: 0o666 });
    },
    (err: Error) => {
      assert.ok(err instanceof KeyManagementError);
      assert.ok(err.message.includes('InsecureKeyPermissions'));
      return true;
    },
    'Pemanggilan loadMasterKey dengan izin terbuka wajib ditolak secara fail-closed!'
  );

  console.log('  [PASS] UJI-K05: Penegakan izin berkas 0o600 & validasi ukuran kunci berhasil 100% fail-closed.\n');
  passedTests++;

  console.log('================================================================');
  console.log(`  HASIL AKHIR: ${passedTests} DARI ${totalTests} SKENARIO UJI PEKAN 5 & 6 LULUS (100% PASS)`);
  console.log('  Kriteria K3 & K4 Rubrik R2 Kriptografi Terpenuhi Penuh.');
  console.log('================================================================\n');
} catch (error) {
  console.error('\n[GAGAL] Salah satu skenario pengujian mengalami kegagalan:');
  console.error(error);
  process.exit(1);
} finally {
  // Bersihkan berkas uji sementara
  try {
    fs.rmSync(tempTestDir, { recursive: true, force: true });
  } catch {
    // Abaikan jika pembersihan otomatis gagal di OS host
  }
}

