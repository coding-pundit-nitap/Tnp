import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="text-6xl font-bold text-red-600 mb-2">403</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please check your
            role or contact the administrator.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="inline-block w-full px-6 py-3 bg-linear-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200"
          >
            Back to Login
          </Link>
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
