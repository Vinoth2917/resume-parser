// Pure text helpers. No React, no DOM, so they are easy to test on their own.

export function normalize(text) {
  return text.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, " ");
}

export function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// True if `term` appears as a whole word or phrase, so "go" does not match "good".
export function containsTerm(haystack, term) {
  const re = new RegExp(`(?<![a-z0-9])${escapeRegExp(term)}(?![a-z0-9])`);
  return re.test(haystack);
}

export function pct(part, whole) {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}
