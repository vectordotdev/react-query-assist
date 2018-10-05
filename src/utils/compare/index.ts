import escape from "escape-string-regexp";

/**
 * case-insensitive comparison
 */
export function compare(partialValue, fullValue) {
  return new RegExp(`^${escape(partialValue || "")}$`, "i")
    .test(fullValue || "");
}

/**
 * case-insensitive comparison (fuzzy)
 */
export function compareFuzzy(partialValue, fullValue) {
  return new RegExp(escape(partialValue || ""), "i")
    .test(fullValue || "");
}
