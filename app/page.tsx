import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HashScroll from "@/components/Navigation/HashScroll";
import { Facts } from "@/components/Facts";
import { About } from "@/components/About";
import { Catalog } from "@/components/Catalog";
import { Location } from "@/components/Location";
import { Advantages } from "@/components/Advantages";
import { Contacts, FloatingContact, LeadModal } from "@/components/Contacts";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/seo";
import { getVisibleApartments } from "@/lib/apartments";
import { getFaqJsonLd } from "@/lib/seo-schema";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const apartments = await getVisibleApartments();

  return (
    <main className={styles.page}>
      <JsonLd data={getFaqJsonLd()} />
      <HashScroll />
      <Header />
      <Hero />
      <Facts />
      <About />
      <Catalog apartments={apartments} />
      <Advantages />
      <Contacts />
      <Location />
      <Footer />
      <FloatingContact />
      <LeadModal />
    </main>
  );
}
