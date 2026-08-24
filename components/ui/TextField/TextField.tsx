"use client";

import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { sanitizePersonName, sanitizeSafeText } from "@/lib/form-input";

type TextFieldMode = "name" | "safe";

export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value"
> & {
  value: string;
  onChange: (value: string) => void;
  mode?: TextFieldMode;
  maxLength?: number;
};

function sanitize(mode: TextFieldMode, value: string, maxLength: number) {
  if (mode === "name") return sanitizePersonName(value, maxLength);
  return sanitizeSafeText(value, maxLength);
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      value,
      onChange,
      mode = "safe",
      maxLength = mode === "name" ? 80 : 200,
      className,
      ...rest
    },
    ref,
  ) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(sanitize(mode, event.target.value, maxLength));
    };

    return (
      <input
        {...rest}
        ref={ref}
        type="text"
        className={className}
        value={value}
        maxLength={maxLength}
        onChange={handleChange}
        inputMode={mode === "name" ? "text" : rest.inputMode}
        autoComplete={rest.autoComplete ?? (mode === "name" ? "name" : "off")}
      />
    );
  },
);

export default TextField;
