"use client";

import {
  approveRecruiter,
  getPendingRecruiters,
  rejectRecruiter,
} from "@/actions/recruiter";
import DataTable from "@/components/DataTable";
import { useEffect, useState } from "react";

interface Recruiter {
  id: string;
  company: string;
  contactName: string;
  phone: string;
  approved: boolean;
  user: {
    email: string;
  };
}

export default function AdminRecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const result = await getPendingRecruiters();
      if (result.success && result.data) {
        setRecruiters(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch recruiters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (recruiterId: string) => {
    setActionLoading(recruiterId);
    try {
      const result = await approveRecruiter({ recruiterId });
      if (result.success) {
        setRecruiters((prev) => prev.filter((r) => r.id !== recruiterId));
      }
    } catch (error) {
      console.error("Failed to approve recruiter:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (recruiterId: string) => {
    setActionLoading(recruiterId);
    try {
      const result = await rejectRecruiter({ recruiterId });
      if (result.success) {
        setRecruiters((prev) => prev.filter((r) => r.id !== recruiterId));
      }
    } catch (error) {
      console.error("Failed to reject recruiter:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  const headers = ["Company", "Contact Name", "Email", "Phone"];
  const rows = recruiters.map((recruiter) => ({
    id: recruiter.id,
    cells: [
      recruiter.company,
      recruiter.contactName,
      recruiter.user.email,
      recruiter.phone,
    ],
  }));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Recruiter Approvals
        </h1>
        <p className="text-gray-600 mt-2">
          Review and approve pending recruiter registrations
        </p>
      </div>

      {recruiters.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No pending recruiter applications</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <DataTable
            headers={headers}
            rows={rows}
            actions={(row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(row.id)}
                  disabled={actionLoading !== null}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === row.id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(row.id)}
                  disabled={actionLoading !== null}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === row.id ? "Processing..." : "Reject"}
                </button>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}
