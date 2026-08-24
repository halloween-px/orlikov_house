"use client";

import {
  forwardRef,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from "react";
import { sanitizeComment } from "@/lib/form-input";

export type TextAreaFieldProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange" | "value"
> & {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField(
    { value, onChange, maxLength = 1000, className, ...rest },
    ref,
  ) {
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(sanitizeComment(event.target.value, maxLength));
    };

    return (
      <textarea
        {...rest}
        ref={ref}
        className={className}
        value={value}
        maxLength={maxLength}
        onChange={handleChange}
      />
    );
  },
);

export default TextAreaField;
