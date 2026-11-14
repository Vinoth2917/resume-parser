// Turns an uploaded file into plain text. PDF and DOCX readers come from CDN scripts in index.html.

const PDF_WORKER_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function getPdfLib() {
  if (!window.pdfjsLib) throw new Error("The PDF reader did not load. Check your internet connection.");
  // pdf.js parses PDFs on a background thread, so it needs to know where its worker file is.
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
  return window.pdfjsLib;
}

async function readPdf(buffer) {
  const pdfjsLib = getPdfLib();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  let text = "";
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    // Start a new line whenever the vertical position changes, so headings stay on their own line.
    let line = "";
    let lastY = null;
    for (const item of content.items) {
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        text += line.trim() + "\n";
        line = "";
      }
      line += item.str + " ";
      lastY = y;
    }
    text += line.trim() + "\n";
  }
  return text;
}

export async function extractText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return readPdf(await file.arrayBuffer());
  if (name.endsWith(".docx")) {
    if (!window.mammoth) throw new Error("The Word reader did not load. Check your internet connection.");
    const { value } = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return value;
  }
  if (name.endsWith(".txt") || name.endsWith(".md")) return file.text();
  throw new Error("Please use a PDF, DOCX, TXT or MD file. For old .doc files, save as .docx first.");
}
