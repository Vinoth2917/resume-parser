// A dark rounded panel. Pass extra classes (padding, layout) through className.
export default function Card({ className = "", children }) {
  return <div className={`rounded-2xl border border-slate-800 bg-slate-900 ${className}`}>{children}</div>;
}
