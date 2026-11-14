// A controlled textarea: React holds the text, and onChange passes each edit up to the parent.
export default function JobDescription({ value, onChange }) {
  return (
    <textarea
      className="jd"
      aria-label="Job posting"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste the whole posting, from the job title to the last requirement."
    />
  );
}
