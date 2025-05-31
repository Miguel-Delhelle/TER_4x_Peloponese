/**
 * Formats the current date according to the specified format string.
 * 
 * @param format - A string representing the format of the date output. 
 * Available format tokens:
 * - `YYYY`: year (4 digits)
 * - `MM`: month (2 digits, zero-padded)
 * - `DD`: day of month (2 digits, zero-padded)
 * - `hh`: hour (2 digits, zero-padded)
 * - `mm`: minutes (2 digits, zero-padded)
 * - `ss`: seconds (2 digits, zero-padded)
 * - `ms`: milliseconds (1-3 digits)
 * 
 * @returns The formatted date string
 * 
 * @example
 * ```javascript
 * getDate("DD/MM/YYYY")      // "31/05/2025"
 * getDate("hh:mm:ss")        // "14:30:45"
 * getDate()                  // "2025/05/31-14:30:45.123" (default format)
 * ```
 */
export function getDate(format?: string): string {
  let date: Date = new Date();
  let config = {
    YYYY: date.getFullYear().toString(),
    MM: (1+date.getMonth()).toString().padStart(2,'0'),
    DD: date.getDate().toString().padStart(2,'0'),
    hh: date.getHours().toString().padStart(2,'0'),
    mm: date.getMinutes().toString().padStart(2,'0'),
    ss: date.getSeconds().toString().padStart(2,'0'),
    ms: date.getMilliseconds().toString(),
  }
  if(!format)
    format = "YYYY/MM/DD-hh:mm:ss.ms";
  Object.entries(config).forEach(([key, value]) => {
    format = format!.replace(
      new RegExp(`(?<![a-zA-Z0-9])${key}(?![a-zA-Z0-9])`, 'g'),
      value
    );
  });
  return format;
}