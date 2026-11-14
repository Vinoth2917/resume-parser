import Card from "./Card";

// One score with its label, a progress bar, and a short explanation.
export default function MetricCard({ label, value, hint }) {
  return (
    <Card className="p-5">
      <div className="flex items-baseline justify-between">
        <span className="font-medium">{label}</span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-indigo-400" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-3 text-xs text-slate-500">{hint}</p>
    </Card>
  );
}
