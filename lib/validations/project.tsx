import { z } from 'zod';

// Mendukung pola mock ('prj-101') dan format UUID produksi
export const projectIdSchema = z.string().trim().refine(
  (val) => /^prj-\d+$/.test(val) || z.string().uuid().safeParse(val).success,
  {
    message: 'Format ID proyek tidak valid',
  }
);