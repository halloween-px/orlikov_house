import HeaderTop from "./HeaderTop";
import styles from "./styles/header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper}>
        <HeaderTop />
      </div>
    </header>
  );
}
