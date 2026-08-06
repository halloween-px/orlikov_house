import type { Metadata } from "next";
import {
  apartmentsConfig,
  landingConfig,
  TOTAL_APARTMENTS,
} from "@/config";
import { buildPageMetadata, seoConfig } from "@/config/seo";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Contacts,
  FloatingContact,
  LeadButton,
  LeadModal,
} from "@/components/Contacts";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import ApartmentCard from "@/components/Catalog/ApartmentCard";
import { JsonLd } from "@/components/seo";
import {
  LandingContainer,
  LandingSection,
  LandingTitle,
} from "@/components/shared/landing";
import {
  getApartmentListJsonLd,
  getBreadcrumbJsonLd,
} from "@/lib/seo-schema";
import catalogStyles from "@/components/Catalog/styles/catalog.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: seoConfig.apartments.title,
    description: seoConfig.apartments.description,
    path: seoConfig.apartments.path,
  }),
  title: {
    absolute: seoConfig.apartments.title,
  },
};

function getOrderedApartments() {
  return [...apartmentsConfig].sort((a, b) => a.unit - b.unit);
}

export default function ApartmentsPage() {
  const { catalog } = landingConfig;
  const apartments = getOrderedApartments();
  const availableCount = apartments.filter(
    (apartment) => apartment.availability !== "sold",
  ).length;

  return (
    <main className={styles.page}>
      <JsonLd
        data={[
          getBreadcrumbJsonLd([
            { name: "Главная", path: "/" },
            { name: "Апартаменты", path: "/apartments" },
          ]),
          getApartmentListJsonLd(),
        ]}
      />
      <Header />

      <LandingSection
        id="apartments"
        labelledBy="apartments-title"
        variant="alt"
        className={styles.section}
      >
        <LandingContainer>
          <Breadcrumbs
            className={styles.breadcrumbs}
            items={[
              { label: "Главная", href: "/" },
              { label: "Апартаменты" },
            ]}
          />

          <header className={styles.header}>
            <div className={styles.headerCopy}>
              <LandingTitle
                id="apartments-title"
                measure="full"
                className={styles.title}
              >
                Все{" "}
                <span className={catalogStyles.catalogTitleAccent}>лоты</span>{" "}
                дома
              </LandingTitle>
              <p className={styles.subtitle}>
                {availableCount} из {TOTAL_APARTMENTS} лотов доступны к покупке.
                Выберите апартамент по площади, этажу и формату готовности.
              </p>
            </div>

            <LeadButton
              variant="secondary"
              size="md"
              className={styles.leadBtn}
            />
          </header>

          <div className={`${catalogStyles.catalogGrid} ${styles.grid}`}>
            {apartments.map((apartment, cardIndex) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                detailLabel={catalog.detailLabel}
                requestLabel={catalog.requestLabel}
                delayMs={cardIndex * 35}
              />
            ))}
          </div>
        </LandingContainer>
      </LandingSection>

      <Contacts />
      <Footer />
      <FloatingContact />
      <LeadModal />
    </main>
  );
}
