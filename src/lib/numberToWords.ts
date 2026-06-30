/**
 * Converts a number to its Indian English word representation.
 * E.g., 1234.56 → "One Thousand Two Hundred Thirty Four Rupees and Fifty Six Paise Only"
 */

const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function convertBelowThousand(n: number): string {
  if (n === 0) return "";

  if (n < 20) return ones[n];

  if (n < 100) {
    const t = tens[Math.floor(n / 10)];
    const o = ones[n % 10];
    return o ? `${t} ${o}` : t;
  }

  const h = ones[Math.floor(n / 100)];
  const remainder = n % 100;
  const rest = convertBelowThousand(remainder);
  return rest ? `${h} Hundred ${rest}` : `${h} Hundred`;
}

/**
 * Converts an integer to Indian numbering words.
 * Indian system: ones, thousands, lakhs, crores
 */
function integerToWords(num: number): string {
  if (num === 0) return "Zero";

  let n = Math.floor(Math.abs(num));
  const parts: string[] = [];

  // Crores (10,000,000)
  if (n >= 10000000) {
    const crores = Math.floor(n / 10000000);
    parts.push(`${convertBelowThousand(crores)} Crore`);
    n %= 10000000;
  }

  // Lakhs (100,000)
  if (n >= 100000) {
    const lakhs = Math.floor(n / 100000);
    parts.push(`${convertBelowThousand(lakhs)} Lakh`);
    n %= 100000;
  }

  // Thousands (1,000)
  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    parts.push(`${convertBelowThousand(thousands)} Thousand`);
    n %= 1000;
  }

  // Hundreds, tens, ones
  if (n > 0) {
    parts.push(convertBelowThousand(n));
  }

  return parts.join(" ");
}

export function numberToWords(amount: number): string {
  const rupees = Math.floor(Math.abs(amount));
  const paise = Math.round((Math.abs(amount) - rupees) * 100);

  let result = integerToWords(rupees) + " Rupees";

  if (paise > 0) {
    result += ` and ${integerToWords(paise)} Paise`;
  }

  result += " Only";

  return result;
}
