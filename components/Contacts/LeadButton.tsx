"use client";

import type { ReactNode } from "react";
import { siteConfig } from "@/config";
import { useMainContext } from "@/context/MainProvider";
import { Button } from "@/components/ui/Button";
import type { ButtonProps } from "@/components/ui/Button";
import type { LeadLot } from "@/types";

type LeadButtonProps = {
  children?: ReactNode;
  /** `request` — «Оставить заявку», `viewing` — «Записаться на просмотр» */
  leadVariant?: "request" | "viewing";
  lot?: LeadLot | null;
  variant?: ButtonProps extends { variant?: infer V } ? V : never;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  rounded?: "pill" | "md";
  className?: string;
  stacked?: boolean;
  active?: boolean;
};

export default function LeadButton({
  children,
  leadVariant = "request",
  lot = null,
  ...props
}: LeadButtonProps) {
  const { openLeadModal } = useMainContext();
  const label =
    children ??
    (leadVariant === "request"
      ? siteConfig.requestForm.requestTitle
      : siteConfig.requestForm.title);

  return (
    <Button
      type="button"
      {...props}
      onClick={() => openLeadModal(leadVariant, lot)}
    >
      {label}
    </Button>
  );
}
