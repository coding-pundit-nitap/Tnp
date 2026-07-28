"use client";

import { useState } from "react";
import { uploadResume } from "@/actions/resume";
import FileUploadBox from "@/components/FileUploadBox";

export default function ResumeUploadClient({
  existingResume,
}: {
  existingResume?: any;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resume, setResume] = useState<any>(existingResume || null);

  const handleFileSelect = async (file: File) => {
    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadResume(formData);

      if (result.success && result.data) {
        setResume(result.data.resume);
        setSuccess("Resume uploaded and parsed successfully!");
      } else {
        setError(result.error || "Failed to upload resume");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Upload Resume
        </h3>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <FileUploadBox
          onFileSelect={handleFileSelect}
          accept=".pdf"
          maxSize={5}
          label="Resume (PDF)"
          description="Your resume will be analyzed to extract skills, education, and relevant information for automatic eligibility screening."
          disabled={uploading}
        />

        {uploading && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-blue-800">Parsing resume...</p>
            </div>
          </div>
        )}
      </div>

      {/* Resume Information */}
      {resume && (
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Resume Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Extracted Skills
              </h4>
              {resume.skills && resume.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {resume.skills
                    .slice(0, 12)
                    .map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  {resume.skills.length > 12 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      +{resume.skills.length - 12} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No skills extracted</p>
              )}
            </div>

            {/* CGPA */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Education</h4>
              {resume.cgpaFromResume ? (
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">CGPA:</span>{" "}
                    <span className="text-indigo-600 text-lg font-bold">
                      {resume.cgpaFromResume.toFixed(2)}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No CGPA found in resume</p>
              )}
            </div>

            {/* Education Details */}
            {resume.education && resume.education.length > 0 && (
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Education Details
                </h4>
                <div className="space-y-3">
                  {resume.education.map((edu: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <p className="font-medium text-gray-900">{edu.degree}</p>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      {edu.year && (
                        <p className="text-xs text-gray-500 mt-1">
                          Graduated: {edu.year}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {resume.keywords && resume.keywords.length > 0 && (
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Keywords for Job Matching
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Top {Math.min(20, resume.keywords.length)} keywords extracted
                  for eligibility matching
                </p>
                <div className="flex flex-wrap gap-2">
                  {resume.keywords
                    .slice(0, 20)
                    .map((keyword: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Upload Date */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Last updated:{" "}
              <span className="font-medium">
                {new Date(resume.updatedAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Tips & Benefits */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">💡 Resume Tips</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>
            ✓ Include a skills section with relevant technologies and tools
          </li>
          <li>✓ List your highest and final CGPA clearly</li>
          <li>✓ Include relevant keywords related to your field</li>
          <li>✓ Keep your resume to 1-2 pages in PDF format</li>
          <li>✓ Your resume is used for automatic eligibility screening</li>
        </ul>
      </div>
    </div>
  );
}
