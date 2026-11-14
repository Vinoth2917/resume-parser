import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import DropZone from "./components/DropZone";
import JobDescription from "./components/JobDescription";
import ErrorMessage from "./components/ErrorMessage";
import Scorecard from "./components/Scorecard";
import { useResumeFile } from "./hooks/useResumeFile";
import { useScorecard } from "./hooks/useScorecard";

// Wires the page together. The hooks hold the logic, and the components only draw it.
export default function App() {
  const [jd, setJd] = useState("");
  const resume = useResumeFile();
  const scorecard = useScorecard(resume.resumeText);
  const error = scorecard.error || resume.error;

  return (
    <>
      <Header />
      <main>
        <Hero />

        <section id="tool" className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
          <DropZone fileLabel={resume.fileLabel} onFile={resume.loadFile} />
          <JobDescription value={jd} onChange={setJd} />
        </section>

        <div className="mx-auto max-w-6xl px-6 py-8 text-center">
          <button
            type="button"
            onClick={() => scorecard.score(jd)}
            className="rounded-xl bg-indigo-500 px-8 py-3 font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-400"
          >
            Score my resume
          </button>
          <ErrorMessage message={error} />
        </div>

        {scorecard.result && <Scorecard result={scorecard.result} />}
      </main>
    </>
  );
}
