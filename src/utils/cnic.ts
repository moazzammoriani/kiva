export function normalizeCnic(value: unknown): string {
  return String(value ?? "").replace(/\D/g, "");
}

export function formatCnic(value: unknown): string {
  const digits = normalizeCnic(value).slice(0, 13);

  if (digits.length <= 5) return digits;
  if (digits.length <= 12) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}
