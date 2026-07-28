"use client";

import { ReactNode } from "react";

interface DataTableProps {
  headers: string[];
  rows: Array<{ id: string | number; cells: ReactNode[] }>;
  actions?: (row: any) => ReactNode;
}

export default function DataTable({ headers, rows, actions }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                {header}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length + (actions ? 1 : 0)}
                className="px-6 py-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {row.cells.map((cell, idx) => (
                  <td key={idx} className="px-6 py-4 text-sm text-gray-700">
                    {cell}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-sm">{actions(row)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
