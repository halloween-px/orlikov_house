import type { HTMLAttributes } from "react";
import styles from "./fade-divider.module.css";

type FadeDividerOrientation = "horizontal" | "vertical";

type FadeDividerProps = {
  /** Направление линии: по центру ярче, к краям затемняется */
  orientation?: FadeDividerOrientation;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

const join = (...classNames: Array<string | false | null | undefined>) =>
  classNames.filter(Boolean).join(" ");

/** Линия с градиентом: ярче в центре, уходит в затемнение к краям */
export function FadeDivider({
  orientation = "horizontal",
  className,
  ...props
}: FadeDividerProps) {
  return (
    <div
      aria-hidden
      className={join(
        styles.divider,
        orientation === "vertical" ? styles.vertical : styles.horizontal,
        className,
      )}
      {...props}
    />
  );
}
