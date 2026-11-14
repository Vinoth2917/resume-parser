// Keywords as plain words. Found terms get the highlighter; missing terms get the red wave.
// Colour is never the only signal: the wave and the separate list carry the meaning too.
export default function TermList({ title, variant, items, emptyText }) {
  const className = variant === "found" ? "hl" : "term--missing";

  return (
    <div>
      <h3 className="subhead">{title}</h3>
      {items.length ? (
        <ul className="terms">
          {items.map((term) => (
            <li key={term} className={className}>
              {term}
            </li>
          ))}
        </ul>
      ) : (
        <p className="terms__empty">{emptyText}</p>
      )}
    </div>
  );
}
