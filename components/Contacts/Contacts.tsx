"use client";

import { FormEvent, useState } from "react";
import { getNavLabel, landingConfig } from "@/config";
import { useLeadChallenge } from "@/hooks/useLeadChallenge";
import { submitLead } from "@/lib/submit-lead";
import { Button } from "@/components/ui/Button";
import {
  LandingActions,
  LandingContainer,
  LandingSection,
  LandingSubtitle,
  LandingTitle,
} from "@/components/shared/landing";
import styles from "./styles/contacts.module.css";

export default function Contacts() {
  const { lead, contacts } = landingConfig;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { challenge, ready, refresh } = useLeadChallenge(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    const result = await submitLead({
      name,
      phone,
      comment,
      source: "Блок контактов",
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
    setName("");
    setPhone("");
    setComment("");
    setWebsite("");
    void refresh();
  };

  return (
    <LandingSection
      id={lead.id}
      labelledBy="lead-title"
      className={styles.contactsSection}
    >
      <LandingContainer>
        <div className={styles.leadRow}>
          <div className={styles.leadIntro} id={contacts.id}>
            <div className={styles.leadHeader}>
              <LandingTitle
                id="lead-title"
                measure="full"
                className={styles.leadTitle}
                eyebrow={getNavLabel(lead.id)}
              >
                {lead.title}
              </LandingTitle>
              <LandingSubtitle measure="full" className={styles.leadSubtitle}>
                {lead.subtitle}
              </LandingSubtitle>
            </div>

            <div className={styles.contactBlock}>
              <div className={styles.contactHeading}>
                <p className={styles.contactTitle}>Контактные данные</p>
              </div>

              <ul className={styles.phoneList}>
                {contacts.phones.map((phoneItem) => (
                  <li key={phoneItem.link}>
                    <a href={phoneItem.link}>{phoneItem.title}</a>
                  </li>
                ))}
              </ul>

              <div className={styles.metaList}>
                <p className={styles.metaItem}>
                  <span className={styles.metaLabel}>Адрес</span>
                  <span className={styles.metaValue}>{contacts.address}</span>
                </p>
                <p className={styles.metaItem}>
                  <span className={styles.metaLabel}>Часы</span>
                  <span className={styles.metaValue}>{contacts.hours}</span>
                </p>
              </div>

              <LandingActions className={styles.contactsActions}>
                {contacts.actions.map((action) => (
                  <Button
                    key={action.label}
                    href={action.href}
                    variant="outline"
                    size="sm"
                    {...(action.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {action.label}
                  </Button>
                ))}
              </LandingActions>
            </div>
          </div>

          <form className={styles.formCard} onSubmit={handleSubmit}>
            <div className={styles.formFields}>
              <label className={styles.field}>
                <span className={styles.label}>{lead.fields.name.label}</span>
                <input
                  className={styles.input}
                  type="text"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={lead.fields.name.placeholder}
                  required
                  disabled={submitting || submitted}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>{lead.fields.phone.label}</span>
                <input
                  className={styles.input}
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={lead.fields.phone.placeholder}
                  required
                  disabled={submitting || submitted}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>
                  {lead.fields.comment.label}
                </span>
                <textarea
                  className={styles.textarea}
                  name="comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder={lead.fields.comment.placeholder}
                  disabled={submitting || submitted}
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
            </div>

            <div className={styles.formFooter}>
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                rounded="md"
                disabled={submitting || !ready || submitted}
              >
                {submitting ? "Отправляем…" : lead.submitLabel}
              </Button>

              {error ? <p className={styles.error}>{error}</p> : null}
              {submitted ? (
                <p className={styles.success}>Заявка отправлена</p>
              ) : null}
            </div>
          </form>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
