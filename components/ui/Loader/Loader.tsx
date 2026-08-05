import styles from "./styles/loader.module.css";

type LoaderProps = {
  label?: string;
  fullScreen?: boolean;
};

export default function Loader({
  label = "Загрузка…",
  fullScreen = false,
}: LoaderProps) {
  return (
    <div
      className={`${styles.loader} ${fullScreen ? styles.fullScreen : ""}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.ring} aria-hidden="true">
        <span className={styles.orbit} />
        <span className={styles.core} />
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
