"use client";

import React, { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  filters?: Array<{
    name: string;
    label: string;
    options: FilterOption[];
  }>;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchFilterBar({
  onSearch,
  onFilterChange,
  filters = [],
  placeholder = "Search...",
  debounceMs = 300,
}: SearchFilterBarProps) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery(value);

      // Clear existing timer
      if (debounceTimer) clearTimeout(debounceTimer);

      // Set new timer
      const timer = setTimeout(() => {
        onSearch(value);
      }, debounceMs);

      setDebounceTimer(timer);
    },
    [debounceMs, onSearch, debounceTimer],
  );

  const handleFilterChange = useCallback(
    (filterName: string, value: string) => {
      const newFilters = { ...activeFilters };
      if (value) {
        newFilters[filterName] = value;
      } else {
        delete newFilters[filterName];
      }
      setActiveFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [activeFilters, onFilterChange],
  );

  const clearAll = () => {
    setQuery("");
    setActiveFilters({});
    onSearch("");
    onFilterChange?.({});
  };

  const hasActiveFilters =
    query.length > 0 || Object.keys(activeFilters).length > 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="space-y-4">
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filters.map((filter) => (
              <select
                key={filter.name}
                value={activeFilters[filter.name] || ""}
                onChange={(e) =>
                  handleFilterChange(filter.name, e.target.value)
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}

        {/* Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <X size={16} />
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
