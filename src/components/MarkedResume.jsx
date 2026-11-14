import { markTerms } from "../lib/mark";

// The full résumé text, with every matched term highlighted where it appears.
export default function MarkedResume({ text, terms }) {
  const pieces = markTerms(text, terms);

  return (
    <div className="sheet" role="region" aria-label="Your résumé with matches marked" tabIndex={0}>
      <div className="sheet__text">
        {pieces.map((piece, i) =>
          piece.hit ? (
            <mark key={i} className="hl">
              {piece.text}
            </mark>
          ) : (
            <span key={i}>{piece.text}</span>
          )
        )}
      </div>
    </div>
  );
}
