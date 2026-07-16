"use client";

import { FormEvent, useState } from "react";
import { getNavLabel, landingConfig } from "@/config";
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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
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
                />
              </label>
            </div>

            <div className={styles.formFooter}>
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                rounded="md"
              >
                {lead.submitLabel}
              </Button>

              {submitted && (
                <p className={styles.success}>Заявка отправлена</p>
              )}
            </div>
          </form>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
