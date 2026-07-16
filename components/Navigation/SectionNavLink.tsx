"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import type { NavItem } from "@/config/nav";
import { scrollToSection } from "@/lib/scroll-to-section";

type SectionNavLinkProps = {
  item: NavItem;
  className?: string;
  children?: ReactNode;
  onNavigate?: () => void;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "onClick">;

export default function SectionNavLink({
  item,
  className,
  children,
  onNavigate,
  ...rest
}: SectionNavLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(item.id);
    onNavigate?.();
  };

  return (
    <a href={item.href} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
