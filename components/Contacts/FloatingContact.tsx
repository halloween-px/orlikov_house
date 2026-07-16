"use client";

import { useEffect, useRef, useState } from "react";
import { FiPhone } from "react-icons/fi";
import { landingConfig } from "@/config";
import styles from "./styles/floating-contact.module.css";

export default function FloatingContact() {
  const { fab } = landingConfig;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.fabWrap} ref={wrapRef}>
      {open && (
        <nav className={styles.fabMenu} aria-label="Способы связи">
          {fab.items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={styles.fabItem}
              {...(item.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}

      <button
        type="button"
        className={styles.fabButton}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.fabButtonContent}>
          <FiPhone className={styles.fabButtonIcon} aria-hidden="true" />
          <span>{fab.label}</span>
        </span>
      </button>
    </div>
  );
}

