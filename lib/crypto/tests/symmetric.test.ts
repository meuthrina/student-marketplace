import assert from 'node:assert';
import {
  generateSymmetricKey,
  encryptPayload,
  decryptPayload,
  NONCE_LENGTH,
  TAG_LENGTH,
  KEY_LENGTH,
} from '../symmetric';
import {
  sealProposal,
  openProposal,
  ProposalSecretPayload,
} from '../proposal-vault';
import {
  calculateDocumentHash,
  verifyDocumentIntegrity,
} from '../document-signer';

console.log('\n================================================================');
console.log('  Tugas 2 Kriptografi (Pekan 4) - Pengujian Enkripsi Simetris AES-256-GCM');
console.log('  Platform: Studance (Proposal Vault & Document Signer Integration)');
console.log('================================================================\n');

let passedTests = 0;
const totalTests = 5;

try {
  // ----------------------------------------------------------------
  // [UJI-01] Round-trip Test: Enkripsi & Dekripsi Proposal Sah
  // ----------------------------------------------------------------
  console.log('Running [UJI-01] Round-trip Test: Enkripsi proposal valid -> dekripsi sukses menghasilkan data identik...');
  const vaultKey = generateSymmetricKey();
  assert.strictEqual(vaultKey.length, KEY_LENGTH, `Panjang kunci harus ${KEY_LENGTH} byte`);

  const mockAttachment = Buffer.from('Lampiran Portofolio Desain UI/UX Studance v1.0 PDF Content');
  const validPayload: ProposalSecretPayload = {
    studentId: '105224029',
    proyekId: 'proj-pertamina-01',
    nominalPenawaran: 1500000,
    durasiHari: 14,
    pesanProposal: 'Saya berpengalaman dalam Next.js dan Tailwind CSS siap menyelesaikan proyek ini.',
    attachmentBuffer: mockAttachment,
  };

  const sealedBuffer = sealProposal(vaultKey, validPayload);
  assert.ok(Buffer.isBuffer(sealedBuffer), 'Hasil sealProposal harus berupa Buffer');
  assert.ok(
    sealedBuffer.length > NONCE_LENGTH + TAG_LENGTH,
    'Panjang paket terenkripsi harus melebihi batas minimum nonce + auth tag'
  );

  // Uji keunikan nonce pada enkripsi berulang dengan payload sama
  const sealedBuffer2 = sealProposal(vaultKey, validPayload);
  const nonce1 = sealedBuffer.subarray(0, NONCE_LENGTH);
  const nonce2 = sealedBuffer2.subarray(0, NONCE_LENGTH);
  assert.notDeepStrictEqual(nonce1, nonce2, 'Setiap proses enkripsi wajib menghasilkan nonce 96-bit unik!');

  const unsealed = openProposal(vaultKey, sealedBuffer, validPayload.proyekId, validPayload.studentId);
  assert.strictEqual(unsealed.studentId, validPayload.studentId, 'Student ID harus cocok!');
  assert.strictEqual(unsealed.proyekId, validPayload.proyekId, 'Proyek ID harus cocok!');
  assert.strictEqual(unsealed.nominalPenawaran, validPayload.nominalPenawaran, 'Nominal penawaran harus presisi!');
  assert.strictEqual(unsealed.durasiHari, validPayload.durasiHari, 'Durasi hari harus presisi!');
  assert.strictEqual(unsealed.pesanProposal, validPayload.pesanProposal, 'Pesan proposal harus identik!');
  assert.strictEqual(
    unsealed.attachmentHash,
    calculateDocumentHash(mockAttachment),
    'Digest lampiran harus cocok dengan perhitungan SHA-256 Tugas 1!'
  );
  console.log('  [PASS] UJI-01: Round-trip enkripsi dan dekripsi proposal berhasil 100% identik.\n');
  passedTests++;

  // ----------------------------------------------------------------
  // [UJI-02] Tampering Ciphertext Test: Modifikasi 1 Byte pada Ciphertext
  // ----------------------------------------------------------------
  console.log('Running [UJI-02] Tampering Ciphertext Test: Modifikasi 1 byte ciphertext -> dekripsi ditolak seketika (InvalidTag)...');
  const tamperedSealedBuffer = Buffer.from(sealedBuffer);
  // Ubah 1 byte pada area ciphertext (antara nonce dan auth tag)
  const byteToFlipIndex = NONCE_LENGTH + 5;
  tamperedSealedBuffer[byteToFlipIndex] ^= 0x01; // Balikkan 1 bit

  assert.throws(
    () => {
      openProposal(vaultKey, tamperedSealedBuffer, validPayload.proyekId, validPayload.studentId);
    },
    (err: Error) => {
      const isExpected = err.message.includes('InvalidTag: Autentikasi integritas data gagal');
      assert.ok(isExpected, `Pesan kesalahan harus mengindikasikan InvalidTag, didapat: ${err.message}`);
      return true;
    },
    'Dekripsi wajib gagal seketika (fail-closed) saat ciphertext dimanipulasi!'
  );
  console.log('  [PASS] UJI-02: Ciphertext tampering terdeteksi oleh auth tag GHASH (fail-closed).\n');
  passedTests++;

  // ----------------------------------------------------------------
  // [UJI-03] Wrong Key Test: Dekripsi dengan Kunci Acak Lain
  // ----------------------------------------------------------------
  console.log('Running [UJI-03] Wrong Key Test: Mendekripsi dengan kunci simetris acak lain -> ditolak seketika...');
  const attackerKey = generateSymmetricKey();
  assert.notDeepStrictEqual(attackerKey, vaultKey, 'Kunci penyerang harus berbeda dari kunci asli');

  assert.throws(
    () => {
      openProposal(attackerKey, sealedBuffer, validPayload.proyekId, validPayload.studentId);
    },
    (err: Error) => {
      const isExpected = err.message.includes('InvalidTag: Autentikasi integritas data gagal');
      assert.ok(isExpected, `Pesan kesalahan harus mengindikasikan InvalidTag, didapat: ${err.message}`);
      return true;
    },
    'Dekripsi dengan kunci yang salah wajib ditolak seketika!'
  );
  console.log('  [PASS] UJI-03: Kunci salah berhasil ditolak secara fail-closed.\n');
  passedTests++;

  // ----------------------------------------------------------------
  // [UJI-04] Context-Swapping / AAD Tampering Test
  // ----------------------------------------------------------------
  console.log('Running [UJI-04] Context-Swapping Test: Mengubah ID Proyek / ID Mahasiswa pada AAD -> ditolak seketika...');
  // Skenario A: Penyerang mencoba memindahkan penawaran sah mahasiswa A ke proyek lain (proyek-competitor-99)
  assert.throws(
    () => {
      openProposal(vaultKey, sealedBuffer, 'proyek-competitor-99', validPayload.studentId);
    },
    (err: Error) => {
      const isExpected = err.message.includes('InvalidTag: Autentikasi integritas data gagal');
      assert.ok(isExpected, 'AAD mismatch (proyekId beda) harus memicu kegagalan autentikasi tag');
      return true;
    },
    'Membuka proposal pada ID proyek berbeda wajib ditolak oleh verifikasi AAD!'
  );

  // Skenario B: Penyerang mencoba mengklaim penawaran mahasiswa A atas nama mahasiswa B (student-impostor-77)
  assert.throws(
    () => {
      openProposal(vaultKey, sealedBuffer, validPayload.proyekId, 'student-impostor-77');
    },
    (err: Error) => {
      const isExpected = err.message.includes('InvalidTag: Autentikasi integritas data gagal');
      assert.ok(isExpected, 'AAD mismatch (studentId beda) harus memicu kegagalan autentikasi tag');
      return true;
    },
    'Membuka proposal dengan ID mahasiswa berbeda wajib ditolak oleh verifikasi AAD!'
  );
  console.log('  [PASS] UJI-04: Serangan Context-Swapping (AAD manipulation) berhasil ditangkal.\n');
  passedTests++;

  // ----------------------------------------------------------------
  // [UJI-05] Broken Connection Test: Integrasi Hash Lampiran Dokumen (Tugas 1)
  // ----------------------------------------------------------------
  console.log('Running [UJI-05] Broken Connection Test: Integritas lampiran Tugas 1 terhubung ke Proposal Vault...');
  // Buka proposal yang sah untuk mendapatkan digest lampiran yang tersimpan dalam vault
  const unsealedValid = openProposal(vaultKey, sealedBuffer, validPayload.proyekId, validPayload.studentId);
  const storedAttachmentHash = unsealedValid.attachmentHash!;

  // Kasus 1: Lampiran asli diverifikasi dengan fungsi Tugas 1 verifyDocumentIntegrity
  const isOriginalValid = verifyDocumentIntegrity(mockAttachment, storedAttachmentHash);
  assert.strictEqual(isOriginalValid, true, 'Lampiran berkas asli harus lolos verifikasi integritas Tugas 1');

  // Kasus 2: Penyerang memodifikasi berkas lampiran di storage (menambah 1 byte pada berkas)
  const tamperedAttachment = Buffer.from(mockAttachment);
  tamperedAttachment[0] ^= 0xff; // Ubah byte pertama dokumen
  const isTamperedValid = verifyDocumentIntegrity(tamperedAttachment, storedAttachmentHash);
  assert.strictEqual(
    isTamperedValid,
    false,
    'Lampiran berkas yang dimanipulasi wajib terdeteksi tidak valid terhadap hash di Proposal Vault!'
  );

  console.log('  [PASS] UJI-05: Modul T1 (document-signer) dan T2 (symmetric vault) tersambung utuh dan mendeteksi anomali berkas.\n');
  passedTests++;

  console.log('================================================================');
  console.log(`  HASIL AKHIR: ${passedTests} DARI ${totalTests} SKENARIO UJI LULUS (100% PASS)`);
  console.log('  Kriteria K4 Rubrik Kriptografi (1 Positif + 4 Negatif/Kondisi Tidak Sah) Terpenuhi.');
  console.log('================================================================\n');
} catch (error) {
  console.error('\n[GAGAL] Salah satu skenario pengujian mengalami kegagalan:');
  console.error(error);
  process.exit(1);
}

