import 'server-only';

/**
 * Modul Data Internal Server (Simulasi Akses Database/Secret Key)
 * Dilindungi oleh 'server-only' untuk mencegah kebocoran informasi ke Client Bundle (DFD T33/T32).
 */
export const serverSecretData = {
  dbConnectionUrl: 'postgresql://postgres:secret@localhost:5432/studance_db',
  apiMasterKey: 'sk_live_studance_server_secret_998877',
  internalAuditNotes: 'Data transaksi escrow DFD F9 yang hanya boleh diakses oleh Server Component.',
};
