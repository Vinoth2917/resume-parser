// Finds the matched terms inside the original résumé text, so they can be highlighted in place.
import { escapeRegExp } from "./text";

// Returns [{ text, hit }] pieces in reading order. `hit` is true for a matched term.
export function markTerms(text, terms) {
  if (terms.length === 0) return [{ text, hit: false }];

  // Longest first, so "machine learning" wins over a shorter term inside it.
  const alternatives = [...terms]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");
  const pattern = new RegExp(`(?<![a-z0-9])(?:${alternatives})(?![a-z0-9])`, "gi");

  const pieces = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) pieces.push({ text: text.slice(last, match.index), hit: false });
    pieces.push({ text: match[0], hit: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) pieces.push({ text: text.slice(last), hit: false });
  return pieces;
}
