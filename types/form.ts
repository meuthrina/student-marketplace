/**
 * Kontrak Standar Nilai Kembalian Server Action (Form Action State)
 * Sesuai panduan Next.js App Router dan React 19 `useActionState` (Pekan 5 PAW).
 */
export interface FormActionState<T = unknown> {
  success?: boolean;
  pesan?: string;
  galat?: Record<string, string[] | undefined>;
  data?: T;
  nilai?: Record<string, string>;
}

export type StatusForm<T = unknown> = FormActionState<T>;

