// Kept apart from lib/content.ts (which reads the filesystem) so Client Components can use them.

// Jekyll's date_to_long_string with ordinal, e.g. "March 19th, 2020".
export function formatLongDate(date: Date): string {
  const day = date.getUTCDate();
  const suffix =
    day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  const month = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  return `${month} ${day}${suffix}, ${date.getUTCFullYear()}`;
}

// Jekyll's date_to_string, e.g. "19 Mar 2020".
export function formatShortDate(date: Date): string {
  const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${date.getUTCDate()} ${month} ${date.getUTCFullYear()}`;
}
