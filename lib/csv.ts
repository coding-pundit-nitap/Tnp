/**
 * CSV export utilities
 */

export interface CSVExportOptions {
  filename: string;
  headers: string[];
  rows: any[];
}

/**
 * Convert array to CSV format
 */
export function convertToCSV(data: CSVExportOptions): string {
  const headers = data.headers.map((h) => `"${h}"`).join(",");
  const rows = data.rows
    .map((row) =>
      data.headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return '""';
          const stringValue = String(value).replace(/"/g, '""');
          return `"${stringValue}"`;
        })
        .join(","),
    )
    .join("\n");

  return `${headers}\n${rows}`;
}

/**
 * Generate student list CSV
 */
export function generateStudentCSV(students: any[]): string {
  return convertToCSV({
    filename: "students.csv",
    headers: [
      "ID",
      "Name",
      "Email",
      "Branch",
      "Year",
      "CGPA",
      "Status",
      "Placements",
    ],
    rows: students.map((s) => ({
      ID: s.id,
      Name: s.user.name,
      Email: s.user.email,
      Branch: s.branch,
      Year: s.year,
      CGPA: s.cgpa,
      Status: s.user.status,
      Placements: s.placements || 0,
    })),
  });
}

/**
 * Generate recruiter list CSV
 */
export function generateRecruiterCSV(recruiters: any[]): string {
  return convertToCSV({
    filename: "recruiters.csv",
    headers: [
      "ID",
      "Company Name",
      "Contact Name",
      "Email",
      "Phone",
      "Status",
      "Jobs Posted",
      "Applications",
    ],
    rows: recruiters.map((r) => ({
      ID: r.id,
      "Company Name": r.company,
      "Contact Name": r.contactName,
      Email: r.user.email,
      Phone: r.phone,
      Status: r.approved ? "Approved" : "Pending",
      "Jobs Posted": r.jobsCount || 0,
      Applications: r.applicationsCount || 0,
    })),
  });
}

/**
 * Generate job list CSV
 */
export function generateJobsCSV(jobs: any[]): string {
  return convertToCSV({
    filename: "jobs.csv",
    headers: [
      "Job ID",
      "Title",
      "Company",
      "Location",
      "CTC (LPA)",
      "Min CGPA",
      "Branches",
      "Years",
      "Applications",
      "Posted Date",
    ],
    rows: jobs.map((j) => ({
      "Job ID": j.id,
      Title: j.title,
      Company: j.company,
      Location: j.location,
      "CTC (LPA)": j.ctc,
      "Min CGPA": j.minCgpa,
      Branches: j.allowedBranches.join("; "),
      Years: j.allowedYears.join("; "),
      Applications: j.applicationsCount || 0,
      "Posted Date": new Date(j.createdAt).toLocaleDateString(),
    })),
  });
}

/**
 * Generate applications list CSV
 */
export function generateApplicationsCSV(applications: any[]): string {
  return convertToCSV({
    filename: "applications.csv",
    headers: [
      "Application ID",
      "Student Name",
      "Job Title",
      "Company",
      "Status",
      "Match Score",
      "Applied Date",
      "Last Updated",
    ],
    rows: applications.map((a) => ({
      "Application ID": a.id,
      "Student Name": a.student.user.name,
      "Job Title": a.job.title,
      Company: a.job.company,
      Status: a.status.replace(/_/g, " "),
      "Match Score": `${a.matchScore || 0}%`,
      "Applied Date": new Date(a.appliedAt).toLocaleDateString(),
      "Last Updated": new Date(a.updatedAt).toLocaleDateString(),
    })),
  });
}

/**
 * Generate placements report CSV
 */
export function generatePlacementsCSV(placements: any[]): string {
  return convertToCSV({
    filename: "placements.csv",
    headers: [
      "Student Name",
      "Roll Number",
      "Branch",
      "Company",
      "Job Title",
      "CTC (LPA)",
      "Offer Accepted Date",
    ],
    rows: placements.map((p) => ({
      "Student Name": p.application.student.user.name,
      "Roll Number": p.application.student.id,
      Branch: p.application.student.branch,
      Company: p.application.job.company,
      "Job Title": p.application.job.title,
      "CTC (LPA)": p.offer.ctcFinal,
      "Offer Accepted Date": p.offer.acceptedAt
        ? new Date(p.offer.acceptedAt).toLocaleDateString()
        : "N/A",
    })),
  });
}

/**
 * Create downloadable file from CSV string
 */
export function getCSVFileBuffer(
  csv: string,
  filename: string,
): {
  buffer: Buffer;
  filename: string;
} {
  const buffer = Buffer.from(csv, "utf-8");
  return { buffer, filename };
}

/**
 * Generate report headers for HTTP response
 */
export function getCSVHeaders(filename: string): Record<string, string> {
  return {
    "Content-Type": "text/csv;charset=utf-8;",
    "Content-Disposition": `attachment; filename="${filename}"`,
  };
}

/**
 * Batch export - export multiple reports at once
 */
export async function generateBatchExport(
  exportConfigs: Array<{
    type: string;
    data: any[];
  }>,
): Promise<Record<string, string>> {
  const reports: Record<string, string> = {};

  for (const config of exportConfigs) {
    switch (config.type) {
      case "students":
        reports["students.csv"] = generateStudentCSV(config.data);
        break;
      case "recruiters":
        reports["recruiters.csv"] = generateRecruiterCSV(config.data);
        break;
      case "jobs":
        reports["jobs.csv"] = generateJobsCSV(config.data);
        break;
      case "applications":
        reports["applications.csv"] = generateApplicationsCSV(config.data);
        break;
      case "placements":
        reports["placements.csv"] = generatePlacementsCSV(config.data);
        break;
    }
  }

  return reports;
}

/**
 * Export as ZIP file (requires archiver package)
 * This is the extension point for creating ZIP exports
 */
export async function createZipArchive(
  files: Record<string, string>,
): Promise<Buffer> {
  // This would use the 'archiver' package to create a ZIP
  // For now, return empty buffer
  // npm install archiver
  // Then: import archiver from "archiver";
  console.log("ZIP export would be created with files:", Object.keys(files));
  return Buffer.alloc(0);
}
