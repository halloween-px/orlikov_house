import Link from "next/link";
import styles from "./styles/breadcrumbs.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
  className?: string;
};

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      className={[styles.breadcrumbs, className].filter(Boolean).join(" ")}
      aria-label="Хлебные крошки"
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {index > 0 ? (
                <span className={styles.separator} aria-hidden="true">
                  <span className={styles.separatorDot} />
                </span>
              ) : null}

              {item.href && !isLast ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span
                  className={styles.current}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
