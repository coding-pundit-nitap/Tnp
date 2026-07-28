"use client";

import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

interface FileUploadBoxProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
  disabled?: boolean;
}

export default function FileUploadBox({
  onFileSelect,
  accept = ".pdf",
  maxSize = 5,
  label = "Upload File",
  description,
  disabled = false,
}: FileUploadBoxProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const fileType = accept.split(",")[0].replace(".", "");
    if (!file.type.includes(fileType) && !file.name.endsWith(fileType)) {
      return `File must be ${accept}`;
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setFile(file);
    setError(null);
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 bg-gray-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <div onClick={() => !disabled && inputRef.current?.click()}>
          <Upload className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Drag and drop your file here
          </p>
          <p className="mt-1 text-xs text-gray-500">
            or click to select from your computer
          </p>
          {description && (
            <p className="mt-2 text-xs text-gray-400">{description}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            {accept} • Max {maxSize}MB
          </p>
        </div>
      </div>

      {file && (
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">{file.name}</p>
                <p className="text-xs text-blue-600">
                  {(file.size / 1024 / 1024).toFixed(2)}MB
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-blue-600 hover:text-blue-900"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
