/**
 * Simple resume parser - extracts text from PDF and identifies key sections
 */

export interface ParsedResume {
  skills: string[];
  education: Array<{ degree: string; institution: string; year?: string }>;
  cgpaFromResume: number | null;
  keywords: string[];
  summary: string;
}

/**
 * Extract text from PDF (requires text extraction library)
 * For now, this is a placeholder that demonstrates the pattern
 */
export async function extractTextFromPDF(
  arrayBuffer: ArrayBuffer,
): Promise<string> {
  // In production, you would use a library like pdf-parse or pdfjs
  // For this demo, we'll return empty but the structure is ready for integration
  try {
    // Example integration point:
    // const pdfData = await pdf(Buffer.from(arrayBuffer));
    // return pdfData.text;
    return "";
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    return "";
  }
}

/**
 * Parse skills from resume text
 */
export function parseSkills(text: string): string[] {
  const skillsPatterns = [
    /skills?\s*:?\s*([^\n]+)/gi,
    /technical\s+skills?\s*:?\s*([^\n]+)/gi,
    /programming\s+languages?\s*:?\s*([^\n]+)/gi,
  ];

  const skillsSet = new Set<string>();

  skillsPatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const skills = match
          .split(/[:,]/g)
          .slice(1)
          .join("")
          .split(/[,;]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && s.length < 50);

        skills.forEach((skill) => skillsSet.add(skill));
      });
    }
  });

  // Common skill keywords to look for
  const commonSkills = [
    "java",
    "python",
    "javascript",
    "typescript",
    "react",
    "node.js",
    "sql",
    "mongodb",
    "aws",
    "docker",
    "kubernetes",
    "git",
    "html",
    "css",
    "angular",
    "vue",
    "express",
    "fastapi",
    "django",
    "spring",
    "spring boot",
    "c++",
    "c#",
    ".net",
    "rest api",
    "graphql",
    "linux",
    "windows",
    "agile",
    "jira",
    "github",
    "gitlab",
    "jenkins",
  ];

  commonSkills.forEach((skill) => {
    if (text.toLowerCase().includes(skill)) {
      skillsSet.add(skill);
    }
  });

  return Array.from(skillsSet);
}

/**
 * Parse education from resume text
 */
export function parseEducation(
  text: string,
): Array<{ degree: string; institution: string; year?: string }> {
  const education: Array<{
    degree: string;
    institution: string;
    year?: string;
  }> = [];

  const degreePatterns = [
    /(?:B\.?E\.?|B\.?Tech\.?|B\.?Sc\.?|M\.?E\.?|M\.?Tech\.?|M\.?Sc\.?|MBA|M\.?B\.?A\.?)(?:\s+in)?\s+([A-Za-z\s]+)/gi,
  ];

  const institutionPatterns = [
    /(?:from|at|university|institute|iit|nit|college)\s+([A-Za-z\s\-,&.]+)/gi,
  ];

  // Extract degrees
  degreePatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const degree = match[0].trim();
      const field = match[1]?.trim() || "";

      // Find nearby institution
      let institution = "Not specified";
      for (const instPattern of institutionPatterns) {
        const nearby = instPattern.exec(text);
        if (nearby) {
          institution = nearby[1].trim();
          break;
        }
      }

      education.push({
        degree: field ? `${degree.split(" in ")[0]} in ${field}` : degree,
        institution,
      });
    }
  });

  return education;
}

/**
 * Parse CGPA from resume text
 */
export function parseCGPA(text: string): number | null {
  // Look for CGPA/ GPA patterns
  const cgpaPatterns = [
    /cgpa?\s*:?\s*(\d+\.?\d*)/gi,
    /gpa?\s*:?\s*(\d+\.?\d*)/gi,
    /result?\s*:?\s*(\d+\.?\d*)/gi,
  ];

  for (const pattern of cgpaPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[0].split(/[\s:]/g).pop() || "0");
      if (value > 0 && value <= 10) {
        return value;
      }
    }
  }

  return null;
}

/**
 * Extract keywords for job matching
 */
export function extractKeywords(text: string): string[] {
  // Remove common words
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
  ]);

  // Split into words and filter
  const keywords = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word))
    .slice(0, 100); // Limit to top 100

  // Remove duplicates
  return [...new Set(keywords)];
}

/**
 * Get resume summary (first 500 chars)
 */
export function getResumeSummary(text: string): string {
  return text.substring(0, 500).trim();
}

/**
 * Main parse function - orchestrates all parsing
 */
export async function parseResume(text: string): Promise<ParsedResume> {
  return {
    skills: parseSkills(text),
    education: parseEducation(text),
    cgpaFromResume: parseCGPA(text),
    keywords: extractKeywords(text),
    summary: getResumeSummary(text),
  };
}

/**
 * Calculate skill match score
 */
export function calculateSkillMatch(
  resumeSkills: string[],
  jobKeywords: string[],
): number {
  if (jobKeywords.length === 0) return 0;

  const resumeSkillsLower = resumeSkills.map((s) => s.toLowerCase());
  const jobKeywordsLower = jobKeywords.map((k) => k.toLowerCase());

  const matches = jobKeywordsLower.filter((keyword) =>
    resumeSkillsLower.some(
      (skill) => skill.includes(keyword) || keyword.includes(skill),
    ),
  );

  return Math.round((matches.length / jobKeywordsLower.length) * 100);
}
