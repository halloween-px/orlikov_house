"use client";

import { useEffect, useEffectEvent, useState } from "react";

type UseLightboxOptions = {
  images: readonly string[];
  /** Зацикливать листание. По умолчанию true. */
  loop?: boolean;
};

export type UseLightboxResult = {
  isOpen: boolean;
  index: number;
  currentSrc: string | null;
  count: number;
  hasMultiple: boolean;
  open: (index?: number) => void;
  close: () => void;
  prev: () => void;
  next: () => void;
};

export function useLightbox({
  images,
  loop = true,
}: UseLightboxOptions): UseLightboxResult {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const count = images.length;
  const hasMultiple = count > 1;

  const close = () => setIsOpen(false);

  const open = (nextIndex = 0) => {
    if (count === 0) return;
    const safeIndex = Math.min(Math.max(nextIndex, 0), count - 1);
    setIndex(safeIndex);
    setIsOpen(true);
  };

  const prev = () => {
    setIndex((current) => {
      if (count < 2) return current;
      if (current <= 0) return loop ? count - 1 : 0;
      return current - 1;
    });
  };

  const next = () => {
    setIndex((current) => {
      if (count < 2) return current;
      if (current >= count - 1) return loop ? 0 : count - 1;
      return current + 1;
    });
  };

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === "Escape") {
      close();
      return;
    }

    if (!hasMultiple) return;

    if (event.key === "ArrowLeft") prev();
    if (event.key === "ArrowRight") next();
  });

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onKeyDown]);

  useEffect(() => {
    if (count === 0) {
      setIsOpen(false);
      setIndex(0);
      return;
    }

    if (index > count - 1) {
      setIndex(count - 1);
    }
  }, [count, index]);

  return {
    isOpen,
    index,
    currentSrc: count > 0 ? images[index] ?? images[0] : null,
    count,
    hasMultiple,
    open,
    close,
    prev,
    next,
  };
}
