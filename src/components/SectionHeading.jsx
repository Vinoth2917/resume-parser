// A section title with an optional line of help under it.
export default function SectionHeading({ title, help }) {
  return (
    <div className="section-heading">
      <h2 className="section-heading__title">{title}</h2>
      {help && <p className="section-heading__help">{help}</p>}
    </div>
  );
}
