import Card from "./Card";

// A titled bulleted list. Shows emptyText as a single item when there is nothing to list.
export default function FeedbackList({ title, titleClassName, items, emptyText }) {
  const list = items.length ? items : [emptyText];
  return (
    <Card className="p-6">
      <h3 className={`mb-3 font-semibold ${titleClassName}`}>{title}</h3>
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
        {list.map((item) => (
          <li key={item} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
