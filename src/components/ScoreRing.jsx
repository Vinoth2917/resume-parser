// Picks a colour from the score: green for strong, amber for partial, red for weak.
function colorFor(score) {
  if (score >= 75) return "#34d399";
  if (score >= 50) return "#fbbf24";
  return "#f87171";
}

// A circular gauge. The conic-gradient fills the ring to the score's share of 360 degrees.
export default function ScoreRing({ score }) {
  return (
    <div
      className="flex h-40 w-40 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(${colorFor(score)} ${score * 3.6}deg, #1e293b 0deg)` }}
    >
      <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-slate-900">
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-xs text-slate-500">out of 100</span>
      </div>
    </div>
  );
}
