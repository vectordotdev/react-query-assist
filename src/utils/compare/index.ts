import * as escape from "escape-string-regexp";

/**
 * case-insensitive comparison
 */
export function compare(partialValue?: string, fullValue?: string) {
  return new RegExp(`^${escape(partialValue || "")}$`, "i")
    .test(fullValue || "");
}

/**
 * case-insensitive comparison (fuzzy)
 */
export function compareFuzzy(partialValue?: string, fullValue?: string) {
  return new RegExp(escape(partialValue || ""), "i")
    .test(fullValue || "");
}
