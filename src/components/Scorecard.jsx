import { useEffect, useRef } from "react";
import Card from "./Card";
import ScoreRing from "./ScoreRing";
import MetricCard from "./MetricCard";
import FeedbackList from "./FeedbackList";
import TagList from "./TagList";

// The results area. It scrolls itself into view each time a new result arrives.
export default function Scorecard({ result }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  return (
    <section ref={ref} id="results" className="mx-auto max-w-6xl space-y-6 px-6 pb-24">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-8 md:col-span-1">
          <ScoreRing score={result.overall} />
          <p className="mt-6 text-center text-sm text-slate-300">{result.verdict}</p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
          <MetricCard
            label="Keyword match"
            value={result.keywordScore}
            hint="Share of the posting's key terms found in your resume, weighted by importance."
          />
          <MetricCard
            label="Skills match"
            value={result.skillScore}
            hint="Share of the named technical skills you mention."
          />
          <MetricCard
            label="Structure"
            value={result.structureScore}
            hint="Standard sections present and a sensible length."
          />
          <MetricCard
            label="Impact"
            value={result.impactScore}
            hint="How many of your bullet points include a number or result."
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FeedbackList
          title="Strengths"
          titleClassName="text-emerald-400"
          items={result.strengths}
          emptyText="Nothing stands out yet. Add more detail that matches the posting."
        />
        <FeedbackList
          title="Weaknesses"
          titleClassName="text-rose-400"
          items={result.weaknesses}
          emptyText="No major weaknesses found."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TagList
          title="Found in your resume"
          titleClassName="text-emerald-400"
          items={result.matched}
          chipClassName="bg-emerald-500/15 text-emerald-300"
          emptyText="No key terms matched."
        />
        <TagList
          title="Missing from your resume"
          titleClassName="text-rose-400"
          items={result.missing}
          chipClassName="bg-rose-500/15 text-rose-300"
          emptyText="Nothing missing. Nice."
        />
      </div>
    </section>
  );
}
