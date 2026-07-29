import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";
import { getAuditLogs } from "@/actions/audit";
import { Shield, Activity } from "lucide-react";

export default async function AuditLogs() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  // Get first page of audit logs
  const result = await getAuditLogs({
    page: 1,
    limit: 50,
  });

  if (!result.success) {
    redirect("/login");
  }

  const logs = result.data || [];
  const total = result.total || 0;

  const getActionBadgeColor = (action: string) => {
    if (action.includes("CREATE")) return "bg-green-100 text-green-800";
    if (action.includes("UPDATE")) return "bg-blue-100 text-blue-800";
    if (action.includes("DELETE")) return "bg-red-100 text-red-800";
    if (action.includes("APPROVE")) return "bg-purple-100 text-purple-800";
    if (action.includes("REJECT")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getActionLabel = (action: string) => {
    return action.replace(/_/g, " ");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">T&P Portal</h1>
            <p className="text-sm text-gray-600">Admin Dashboard</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Audit Logs</h2>
            <p className="text-gray-600 mt-2">
              System activity and user actions
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/analytics"
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <p className="font-semibold text-gray-900">Analytics</p>
            <p className="text-sm text-gray-600">View placement trends</p>
          </Link>
          <Link
            href="/admin/export"
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <p className="font-semibold text-gray-900">Export Data</p>
            <p className="text-sm text-gray-600">Download reports</p>
          </Link>
          <Link
            href="/admin/settings"
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <p className="font-semibold text-gray-900">Settings</p>
            <p className="text-sm text-gray-600">Portal configuration</p>
          </Link>
        </div>

        {/* Summary Card */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Log Entries
              </p>
              <p className="text-3xl font-bold text-gray-900">{total}</p>
            </div>
            <div className="rounded-full bg-indigo-100 p-3">
              <Activity className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        {logs.length > 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Entity
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log: any) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {log.user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {log.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}
                        >
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {log.entityType}
                        {log.entityId && (
                          <p className="text-xs text-gray-500 mt-1 font-mono">
                            {log.entityId.substring(0, 8)}...
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {log.changes ? (
                          <details className="cursor-pointer">
                            <summary className="font-medium text-gray-900 hover:text-indigo-600">
                              View changes
                            </summary>
                            <pre className="mt-2 overflow-x-auto bg-gray-50 p-2 rounded text-xs">
                              {JSON.stringify(log.changes, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">
                  1-{Math.min(50, logs.length)}
                </span>{" "}
                of <span className="font-medium">{total}</span> entries
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="mb-4">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No logged activities yet
            </h3>
            <p className="text-gray-600">
              Audit logs will be recorded as users interact with the system
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 rounded-lg bg-blue-50 border border-blue-200 p-6">
          <h4 className="font-semibold text-blue-900 mb-3">
            📋 About Audit Logs
          </h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ All admin actions are logged automatically</li>
            <li>✓ Job creation, updates, and deletions are tracked</li>
            <li>✓ Application status changes are recorded</li>
            <li>✓ Offer generation and acceptance are logged</li>
            <li>✓ Logs include timestamp, user, action, and details</li>
            <li>✓ Useful for compliance, auditing, and troubleshooting</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
