export const PHONE_INPUT_PATTERN = "(?:03[0-9]{9}|(?:\\+92|92)3[0-9]{9})";
export const PHONE_ERROR_MESSAGE =
  "Enter a valid Pakistan mobile number, e.g. 03001234567.";

const SEPARATOR_PATTERN = /[\s().-]+/g;

export function cleanPhoneInputValue(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(SEPARATOR_PATTERN, "");
}

export function normalizePakistanMobile(value: unknown): string | null {
  const cleaned = cleanPhoneInputValue(value);

  if (/^03[0-9]{9}$/.test(cleaned)) {
    return cleaned;
  }

  if (/^\+923[0-9]{9}$/.test(cleaned)) {
    return `0${cleaned.slice(3)}`;
  }

  if (/^923[0-9]{9}$/.test(cleaned)) {
    return `0${cleaned.slice(2)}`;
  }

  return null;
}

export function validatePakistanMobile(
  value: unknown,
  options: { required?: boolean } = {},
): { valid: boolean; normalized: string; message: string } {
  const cleaned = cleanPhoneInputValue(value);

  if (!cleaned) {
    return options.required
      ? { valid: false, normalized: "", message: PHONE_ERROR_MESSAGE }
      : { valid: true, normalized: "", message: "" };
  }

  const normalized = normalizePakistanMobile(cleaned);
  if (!normalized) {
    return { valid: false, normalized: cleaned, message: PHONE_ERROR_MESSAGE };
  }

  return { valid: true, normalized, message: "" };
}

export function setupPakistanMobileField(field: HTMLInputElement) {
  field.addEventListener("input", () => {
    setPakistanMobileFieldValidity(field);
  });

  field.addEventListener("blur", () => {
    normalizePakistanMobileField(field);
  });
}

export function normalizePakistanMobileField(field: HTMLInputElement): boolean {
  const result = setPakistanMobileFieldValidity(field);
  if (result.valid) {
    field.value = result.normalized;
  }
  return result.valid;
}

function setPakistanMobileFieldValidity(
  field: HTMLInputElement,
): { valid: boolean; normalized: string } {
  field.value = cleanPhoneInputValue(field.value);
  const result = validatePakistanMobile(field.value, {
    required: field.required,
  });
  field.setCustomValidity(result.valid ? "" : result.message);
  return { valid: result.valid, normalized: result.normalized };
}
