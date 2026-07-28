/**
 * Auto eligibility screening and match score calculation
 */

export interface EligibilityScore {
  totalScore: number;
  cgpaMatch: number;
  branchMatch: number;
  skillMatch: number;
  yearMatch: number;
  isEligible: boolean;
  explanation: string[];
}

/**
 * Calculate CGPA match score
 */
export function calculateCGPAMatch(
  studentCGPA: number,
  minRequiredCGPA: number,
): { score: number; text: string } {
  if (studentCGPA < minRequiredCGPA) {
    return {
      score: 0,
      text: `CGPA ${studentCGPA} is below minimum requirement of ${minRequiredCGPA}`,
    };
  }

  // Score based on how much above minimum
  const excess = studentCGPA - minRequiredCGPA;
  const score = Math.min(100, minRequiredCGPA * 10 + excess * 5);

  return {
    score: Math.round(score),
    text: `CGPA ${studentCGPA} meets minimum requirement of ${minRequiredCGPA}`,
  };
}

/**
 * Calculate branch match score
 */
export function calculateBranchMatch(
  studentBranch: string,
  allowedBranches: string[],
): { score: number; text: string } {
  if (allowedBranches.length === 0) {
    return { score: 100, text: "All branches eligible" };
  }

  const isAllowed = allowedBranches
    .map((b) => b.toLowerCase())
    .includes(studentBranch.toLowerCase());

  if (!isAllowed) {
    return {
      score: 0,
      text: `Branch ${studentBranch} not in allowed list: ${allowedBranches.join(", ")}`,
    };
  }

  return {
    score: 100,
    text: `Branch ${studentBranch} is eligible`,
  };
}

/**
 * Calculate year match score
 */
export function calculateYearMatch(
  studentYear: number,
  allowedYears: number[],
): { score: number; text: string } {
  if (allowedYears.length === 0) {
    return { score: 100, text: "All years eligible" };
  }

  const isAllowed = allowedYears.includes(studentYear);

  if (!isAllowed) {
    return {
      score: 0,
      text: `Year ${studentYear} not in allowed list: ${allowedYears.join(", ")}`,
    };
  }

  return {
    score: 100,
    text: `Year ${studentYear} is eligible`,
  };
}

/**
 * Calculate skill match score (0-100)
 */
export function calculateSkillMatchScore(
  resumeSkills: string[] = [],
  jobKeywords: string[] = [],
): { score: number; matchedSkills: number; totalRequired: number } {
  if (jobKeywords.length === 0) {
    return { score: 100, matchedSkills: 0, totalRequired: 0 };
  }

  if (resumeSkills.length === 0) {
    return { score: 0, matchedSkills: 0, totalRequired: jobKeywords.length };
  }

  const resumeSkillsLower = resumeSkills.map((s) => s.toLowerCase());
  const jobKeywordsLower = jobKeywords.map((k) => k.toLowerCase());

  let matchedCount = 0;
  jobKeywordsLower.forEach((keyword) => {
    const isMatched = resumeSkillsLower.some(
      (skill) =>
        skill.includes(keyword) ||
        keyword.includes(skill) ||
        skill === keyword ||
        (skill.length > 3 &&
          keyword.length > 3 &&
          skill.startsWith(keyword.substring(0, 3))),
    );
    if (isMatched) matchedCount++;
  });

  const score = Math.round((matchedCount / jobKeywordsLower.length) * 100);

  return {
    score: Math.max(0, Math.min(100, score)),
    matchedSkills: matchedCount,
    totalRequired: jobKeywordsLower.length,
  };
}

/**
 * Calculate overall eligibility and match score
 */
export function calculateEligibilityScore(
  student: {
    cgpa: number;
    branch: string;
    year: number;
    resumeSkills?: string[];
  },
  job: {
    minCgpa: number;
    allowedBranches: string[];
    allowedYears: number[];
    requiredKeywords?: string[];
  },
): EligibilityScore {
  const explanation: string[] = [];
  const scores: number[] = [];

  // CGPA check (mandatory)
  const cgpaMatch = calculateCGPAMatch(student.cgpa, job.minCgpa);
  scores.push(cgpaMatch.score);
  explanation.push(cgpaMatch.text);

  // Branch check (mandatory)
  const branchMatch = calculateBranchMatch(student.branch, job.allowedBranches);
  scores.push(branchMatch.score);
  explanation.push(branchMatch.text);

  // Year check (mandatory)
  const yearMatch = calculateYearMatch(student.year, job.allowedYears);
  scores.push(yearMatch.score);
  explanation.push(yearMatch.text);

  // Skill match (secondary, optional)
  const skillMatch = calculateSkillMatchScore(
    student.resumeSkills || [],
    job.requiredKeywords || [],
  );
  scores.push(skillMatch.score);
  explanation.push(
    `Skill match: ${skillMatch.matchedSkills}/${skillMatch.totalRequired} required skills matched`,
  );

  // Check if mandatory requirements are met
  const isMandatoryEligible =
    cgpaMatch.score > 0 && branchMatch.score > 0 && yearMatch.score > 0;

  // Overall score (weighted)
  // Mandatory requirements: 80% weight
  // Skills: 20% weight
  const totalScore = isMandatoryEligible
    ? Math.round(
        cgpaMatch.score * 0.267 +
          branchMatch.score * 0.267 +
          yearMatch.score * 0.266 +
          skillMatch.score * 0.2,
      )
    : 0;

  return {
    totalScore: Math.max(0, Math.min(100, totalScore)),
    cgpaMatch: cgpaMatch.score,
    branchMatch: branchMatch.score,
    skillMatch: skillMatch.score,
    yearMatch: yearMatch.score,
    isEligible: isMandatoryEligible,
    explanation,
  };
}

/**
 * Auto-screen applications and update match scores
 */
export function autoScreenApplications(
  applications: Array<{
    id: string;
    student: {
      cgpa: number;
      branch: string;
      year: number;
      resumeSkills?: string[];
    };
    job: {
      minCgpa: number;
      allowedBranches: string[];
      allowedYears: number[];
      requiredKeywords?: string[];
    };
  }>,
): Array<{
  applicationId: string;
  matchScore: number;
  isEligible: boolean;
  explanation: string[];
}> {
  return applications.map((app) => {
    const score = calculateEligibilityScore(app.student, app.job);
    return {
      applicationId: app.id,
      matchScore: score.totalScore,
      isEligible: score.isEligible,
      explanation: score.explanation,
    };
  });
}

/**
 * Get eligibility statistics for a job
 */
export function getEligibilityStats(
  applications: Array<{ matchScore: number; isEligible: boolean }>,
): {
  totalApplications: number;
  eligibleCount: number;
  highMatchCount: number; // > 70%
  mediumMatchCount: number; // 40-70%
  lowMatchCount: number; // < 40%
  averageScore: number;
} {
  const total = applications.length;
  if (total === 0) {
    return {
      totalApplications: 0,
      eligibleCount: 0,
      highMatchCount: 0,
      mediumMatchCount: 0,
      lowMatchCount: 0,
      averageScore: 0,
    };
  }

  const eligible = applications.filter((a) => a.isEligible).length;
  const highMatch = applications.filter((a) => a.matchScore > 70).length;
  const mediumMatch = applications.filter(
    (a) => a.matchScore >= 40 && a.matchScore <= 70,
  ).length;
  const lowMatch = applications.filter((a) => a.matchScore < 40).length;
  const avgScore = Math.round(
    applications.reduce((sum, a) => sum + a.matchScore, 0) / total,
  );

  return {
    totalApplications: total,
    eligibleCount: eligible,
    highMatchCount: highMatch,
    mediumMatchCount: mediumMatch,
    lowMatchCount: lowMatch,
    averageScore: avgScore,
  };
}
