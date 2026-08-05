import Image from "next/image";
import Link from "next/link";
import { landingConfig, navConfig, siteConfig } from "@/config";
import { Button } from "@/components/ui/Button";
import { LeadButton } from "@/components/Contacts";
import { LandingContainer } from "@/components/shared/landing";
import { BackgroundOrb, FadeDivider } from "@/components/shared/decor";
import styles from "./styles/footer.module.css";

export default function Footer() {
  const { brand, contacts, assets } = siteConfig;
  const { phones } = landingConfig.contacts;
  const { location, facts } = landingConfig;
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <BackgroundOrb size="xxl" tone="mist" className={styles.footerOrb} />

      <LandingContainer className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink}>
              <Image
                src={assets.logoVector}
                alt=""
                width={44}
                height={50}
                className={styles.brandLogo}
              />
              <span className={styles.brandName}>{brand.name}</span>
            </Link>
            <p className={styles.brandText}>
              {brand.descriptionLine1}
              <br />
              {brand.descriptionLine2}
            </p>
            <p className={styles.brandMeta}>
              {contacts.district} · {contacts.metro}
            </p>

            <ul className={styles.facts} aria-label="Коротко о доме">
              {facts.items.map((item) => (
                <li key={item.label} className={styles.fact}>
                  <span className={styles.factValue}>{item.value}</span>
                  <span className={styles.factLabel}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <nav className={styles.nav} aria-label="Навигация в подвале">
            <p className={styles.columnLabel}>Разделы</p>
            <ul className={styles.navList}>
              {navConfig.map((item) => (
                <li key={item.id}>
                  <Link href={`/${item.href}`}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.contacts}>
            <p className={styles.columnLabel}>Контакты</p>
            <ul className={styles.phoneList}>
              {phones.map((phone) => (
                <li key={phone.link}>
                  <a href={phone.link}>{phone.title}</a>
                </li>
              ))}
            </ul>
            <p className={styles.contactLine}>{contacts.address.full}</p>
            <p className={styles.contactLine}>{contacts.hours}</p>
            <a className={styles.email} href={contacts.email.link}>
              {contacts.email.title}
            </a>

            <div className={styles.messengers}>
              <Button
                href="https://wa.me/79936202736"
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </Button>
              <Button
                href="https://t.me/"
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </Button>
            </div>
          </div>

          <div className={styles.ctaColumn}>
            <p className={styles.columnLabel}>Связаться</p>
            <p className={styles.ctaTitle}>Запишитесь на просмотр</p>
            <p className={styles.ctaText}>
              Подберём лот по бюджету, метражу и формату готовности.
            </p>

            <div className={styles.ctaActions}>
              <LeadButton variant="secondary" size="md" rounded="md" />
              <Button
                href={location.mapCta.href}
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {location.mapCta.label}
              </Button>
              <Button
                href={location.routeCta.href}
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {location.routeCta.label}
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <FadeDivider className={styles.bottomDivider} />
          <p className={styles.copy}>
            © {year} {brand.name}. Все права защищены.
          </p>
          <p className={styles.bottomNote}>
            Показы по договорённости · ежедневно 9:00–21:00
          </p>
        </div>
      </LandingContainer>
    </footer>
  );
}
