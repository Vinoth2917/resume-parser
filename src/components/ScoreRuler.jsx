// The overall score drawn as a measuring scale, with a marker at the score.
// The number is printed too, so the score never depends on reading the position.
export default function ScoreRuler({ score }) {
  return (
    <div className="ruler" role="img" aria-label={`Score: ${score} out of 100`}>
      <span className="ruler__value" style={{ left: `${score}%` }} aria-hidden="true">
        {score}
      </span>
      <div className="ruler__scale" aria-hidden="true">
        <span className="ruler__marker" style={{ left: `${score}%` }} />
      </div>
      <div className="ruler__ends" aria-hidden="true">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}
