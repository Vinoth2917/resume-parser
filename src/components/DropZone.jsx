import { useDropZone } from "../hooks/useDropZone";

// Click-to-browse or drag-and-drop target for the résumé file.
// Wrapping the input in a label means a click anywhere on the box opens the file picker.
export default function DropZone({ fileLabel, onFile }) {
  const { isDragging, handlers } = useDropZone(onFile);

  return (
    <label
      htmlFor="resume-file"
      className={`dropzone${isDragging ? " is-dragging" : ""}`}
      {...handlers}
    >
      <input
        id="resume-file"
        type="file"
        accept=".pdf,.docx,.txt,.md"
        className="visually-hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) onFile(file);
        }}
      />
      <span className="dropzone__title">Drop your résumé here</span>
      <span className="dropzone__hint">
        Or choose a file. PDF, Word (.docx), text or Markdown. It is read in your browser and not uploaded.
      </span>
      <span className="dropzone__file">{fileLabel}</span>
    </label>
  );
}
