
/**
 * Combines multiple class names into a single string
 * Converted from TypeScript clsx and tailwind-merge utility
 */
export function cn(...inputs) {
  return inputs
    .filter(Boolean)
    .join(" ")
    .trim()
    .replace(/\s+/g, " "); // Replace multiple spaces with a single space
}
