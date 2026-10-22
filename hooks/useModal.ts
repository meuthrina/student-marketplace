'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseModalOptions {
  /** Status awal saat hook pertama kali dimuat */
  defaultOpen?: boolean;
  /** Callback saat modal dibuka */
  onOpen?: () => void;
  /** Callback saat modal ditutup */
  onClose?: () => void;
  /** Apakah tombol Escape akan menutup modal secara otomatis (default: true) */
  closeOnEscape?: boolean;
  /** Apakah scrolling pada body dikunci saat modal terbuka (default: true) */
  lockScroll?: boolean;
  /** Apakah fokus dikembalikan ke elemen pemicu saat modal ditutup (WCAG AA Focus Return, default: true) */
  returnFocus?: boolean;
}

export interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * useModal Custom Hook
 *
 * Mengelola siklus hidup dialog/modal secara deklaratif:
 * - Menangani status `isOpen`, `openModal`, dan `closeModal`.
 * - Menerapkan Body Scroll Lock saat modal terbuka untuk mencegah layout shift & scrolling latar belakang.
 * - Menambahkan keyboard listener untuk tombol `Escape` guna mematuhi standar aksesibilitas WCAG 2.2 Modal Dialog.
 * - Menerapkan Focus Return: menyimpan `document.activeElement` sebelum terbuka dan mengembalikannya saat ditutup.
 */
export function useModal(options: UseModalOptions = {}): UseModalReturn {
  const {
    defaultOpen = false,
    onOpen,
    onClose,
    closeOnEscape = true,
    lockScroll = true,
    returnFocus = true,
  } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback(() => {
    if (typeof document !== 'undefined') {
      triggerElementRef.current = document.activeElement as HTMLElement | null;
    }
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    onClose?.();
    if (returnFocus && triggerElementRef.current) {
      const el = triggerElementRef.current;
      setTimeout(() => {
        if (el && typeof el.focus === 'function') {
          el.focus();
        }
      }, 50);
    }
  }, [onClose, returnFocus]);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        if (typeof document !== 'undefined') {
          triggerElementRef.current = document.activeElement as HTMLElement | null;
        }
        onOpen?.();
      } else {
        onClose?.();
        if (returnFocus && triggerElementRef.current) {
          const el = triggerElementRef.current;
          setTimeout(() => {
            if (el && typeof el.focus === 'function') {
              el.focus();
            }
          }, 50);
        }
      }
      return next;
    });
  }, [onOpen, onClose, returnFocus]);

  // Body Scroll Lock & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    // 1. Lock Body Scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (lockScroll) {
      document.body.style.overflow = 'hidden';
    }

    // 2. Escape Key Listener
    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (lockScroll) {
        document.body.style.overflow = originalStyle;
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, lockScroll, closeModal]);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    setIsOpen,
  };
}

export default useModal;
