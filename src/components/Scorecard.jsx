import { useEffect, useRef } from "react";
import ScoreRuler from "./ScoreRuler";
import MeasureRow from "./MeasureRow";
import FeedbackList from "./FeedbackList";
import TermList from "./TermList";
import MarkedResume from "./MarkedResume";

// The review, read top to bottom: verdict, score, measures, notes, keywords, then the marked résumé.
// It scrolls itself into view each time a new result arrives.
export default function Scorecard({ result }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  return (
    <section ref={ref} className="results" aria-labelledby="verdict">
      <h2 id="verdict" className="verdict">
        {result.verdict}
      </h2>

      <ScoreRuler score={result.overall} />

      <div className="measures">
        <MeasureRow
          label="Keyword match"
          value={result.keywordScore}
          hint="Share of the posting's key terms found in your résumé, weighted by importance."
        />
        <MeasureRow
          label="Skills match"
          value={result.skillScore}
          hint="Share of the named technical skills you mention."
        />
        <MeasureRow
          label="Structure"
          value={result.structureScore}
          hint="Standard sections present and a sensible length."
        />
        <MeasureRow
          label="Impact"
          value={result.impactScore}
          hint="How many of your bullet points include a number or result."
        />
      </div>

      <div className="columns">
        <FeedbackList
          title="What works"
          items={result.strengths}
          emptyText="Nothing stands out yet. Add more detail that matches the posting."
        />
        <FeedbackList
          title="What to fix"
          items={result.weaknesses}
          emptyText="No major weaknesses found."
        />
      </div>

      <div className="columns">
        <TermList
          title="In your résumé"
          variant="found"
          items={result.matched}
          emptyText="No key terms matched."
        />
        <TermList
          title="Not in your résumé"
          variant="missing"
          items={result.missing}
          emptyText="Every key term is in your résumé."
        />
      </div>

      <section aria-labelledby="marked-title">
        <h3 id="marked-title" className="subhead">
          Your résumé, marked
        </h3>
        <MarkedResume text={result.resumeText} terms={result.matched} />
      </section>
    </section>
  );
}
