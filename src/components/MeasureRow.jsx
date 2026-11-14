// One scored measure as a ruled row: name and hint, a bar, then the value.
export default function MeasureRow({ label, value, hint }) {
  return (
    <div className="measure">
      <div>
        <span className="measure__label">{label}</span>
        <span className="measure__hint">{hint}</span>
      </div>
      <div className="measure__track" aria-hidden="true">
        <div className="measure__fill" style={{ width: `${value}%` }} />
      </div>
      <span className="measure__value">{value}</span>
    </div>
  );
}
