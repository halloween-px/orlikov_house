"use client";

import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import {
  formatRuPhoneInput,
  getRuPhoneDigits,
  isValidRuPhone,
} from "@/lib/form-input";

export type PhoneFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value" | "inputMode"
> & {
  value: string;
  onChange: (value: string) => void;
};

const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  function PhoneField({ value, onChange, className, onBlur, ...rest }, ref) {
    const display = value ? formatRuPhoneInput(value) : "+7 ";

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(formatRuPhoneInput(event.target.value));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Tab",
        "Home",
        "End",
        "Enter",
      ];

      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (allowedKeys.includes(event.key)) return;
      if (/^\d$/.test(event.key)) return;

      event.preventDefault();
    };

    return (
      <input
        {...rest}
        ref={ref}
        type="tel"
        inputMode="numeric"
        autoComplete={rest.autoComplete ?? "tel"}
        className={className}
        value={display}
        maxLength={18}
        pattern="^\+7 \d{3} \d{3}-\d{2}-\d{2}$"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={(event) => {
          const digits = getRuPhoneDigits(event.target.value);
          if (digits.length <= 1) {
            onChange("+7 ");
          } else {
            onChange(formatRuPhoneInput(digits));
          }
          onBlur?.(event);
        }}
        aria-invalid={
          rest["aria-invalid"] ??
          (value.trim().length > 3 && !isValidRuPhone(value)
            ? true
            : undefined)
        }
      />
    );
  },
);

export default PhoneField;
