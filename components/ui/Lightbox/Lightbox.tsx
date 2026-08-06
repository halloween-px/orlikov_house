"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { UseLightboxResult } from "@/hooks/useLightbox";
import styles from "./styles/lightbox.module.css";

type LightboxProps = {
  lightbox: UseLightboxResult;
  alt: string;
};

export default function Lightbox({ lightbox, alt }: LightboxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !lightbox.isOpen || !lightbox.currentSrc) {
    return null;
  }

  return createPortal(
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — просмотр фото`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) lightbox.close();
      }}
    >
      <button
        type="button"
        className={`${styles.control} ${styles.close}`}
        aria-label="Закрыть"
        onClick={lightbox.close}
      >
        <X className={styles.icon} strokeWidth={1.8} />
      </button>

      {lightbox.hasMultiple ? (
        <>
          <button
            type="button"
            className={`${styles.control} ${styles.prev}`}
            aria-label="Предыдущее фото"
            onClick={lightbox.prev}
          >
            <ChevronLeft className={styles.icon} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className={`${styles.control} ${styles.next}`}
            aria-label="Следующее фото"
            onClick={lightbox.next}
          >
            <ChevronRight className={styles.icon} strokeWidth={1.8} />
          </button>
        </>
      ) : null}

      <div className={styles.stage}>
        <Image
          key={lightbox.currentSrc}
          src={lightbox.currentSrc}
          alt={`${alt} — фото ${lightbox.index + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      <p className={styles.counter}>
        {lightbox.index + 1} / {lightbox.count}
      </p>
    </div>,
    document.body,
  );
}
