"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/config";
import { useMainContext } from "@/context/MainProvider";
import { useLeadChallenge } from "@/hooks/useLeadChallenge";
import { submitLead } from "@/lib/submit-lead";
import { Button } from "@/components/ui/Button";
import styles from "./styles/lead-modal.module.css";

export default function LeadModal() {
  const { leadModalOpen, leadModalVariant, closeLeadModal } = useMainContext();
  const { requestForm } = siteConfig;
  const titleId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { challenge, ready, refresh } = useLeadChallenge(leadModalOpen);

  const title =
    leadModalVariant === "request"
      ? requestForm.requestTitle
      : requestForm.title;

  const source =
    leadModalVariant === "request"
      ? "Модалка: оставить заявку"
      : "Модалка: запись на просмотр";

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
      setWebsite("");
      setSubmitted(false);
      setSubmitting(false);
      setError("");
    }
  }, [leadModalOpen]);

  if (!leadModalOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    const result = await submitLead({
      name,
      phone,
      source,
      website,
      challenge,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      void refresh();
      return;
    }

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
                disabled={submitting}
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
                disabled={submitting}
              />
            </label>

            <div className={styles.honeypot} aria-hidden="true">
              <label>
                Не заполняйте это поле
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              fullWidth
              rounded="md"
              disabled={submitting || !ready}
            >
              {submitting ? "Отправляем…" : requestForm.submitLabel}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
