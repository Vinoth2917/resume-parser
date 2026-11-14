import StepHeading from "./StepHeading";

// A controlled textarea: React holds the text, and onChange passes each edit up to the parent.
export default function JobDescription({ value, onChange }) {
  return (
    <div>
      <StepHeading>2. Job description</StepHeading>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job posting here..."
        className="h-72 w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 p-5 text-sm leading-relaxed placeholder:text-slate-600 focus:border-indigo-400 focus:outline-none"
      />
    </div>
  );
}
