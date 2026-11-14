import StepHeading from "./StepHeading";
import { useDropZone } from "../hooks/useDropZone";

// Click-to-browse or drag-and-drop target for the resume file.
export default function DropZone({ fileLabel, onFile }) {
  const { isDragging, handlers } = useDropZone(onFile);

  return (
    <div>
      <StepHeading>1. Your resume</StepHeading>
      <label
        htmlFor="resume-file"
        {...handlers}
        className={`flex h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-slate-900 p-6 text-center transition hover:border-indigo-400 ${
          isDragging ? "border-indigo-400" : "border-slate-700"
        }`}
      >
        <input
          id="resume-file"
          type="file"
          accept=".pdf,.docx,.txt,.md"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) onFile(file);
          }}
        />
        <svg className="mb-4 h-12 w-12 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        <p className="font-medium">Drag and drop your resume here</p>
        <p className="mt-1 text-sm text-slate-500">or click to browse. PDF, DOCX, TXT or MD.</p>
        <p className="mt-4 text-sm text-indigo-300">{fileLabel}</p>
      </label>
    </div>
  );
}
