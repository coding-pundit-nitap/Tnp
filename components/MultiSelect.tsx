"use client";

import { useState } from "react";

interface MultiSelectProps {
  label: string;
  name: string;
  options: (string | number)[];
  selected: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  placeholder?: string;
  isString?: boolean;
}

export default function MultiSelect({
  label,
  name,
  options,
  selected,
  onChange,
  placeholder,
  isString = true,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string | number) => {
    const updatedSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(updatedSelected as any);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={JSON.stringify(selected)} />

      {/* Dropdown button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition flex justify-between items-center"
      >
        <span className="text-gray-700">
          {selected.length === 0
            ? placeholder || "Select options..."
            : `${selected.length} selected`}
        </span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="max-h-48 overflow-y-auto">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700">
                  {isString ? option : `Year ${option}`}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Selected items display */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((item) => (
            <div
              key={item}
              className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              <span>{isString ? item : `Year ${item}`}</span>
              <button
                type="button"
                onClick={() => toggleOption(item)}
                className="font-bold hover:text-indigo-900 cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
