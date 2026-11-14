import { useState } from "react";
import { analyze } from "../lib/analyze";

// Runs the comparison when asked, and keeps the last result on screen if a later attempt fails.
export function useScorecard(resumeText) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function score(jd) {
    setError("");
    if (!resumeText) {
      setError("Drop in your resume first.");
      return;
    }
    const trimmed = jd.trim();
    if (trimmed.length < 80) {
      setError("Paste the full job description. A sentence or two is not enough to score against.");
      return;
    }
    try {
      setResult({ ...analyze(resumeText, trimmed), resumeText });
    } catch (err) {
      setError(err.message);
    }
  }

  return { result, error, score };
}
