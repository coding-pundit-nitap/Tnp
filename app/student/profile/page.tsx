"use client";

import { getStudentProfile, updateStudentProfile } from "@/actions/profile";
import Card from "@/components/Card";
import FormInput from "@/components/FormInput";
import Link from "next/link";
import { useEffect, useState } from "react";

const branches = ["CSE", "ECE", "ME", "CE", "EE", "CHE", "BT", "MME"];
const years = [1, 2, 3, 4];

interface StudentProfile {
  id: string;
  userId: string;
  branch: string;
  year: number;
  cgpa: number;
  resumeUrl: string | null;
  profileCompleted: boolean;
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [formData, setFormData] = useState({
    branch: "",
    year: "",
    cgpa: "",
    resumeUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getStudentProfile();
        if (result.success && result.data) {
          setProfile(result.data as StudentProfile);
          setFormData({
            branch: result.data.branch || "",
            year: result.data.year?.toString() || "",
            cgpa: result.data.cgpa?.toString() || "",
            resumeUrl: result.data.resumeUrl || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
    setSaving(true);
    setErrors({});

    try {
      const result = await updateStudentProfile(formData);

      if (result.success) {
        setProfile(result.data as StudentProfile);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setErrors({ form: result.error });
      }
    } catch (error: any) {
      setErrors({ form: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Link
          href="/student"
          className="text-blue-600 hover:text-blue-800 font-semibold mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <Card title="Student Profile">
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Profile updated successfully!
            </div>
          )}

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
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
