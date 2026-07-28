"use client";

import { updateStudentProfile } from "@/actions/profile";
import Card from "@/components/Card";
import FormInput from "@/components/FormInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

const branches = ["CSE", "ECE", "ME", "CE", "EE", "CHE", "BT", "MME"];
const years = [1, 2, 3, 4];

export default function StudentProfileSetup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    branch: "",
    year: "",
    cgpa: "",
    resumeUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const result = await updateStudentProfile(formData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/student");
        }, 1500);
      } else {
        setErrors({ form: result.error });
      }
    } catch (error: any) {
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Profile Setup Complete!
            </h2>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card title="Complete Your Profile">
          {errors.form && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Branch"
              name="branch"
              type="select"
              value={formData.branch}
              onChange={handleChange}
              error={errors.branch}
              required
            >
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </FormInput>

            <FormInput
              label="Year"
              name="year"
              type="select"
              value={formData.year}
              onChange={handleChange}
              error={errors.year}
              required
            >
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            </FormInput>

            <FormInput
              label="CGPA"
              name="cgpa"
              type="number"
              placeholder="3.5"
              value={formData.cgpa}
              onChange={handleChange}
              error={errors.cgpa}
              required
            />

            <FormInput
              label="Resume URL (Optional)"
              name="resumeUrl"
              type="url"
              placeholder="https://example.com/resume.pdf"
              value={formData.resumeUrl}
              onChange={handleChange}
              error={errors.resumeUrl}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
