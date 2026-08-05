"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/nav";
import { scrollToSection } from "@/lib/scroll-to-section";

type SectionNavLinkProps = {
  item: NavItem;
  className?: string;
  children?: ReactNode;
  onNavigate?: () => void;
} & Omit<ComponentProps<typeof Link>, "href" | "children" | "onClick">;

export default function SectionNavLink({
  item,
  className,
  children,
  onNavigate,
  ...rest
}: SectionNavLinkProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) {
      onNavigate?.();
      return;
    }

    event.preventDefault();
    scrollToSection(item.id);
    onNavigate?.();
  };

  return (
    <Link
      href={`/${item.href}`}
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  );
}
