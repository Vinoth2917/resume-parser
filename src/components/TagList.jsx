import Card from "./Card";

// A titled group of pill-shaped tags, such as matched or missing keywords.
export default function TagList({ title, titleClassName, items, chipClassName, emptyText }) {
  return (
    <Card className="p-6">
      <h3 className={`mb-3 font-semibold ${titleClassName}`}>{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span key={item} className={`rounded-full px-3 py-1 text-xs ${chipClassName}`}>
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500">{emptyText}</p>
        )}
      </div>
    </Card>
  );
}
