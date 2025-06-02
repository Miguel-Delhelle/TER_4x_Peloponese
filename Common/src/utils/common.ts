import { ConsoleOutputType } from "../types/common";
/**
 * Formats the current date according to the specified format string.
 * 
 * @param {Date} [date] (Optional) The date you'd like to format. If not specified, use the current date.
 * @param {string} [format] (Optional) A string representing the format of the date output.
 * 
 * If not specified, use the format: `YYYY/MM/DD-hh:mm:ss.ms`
 * 
 * Date tokens:
 * - `YYYY`:  Full year (e.g., 2025)
 * - `MM`:    Month, zero-padded (01-12)
 * - `DD`:    Day of month, zero-padded (01-31)
 * 
 * Time tokens:
 * - `hh`:    Hours, zero-padded (00-23)
 * - `mm`:    Minutes, zero-padded (00-59)
 * - `ss`:    Seconds, zero-padded (00-59)
 * - `ms`:    Milliseconds (000-999)
 * 
 * @returns {string} The formatted date string
 * 
 * @example
 * ```javascript
 * getDate() return
 *   // "2025/05/31-14:30:45.123" (default format)
 * getDate("DD/MM/YYYY") return
 *   // "31/05/2025"
 * getDate("hh:mm:ss") return
 *   // "14:30:45"
 * getDate("programm: DD/MM/YYYY at hh:mm") return
 *   // "programm: 31/05/2025 at 14:30"
 * ```
 */
export function getDate(date: Date = new Date(), format: string = "YYYY/MM/DD-hh:mm:ss.ms"): string {
  let config = {
    YYYY: date.getFullYear().toString(),
    MM: (1+date.getMonth()).toString().padStart(2,'0'),
    DD: date.getDate().toString().padStart(2,'0'),
    hh: date.getHours().toString().padStart(2,'0'),
    mm: date.getMinutes().toString().padStart(2,'0'),
    ss: date.getSeconds().toString().padStart(2,'0'),
    ms: date.getMilliseconds().toString().padEnd(3, '0'),
  }
  Object.entries(config).forEach(([key, value]) => {
    format = format.replace(
      new RegExp(`(?<![a-zA-Z0-9])${key}(?![a-zA-Z0-9])`, 'g'),
      value
    );
  });
  return format;
}

/**
 * 
 * @param {string} [msg] The message to print in the console 
 * @param {ConsoleOutputType} [type] (Optional) The type of output used to print the message in the console.
 * 
 * Possible values:
 * - `log`: default output 
 * - `warn`: warning icon + orange color output
 * - `error`: error icon + red color output
 * - `info`: information icon + default color output
 * 
 * if not specified, use `log`
 */
export function printMessage(msg: string, type: ConsoleOutputType = 'log'): void {
  (console as any)[type](`%c${getDate()}%c -> %c${msg}`,'color: rgb(128,128,128)','color: white');
}