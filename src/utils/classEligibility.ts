export const OUTSIDE_ELIGIBLE_RANGE = "Outside eligible class range";

const CLASS_AGE_RANGES = [
  ["Play Group", 1.5, 2.5],
  ["Pre-Nursery", 2.5, 3.5],
  ["Nursery", 3.5, 4.5],
  ["Prep", 4.5, 5.5],
  ["I", 5.5, 6.5],
  ["II", 6.5, 7.5],
  ["III", 7.5, 8.5],
  ["IV", 8.5, 9.5],
  ["V", 9.5, 10.5],
] as const;

export function currentEligibilityYear(): number {
  return Number(
    new Intl.DateTimeFormat("en", {
      year: "numeric",
      timeZone: "Asia/Karachi",
    }).format(new Date()),
  );
}

export function calculateEligibleClass(
  dob: string,
  eligibilityYear = currentEligibilityYear(),
): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!match) return "";

  const birthUtc = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const cutoffUtc = Date.UTC(eligibilityYear, 6, 1);
  const decimalAge = (cutoffUtc - birthUtc) / 86_400_000 / 365.2425;

  for (const [className, minimumAge, maximumAge] of CLASS_AGE_RANGES) {
    if (decimalAge >= minimumAge && decimalAge < maximumAge) {
      return className;
    }
  }
  return OUTSIDE_ELIGIBLE_RANGE;
}
