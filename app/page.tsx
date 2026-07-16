import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HashScroll from "@/components/Navigation/HashScroll";
import { Facts } from "@/components/Facts";
import { About } from "@/components/About";
import { Catalog } from "@/components/Catalog";
import { Location } from "@/components/Location";
import { Advantages } from "@/components/Advantages";
import { Contacts, FloatingContact } from "@/components/Contacts";
import { Footer } from "@/components/Footer";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <HashScroll />
      <Header />
      <Hero />
      <Facts />
      <About />
      <Catalog />
      {/* <Advantages /> */}
      <Contacts />
      <Location />
      <Footer />
      <FloatingContact />
    </main>
  );
}
