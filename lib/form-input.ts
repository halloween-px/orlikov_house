/** Клиентская и серверная нормализация полей форм заявок. */

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Имя: буквы, пробел, дефис, апостроф. Без HTML и спецсимволов. */
export function sanitizePersonName(value: string, maxLength = 80) {
  return value
    .replace(CONTROL_CHARS, "")
    .replace(/[<>{}[\]\\/`$^|=+*~]/g, "")
    .replace(/[^\p{L}\p{M}\s\-'.]/gu, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, maxLength);
}

/** Комментарий: без HTML-скобок и управляющих символов. */
export function sanitizeComment(value: string, maxLength = 1000) {
  return value
    .replace(CONTROL_CHARS, "")
    .replace(/[<>]/g, "")
    .replace(/\u2028|\u2029/g, " ")
    .slice(0, maxLength);
}

/** Общий безопасный текст (короткие поля). */
export function sanitizeSafeText(value: string, maxLength = 200) {
  return value
    .replace(CONTROL_CHARS, "")
    .replace(/[<>{}[\]\\/`$]/g, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, maxLength);
}

/**
 * Маска российского номера: +7 999 999-99-99
 * Принимает ввод с 8/7/без кода — приводит к +7.
 */
export function formatRuPhoneInput(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }

  if (!digits.startsWith("7")) {
    digits = `7${digits}`;
  }

  digits = digits.slice(0, 11);
  const local = digits.slice(1);

  let next = "+7";
  if (local.length > 0) next += ` ${local.slice(0, 3)}`;
  if (local.length > 3) next += ` ${local.slice(3, 6)}`;
  if (local.length > 6) next += `-${local.slice(6, 8)}`;
  if (local.length > 8) next += `-${local.slice(8, 10)}`;

  return next;
}

export function getRuPhoneDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith("7") && digits.length > 0) digits = `7${digits}`;
  return digits.slice(0, 11);
}

export function isValidRuPhone(value: string) {
  const digits = getRuPhoneDigits(value);
  return digits.length === 11 && digits.startsWith("7");
}

export function toE164RuPhone(value: string) {
  const digits = getRuPhoneDigits(value);
  return digits.length === 11 ? `+${digits}` : "";
}
