"use client";

import { navConfig } from "@/config";
import { scrollToSection } from "@/lib/scroll-to-section";
import { Button } from "@/components/ui/Button";
import { useActiveSection } from "./useActiveSection";
import styles from "./styles/navigation.module.css";

type NavigationProps = {
  onNavigate?: () => void;
  className?: string;
  variant?: "header" | "mobile";
};

const join = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

export default function Navigation({
  onNavigate,
  className,
  variant = "header",
}: NavigationProps) {
  const activeId = useActiveSection();

  return (
    <nav
      className={join(
        styles.nav,
        variant === "mobile" && styles.navMobile,
        className,
      )}
      aria-label="Навигация по сайту"
    >
      {navConfig.map((item) => {
        const isActive = activeId === item.id;

        return (
          <Button
            key={item.id}
            href={item.href}
            variant="outline"
            size="md"
            active={isActive}
            className={join(styles.link, isActive && styles.linkActive)}
            aria-current={isActive ? "true" : undefined}
            onClick={(event) => {
              event.preventDefault();
              scrollToSection(item.id);
              onNavigate?.();
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}
