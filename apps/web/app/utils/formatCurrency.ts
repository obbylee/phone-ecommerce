/**
 * Formats a number as US Dollar currency, with "US " prefix.
 *
 * @param {number} amount The numeric value to format.
 * @param {string} [locale='en-US'] The locale to use for formatting. Defaults to 'en-US'.
 * @returns {string} The formatted currency string (e.g., "US $1,234.56").
 */
export function formatCurrency(
  amount: number,
  locale: string = "en-US"
): string {
  // Format the currency normally first
  const formattedCurrency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(amount);

  // Prepend "US " to the formatted string
  return `${formattedCurrency}`;
}
