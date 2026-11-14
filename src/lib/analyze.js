// Scoring: compares a resume with a job description and returns a scorecard object.
// Pure function: the same inputs always give the same output.
import { STOPWORDS, SKILLS, SECTION_PATTERNS } from "./constants";
import { normalize, containsTerm, pct } from "./text";

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

export function analyze(resume, jd) {
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
