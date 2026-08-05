"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/config";
import { useMainContext } from "@/context/MainProvider";
import { Button } from "@/components/ui/Button";
import styles from "./styles/lead-modal.module.css";

export default function LeadModal() {
  const { leadModalOpen, leadModalVariant, closeLeadModal } = useMainContext();
  const { requestForm } = siteConfig;
  const titleId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const title =
    leadModalVariant === "request"
      ? requestForm.requestTitle
      : requestForm.title;

  useEffect(() => {
    if (!leadModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameInputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLeadModal();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [leadModalOpen, closeLeadModal]);

  useEffect(() => {
    if (!leadModalOpen) {
      setName("");
      setPhone("");
      setSubmitted(false);
    }
  }, [leadModalOpen]);

  if (!leadModalOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeLeadModal();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Закрыть"
          onClick={closeLeadModal}
        >
          ×
        </button>

        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>

        {submitted ? (
          <p className={styles.success}>{requestForm.successMessage}</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>{requestForm.nameLabel}</span>
              <input
                ref={nameInputRef}
                className={styles.input}
                type="text"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={requestForm.namePlaceholder}
                required
                autoComplete="name"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>{requestForm.phoneLabel}</span>
              <input
                className={styles.input}
                type="tel"
                name="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={requestForm.phonePlaceholder}
                required
                autoComplete="tel"
              />
            </label>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              fullWidth
              rounded="md"
            >
              {requestForm.submitLabel}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
