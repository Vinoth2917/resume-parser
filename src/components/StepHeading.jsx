// The small uppercase label above each input ("1. Your resume", "2. Job description").
export default function StepHeading({ children }) {
  return <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">{children}</h2>;
}
