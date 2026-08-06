import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  apartmentsConfig,
  finishPackages,
  formatApartmentFloor,
  formatApartmentPrice,
  getApartmentAvailability,
  getApartmentById,
  getApartmentFinish,
  getApartmentGallery,
} from "@/config";
import { buildPageMetadata, seoConfig } from "@/config/seo";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  FloatingContact,
  LeadButton,
  LeadModal,
} from "@/components/Contacts";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import ApartmentGallery from "@/components/Catalog/ApartmentGallery";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo";
import {
  LandingContainer,
  LandingSection,
} from "@/components/shared/landing";
import {
  getApartmentJsonLd,
  getBreadcrumbJsonLd,
} from "@/lib/seo-schema";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return apartmentsConfig.map((apartment) => ({ id: apartment.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const apartment = getApartmentById(id);

  if (!apartment) {
    return buildPageMetadata({
      title: "Апартамент не найден",
      description: seoConfig.apartments.description,
      path: "/apartments",
      noIndex: true,
    });
  }

  const title = `Лот ${apartment.unit} — ${apartment.area}, ${formatApartmentFloor(apartment.floor)} | Орликов Хаус`;
  const description = `${apartment.description}. ${apartment.address}. Цена ${formatApartmentPrice(apartment.price)}.`;

  return {
    ...buildPageMetadata({
      title,
      description,
      path: `/apartments/${apartment.id}`,
      image: apartment.preview,
    }),
    title: { absolute: title },
  };
}

export default async function ApartmentPage({ params }: PageProps) {
  const { id } = await params;
  const apartment = getApartmentById(id);

  if (!apartment) notFound();

  const finish = getApartmentFinish(apartment.finish);
  const finishPackage = finishPackages[apartment.finish];
  const status = getApartmentAvailability(apartment.availability);
  const gallery = getApartmentGallery(apartment);
  const isSold = apartment.availability === "sold";
  const isRental = apartment.availability === "rental_business";
  const path = `/apartments/${apartment.id}`;

  return (
    <main className={styles.page}>
      <JsonLd
        data={[
          getBreadcrumbJsonLd([
            { name: "Главная", path: "/" },
            { name: "Апартаменты", path: "/apartments" },
            { name: `Лот ${apartment.unit}`, path },
          ]),
          getApartmentJsonLd(apartment),
        ]}
      />
      <Header />

      <LandingSection
        id="apartment"
        labelledBy="apartment-title"
        variant="alt"
        className={styles.section}
      >
        <LandingContainer>
          <Breadcrumbs
            className={styles.breadcrumbs}
            items={[
              { label: "Главная", href: "/" },
              { label: "Апартаменты", href: "/apartments" },
              { label: `Лот ${apartment.unit}` },
            ]}
          />

          <div className={styles.layout}>
            <ApartmentGallery
              images={gallery}
              alt={`Лот ${apartment.unit}`}
              badge={
                isSold || isRental
                  ? {
                      label: status.label,
                      tone: isSold ? "sold" : "rental",
                    }
                  : undefined
              }
            />

            <aside className={styles.info}>
              <p className={styles.eyebrow}>Орликов Хаус</p>
              <h1 id="apartment-title" className={styles.title}>
                Лот {apartment.unit}
              </h1>
              <p className={styles.lead}>{apartment.title}</p>

              <dl className={styles.facts}>
                <div>
                  <dt>Площадь</dt>
                  <dd>{apartment.area}</dd>
                </div>
                <div>
                  <dt>Этаж</dt>
                  <dd>{formatApartmentFloor(apartment.floor)}</dd>
                </div>
                <div>
                  <dt>Формат</dt>
                  <dd>{apartment.rooms}</dd>
                </div>
                <div>
                  <dt>Окна</dt>
                  <dd>{apartment.windows}</dd>
                </div>
              </dl>

              <div className={styles.priceBlock}>
                {isSold ? (
                  <p className={styles.priceSold}>{status.label}</p>
                ) : (
                  <p className={styles.price}>
                    {formatApartmentPrice(apartment.price)}
                  </p>
                )}
                <p className={styles.finish}>{finish.label}</p>
              </div>

              <ul className={styles.highlights}>
                {apartment.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className={styles.package}>
                <p className={styles.packageTitle}>{finishPackage.label}</p>
                <p className={styles.packageSummary}>
                  {finishPackage.summary}
                  {finishPackage.extras ? ` · ${finishPackage.extras}` : ""}
                </p>
                <ul className={styles.packageList}>
                  {finishPackage.items.map((item) => (
                    <li key={item.title}>
                      <span>{item.title}</span>
                      <p>{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.actions}>
                {!isSold ? (
                  <LeadButton
                    leadVariant="viewing"
                    variant="secondary"
                    size="lg"
                    rounded="md"
                    fullWidth
                  />
                ) : null}
                <Button
                  href="/apartments"
                  variant="outline"
                  size="lg"
                  rounded="md"
                  fullWidth
                >
                  Все апартаменты
                </Button>
              </div>

              <p className={styles.address}>{apartment.address}</p>
            </aside>
          </div>
        </LandingContainer>
      </LandingSection>

      <Footer />
      <FloatingContact />
      <LeadModal />
    </main>
  );
}
