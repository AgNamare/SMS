/**
 * Converts a date/time string to a Unix timestamp (seconds).
 * Equivalent to PHP's strtotime().
 *
 * @param dateStr - Date string (e.g., "2025-10-12 08:00:00")
 * @returns number - Unix timestamp in seconds
 */
export function toTimestamp(dateStr: string): number {
  const timestampMs = Date.parse(dateStr);
  if (isNaN(timestampMs)) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  return Math.floor(timestampMs / 1000);
}

/**
 * Converts a Unix timestamp (seconds) back to a Date object
 *
 * @param timestamp - Unix timestamp in seconds
 * @returns Date object
 */
export function fromTimestamp(timestamp: number): Date {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

/**
 * Converts a Unix timestamp (seconds) to a formatted string
 *
 * @param timestamp - Unix timestamp in seconds
 * @param options - Intl.DateTimeFormat options (optional)
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export function formatTimestamp(
  timestamp: number,
  options?: Intl.DateTimeFormatOptions,
  locale: string = "en-US"
): string {
  const date = fromTimestamp(timestamp);
  return date.toLocaleString(locale, options);
}

/**
 * Returns the current Unix timestamp in seconds
 */
export function nowTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}
