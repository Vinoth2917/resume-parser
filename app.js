// Resume Match: reads a resume, compares it with a job description,
// and renders a scorecard. Everything runs in the browser.

// Tell pdf.js where its worker file lives (it parses PDFs on a background thread).
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

// Common English words and generic job-post filler. These are never keywords.
const STOPWORDS = new Set(`
  a an and are as at be but by for from has have he in is it its of on or that the
  this to was were will with you your we our they their them i me my who which what
  when where how not no can could should would may might must about above after
  again all also am any because been before being below between both do does doing
  down during each few further had having here if into just more most other out over
  own same so some such than too under until up very via while within without etc
  role job candidate ability strong good great new using use used work working works
  experience experienced years year including include includes preferred plus required
  requirements responsibilities responsibility looking join team teams company help
  helps across skills skill knowledge understanding familiar ideal opportunity
  develop develops developing build builds ensure support provide provides manage
  deliver drive create collaborate degree bachelor minimum least related etc
  able make take per based well both high level ability
`.split(/\s+/).filter(Boolean));

// Technical skills we recognise as phrases, so "node.js" or "machine learning" count as one thing.
const SKILLS = [
  "javascript", "typescript", "react", "next.js", "node.js", "express", "vue", "angular",
  "html", "css", "tailwind", "python", "java", "c#", "c++", "go", "rust", "sql",
  "postgresql", "mysql", "mongodb", "redis", "aws", "azure", "gcp", "docker",
  "kubernetes", "terraform", "ci/cd", "git", "rest", "graphql", "testing", "jest",
  "cypress", "linux", "agile", "scrum", "machine learning", "data analysis", "excel",
  "power bi", "tableau", "figma", "accessibility", "system design", "microservices",
  "api", "leadership", "project management",
];

// Headings we look for in the resume, matched against short lines only.
const SECTION_PATTERNS = {
  Experience: /\b(work\s+)?experience|employment history\b/i,
  Education: /\beducation|academic\b/i,
  Skills: /\bskills|technical skills|core competencies|technologies\b/i,
  Projects: /\bprojects\b/i,
};

// ---------- Text helpers ----------

function normalize(text) {
  return text.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, " ");
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// True if `term` appears as a whole word or phrase, so "go" does not match "good".
function containsTerm(haystack, term) {
  const re = new RegExp(`(?<![a-z0-9])${escapeRegExp(term)}(?![a-z0-9])`);
  return re.test(haystack);
}

function pct(part, whole) {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}

// ---------- Scoring ----------

// Returns [term, weight] pairs, most important first.
// Known skills weigh 3. Other words weigh 1 to 3 depending on how often the posting repeats them.
function extractJdTerms(jd) {
  const norm = normalize(jd);
  const weights = new Map();

  for (const skill of SKILLS) {
    if (containsTerm(norm, skill)) weights.set(skill, 3);
  }

  const counts = new Map();
  for (const raw of norm.match(/[a-z0-9][a-z0-9+#./-]*/g) || []) {
    const word = raw.replace(/[./-]+$/, "");
    if (word.length < 3 || STOPWORDS.has(word) || /^\d+$/.test(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  for (const [word, count] of counts) {
    if (!weights.has(word)) weights.set(word, Math.min(3, count));
  }

  return [...weights.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25);
}

function analyze(resume, jd) {
  const r = normalize(resume);
  const jdNorm = normalize(jd);
  const terms = extractJdTerms(jd);
  if (terms.length === 0) {
    throw new Error("The job description has no usable keywords. Paste more of the posting.");
  }

  // Keyword match, weighted by importance.
  const matched = [];
  const missing = [];
  let total = 0;
  let got = 0;
  for (const [term, weight] of terms) {
    total += weight;
    if (containsTerm(r, term)) {
      got += weight;
      matched.push(term);
    } else {
      missing.push(term);
    }
  }
  const keywordScore = pct(got, total);

  // Technical skills named in the posting.
  const jdSkills = SKILLS.filter((s) => containsTerm(jdNorm, s));
  const foundSkills = jdSkills.filter((s) => containsTerm(r, s));
  const missingSkills = jdSkills.filter((s) => !containsTerm(r, s));
  const skillScore = jdSkills.length ? pct(foundSkills.length, jdSkills.length) : keywordScore;

  // Structure: standard sections and a sensible length.
  const lines = resume
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const sectionsFound = Object.keys(SECTION_PATTERNS).filter((name) =>
    lines.some((l) => l.length <= 40 && SECTION_PATTERNS[name].test(l))
  );
  const sectionsMissing = Object.keys(SECTION_PATTERNS).filter((n) => !sectionsFound.includes(n));
  const words = r.split(/\s+/).filter(Boolean).length;
  const lengthOk = words >= 250 && words <= 1000;
  const structureScore = Math.round((sectionsFound.length / 4) * 70 + (lengthOk ? 30 : 10));

  // Impact: what share of bullet-length lines contain a number.
  const bullets = lines.filter((l) => l.length > 40);
  const quantified = bullets.filter((l) => /\d/.test(l));
  const ratio = bullets.length ? quantified.length / bullets.length : 0;
  const impactScore = Math.min(100, Math.round((ratio / 0.4) * 100));

  const overall = Math.round(
    keywordScore * 0.5 + skillScore * 0.2 + structureScore * 0.15 + impactScore * 0.15
  );

  // Plain-language feedback.
  const strengths = [];
  const weaknesses = [];

  if (matched.length) {
    strengths.push(
      `Covers ${matched.length} of ${terms.length} key terms from the posting, including ${matched.slice(0, 5).join(", ")}.`
    );
  }
  if (foundSkills.length) {
    strengths.push(`Names ${foundSkills.length} of the ${jdSkills.length} technical skills the job asks for.`);
  }
  if (sectionsFound.length === 4) {
    strengths.push("Has all four core sections: Experience, Education, Skills and Projects.");
  }
  if (impactScore >= 60) {
    strengths.push("Backs up its bullet points with numbers, which shows measurable impact.");
  }
  if (lengthOk) {
    strengths.push("Length is in the usual range for a resume.");
  }

  if (missing.length) {
    weaknesses.push(`Missing terms, most important first: ${missing.slice(0, 8).join(", ")}.`);
  }
  if (missingSkills.length) {
    weaknesses.push(`Technical skills not mentioned: ${missingSkills.join(", ")}.`);
  }
  for (const s of sectionsMissing) {
    weaknesses.push(`No "${s}" section detected. Add a clearly labelled heading for it.`);
  }
  if (impactScore < 60) {
    weaknesses.push(
      `Only ${quantified.length} of ${bullets.length} bullets include a number. Add outcomes like percentages, counts or time saved.`
    );
  }
  if (!lengthOk) {
    weaknesses.push(
      words < 250
        ? `Resume looks short (about ${words} words). Add more detail on your work.`
        : `Resume looks long (about ${words} words). Trim older or less relevant items.`
    );
  }

  const verdict =
    overall >= 75
      ? "Strong match. Work the missing terms in and you are ready to apply."
      : overall >= 50
        ? "Partial match. The basics are there, but several things the employer wants are missing."
        : "Weak match. This resume needs a significant rewrite for this role.";

  return {
    overall,
    keywordScore,
    skillScore,
    structureScore,
    impactScore,
    matched,
    missing,
    strengths,
    weaknesses,
    verdict,
  };
}

// ---------- File reading ----------

async function readPdf(buffer) {
  if (!window.pdfjsLib) throw new Error("The PDF reader did not load. Check your internet connection.");
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

async function extractText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return readPdf(await file.arrayBuffer());
  if (name.endsWith(".docx")) {
    if (!window.mammoth) throw new Error("The Word reader did not load. Check your internet connection.");
    const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return value;
  }
  if (name.endsWith(".txt") || name.endsWith(".md")) return file.text();
  throw new Error("Please use a PDF, DOCX, TXT or MD file. For old .doc files, save as .docx first.");
}

// ---------- DOM ----------

const $ = (id) => document.getElementById(id);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function setError(message) {
  const box = $("error");
  box.textContent = message;
  box.classList.toggle("hidden", !message);
}

function colorFor(score) {
  if (score >= 75) return "#34d399"; // emerald
  if (score >= 50) return "#fbbf24"; // amber
  return "#f87171"; // rose
}

function fillList(id, items, emptyText) {
  const list = items.length ? items : [emptyText];
  $(id).replaceChildren(...list.map((t) => el("li", "leading-relaxed", t)));
}

function fillChips(id, items, chipClass, emptyText) {
  const nodes = items.length
    ? items.map((t) => el("span", `rounded-full px-3 py-1 text-xs ${chipClass}`, t))
    : [el("p", "text-sm text-slate-500", emptyText)];
  $(id).replaceChildren(...nodes);
}

function renderMetric(label, value, hint) {
  const card = el("div", "rounded-2xl border border-slate-800 bg-slate-900 p-5");
  const top = el("div", "flex items-baseline justify-between");
  top.append(el("span", "font-medium", label), el("span", "text-2xl font-bold", `${value}`));
  const track = el("div", "mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800");
  const bar = el("div", "h-2 rounded-full bg-indigo-400");
  bar.style.width = `${value}%`;
  track.append(bar);
  card.append(top, track, el("p", "mt-3 text-xs text-slate-500", hint));
  return card;
}

function render(res) {
  $("results").classList.remove("hidden");
  $("overall").textContent = res.overall;
  $("ring").style.background = `conic-gradient(${colorFor(res.overall)} ${res.overall * 3.6}deg, #1e293b 0deg)`;
  $("verdict").textContent = res.verdict;

  $("metrics").replaceChildren(
    renderMetric("Keyword match", res.keywordScore, "Share of the posting's key terms found in your resume, weighted by importance."),
    renderMetric("Skills match", res.skillScore, "Share of the named technical skills you mention."),
    renderMetric("Structure", res.structureScore, "Standard sections present and a sensible length."),
    renderMetric("Impact", res.impactScore, "How many of your bullet points include a number or result.")
  );

  fillList("strengths", res.strengths, "Nothing stands out yet. Add more detail that matches the posting.");
  fillList("weaknesses", res.weaknesses, "No major weaknesses found.");
  fillChips("matched", res.matched, "bg-emerald-500/15 text-emerald-300", "No key terms matched.");
  fillChips("missing", res.missing, "bg-rose-500/15 text-rose-300", "Nothing missing. Nice.");
}

// ---------- Wiring ----------

const dropzone = $("dropzone");
const fileInput = $("resume-file");
let resumeText = "";

async function handleFile(file) {
  setError("");
  $("file-name").textContent = `Reading ${file.name}...`;
  try {
    resumeText = await extractText(file);
    if (!resumeText.trim()) {
      throw new Error("No text found in that file. If it is a scanned PDF, it needs OCR first.");
    }
    const words = resumeText.split(/\s+/).filter(Boolean).length;
    $("file-name").textContent = `${file.name} (${words} words)`;
  } catch (err) {
    resumeText = "";
    $("file-name").textContent = "No file loaded";
    setError(err.message);
  }
}

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("border-indigo-400");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("border-indigo-400");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("border-indigo-400");
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

$("compare-btn").addEventListener("click", () => {
  setError("");
  const jd = $("jd").value.trim();
  if (!resumeText) return setError("Drop in your resume first.");
  if (jd.length < 80) return setError("Paste the full job description. A sentence or two is not enough to score against.");

  try {
    render(analyze(resumeText, jd));
    $("results").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    setError(err.message);
  }
});
