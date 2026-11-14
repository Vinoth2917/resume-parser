import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SectionHeading from "./components/SectionHeading";
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
      <main className="page">
        <Hero />

        <section id="check" className="check">
          <div>
            <SectionHeading title="Your résumé" help="PDF, Word (.docx), text or Markdown." />
            <DropZone fileLabel={resume.fileLabel} onFile={resume.loadFile} />
          </div>
          <div>
            <SectionHeading title="The job posting" help="Paste all of it. Short posts give weak scores." />
            <JobDescription value={jd} onChange={setJd} />
          </div>
        </section>

        <div className="check__action">
          <button type="button" className="button" onClick={() => scorecard.score(jd)}>
            Score my résumé
          </button>
          <ErrorMessage message={error} />
        </div>

        {scorecard.result && <Scorecard result={scorecard.result} />}
      </main>
    </>
  );
}
