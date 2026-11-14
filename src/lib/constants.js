// Common English words and generic job-post filler. These are never keywords.
export const STOPWORDS = new Set(
  `
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
`
    .split(/\s+/)
    .filter(Boolean)
);

// Technical skills we recognise as phrases, so "node.js" or "machine learning" count as one thing.
export const SKILLS = [
  "javascript", "typescript", "react", "next.js", "node.js", "express", "vue", "angular",
  "html", "css", "tailwind", "python", "java", "c#", "c++", "go", "rust", "sql",
  "postgresql", "mysql", "mongodb", "redis", "aws", "azure", "gcp", "docker",
  "kubernetes", "terraform", "ci/cd", "git", "rest", "graphql", "testing", "jest",
  "cypress", "linux", "agile", "scrum", "machine learning", "data analysis", "excel",
  "power bi", "tableau", "figma", "accessibility", "system design", "microservices",
  "api", "leadership", "project management",
];

// Headings we look for in the resume, matched against short lines only.
export const SECTION_PATTERNS = {
  Experience: /\b(work\s+)?experience|employment history\b/i,
  Education: /\beducation|academic\b/i,
  Skills: /\bskills|technical skills|core competencies|technologies\b/i,
  Projects: /\bprojects\b/i,
};
