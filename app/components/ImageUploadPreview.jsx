"use client";

import { useState, useCallback, useEffect } from "react";

export default function ImageUploadPreview({
  image,
  onImageChange,
  alt = "Preview",
}) {
  const [preview, setPreview] = useState(null);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Handle both new uploads and existing image URLs
  useEffect(() => {
    if (typeof image === "string") {
      setPreview(image);
    } else if (image instanceof File) {
      const previewUrl = URL.createObjectURL(image);
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.match("image.*")) {
        alert("Please select an image file (JPEG, PNG, GIF)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }

      // Notify parent component about the new image
      onImageChange(file);
    },
    [onImageChange]
  );

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.match("image.*")) {
          onImageChange(file);
        }
      }
    },
    [onImageChange]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div className="space-y-4">
      {/* Image preview */}
      {preview && (
        <div className="relative group">
          <img
            src={preview}
            alt={alt}
            className="w-full h-64 object-contain rounded-lg border border-gray-300 bg-white"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Upload area */}
      <div
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            aria-label="Upload product image"
          />
        </label>
      </div>
    </div>
  );
}
