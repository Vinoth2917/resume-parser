import { useState } from "react";
import { extractText } from "../lib/readFile";

// Owns the uploaded resume: its extracted text, the label under the drop zone, and any read error.
export function useResumeFile() {
  const [resumeText, setResumeText] = useState("");
  const [fileLabel, setFileLabel] = useState("No file loaded");
  const [error, setError] = useState("");

  async function loadFile(file) {
    setError("");
    setFileLabel(`Reading ${file.name}...`);
    try {
      const text = await extractText(file);
      if (!text.trim()) {
        throw new Error("No text found in that file. If it is a scanned PDF, it needs OCR first.");
      }
      const words = text.split(/\s+/).filter(Boolean).length;
      setResumeText(text);
      setFileLabel(`${file.name} (${words} words)`);
    } catch (err) {
      setResumeText("");
      setFileLabel("No file loaded");
      setError(err.message);
    }
  }

  return { resumeText, fileLabel, error, loadFile };
}
