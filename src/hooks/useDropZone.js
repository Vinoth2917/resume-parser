import { useState } from "react";

// Drag-and-drop state for any drop target. Pass the callback for a dropped file,
// spread `handlers` onto the element, and use `isDragging` to highlight it.
export function useDropZone(onFile) {
  const [isDragging, setIsDragging] = useState(false);

  const handlers = {
    onDragOver: (e) => {
      e.preventDefault(); // without this, the browser refuses the drop
      setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop: (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
  };

  return { isDragging, handlers };
}
