"use client";

import { memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { navConfig, type NavItem } from "@/config";
import { scrollToSection } from "@/lib/scroll-to-section";
import { Button } from "@/components/ui/Button";
import { useIsActiveSection } from "./useActiveSection";
import styles from "./styles/navigation.module.css";

type NavigationProps = {
  onNavigate?: () => void;
  className?: string;
  variant?: "header" | "mobile";
};

const join = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

type NavLinkProps = {
  item: NavItem;
  isHome: boolean;
  onNavigate?: () => void;
  onLeaveHome: (href: string) => void;
};

const NavLink = memo(function NavLink({
  item,
  isHome,
  onNavigate,
  onLeaveHome,
}: NavLinkProps) {
  const isActive = useIsActiveSection(item.id, isHome);
  const href = `/${item.href}`;

  return (
    <Button
      href={href}
      variant="outline"
      size="md"
      active={isActive}
      className={join(styles.link, isActive && styles.linkActive)}
      aria-current={isActive ? "true" : undefined}
      onClick={(event) => {
        event.preventDefault();
        if (!isHome) {
          onLeaveHome(`/#${item.id}`);
          onNavigate?.();
          return;
        }
        scrollToSection(item.id);
        onNavigate?.();
      }}
    >
      {item.label}
    </Button>
  );
});

export default function Navigation({
  onNavigate,
  className,
  variant = "header",
}: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  return (
    <nav
      className={join(
        styles.nav,
        variant === "mobile" && styles.navMobile,
        className,
      )}
      aria-label="Навигация по сайту"
    >
      {navConfig.map((item) => (
        <NavLink
          key={item.id}
          item={item}
          isHome={isHome}
          onNavigate={onNavigate}
          onLeaveHome={(href) => router.push(href)}
        />
      ))}
    </nav>
  );
}
