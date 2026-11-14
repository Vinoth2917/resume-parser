// A titled list of plain-language notes, with a hairline between each one.
export default function FeedbackList({ title, items, emptyText }) {
  const list = items.length ? items : [emptyText];

  return (
    <div>
      <h3 className="subhead">{title}</h3>
      <ul className="notes">
        {list.map((item) => (
          <li key={item} className="notes__item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
