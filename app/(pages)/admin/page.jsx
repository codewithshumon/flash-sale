"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadPreview from "@/app/components/ImageUploadPreview";

export default function AdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    regularPrice: 0,
    offerPrice: 0,
    isFavorite: false,
    itemsLeft: 0,
    flashSaleEnd: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.image) {
      setError("Please upload a product image");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = formData.image;

      if (formData.image instanceof File) {
        const formDataToUpload = new FormData();
        formDataToUpload.append("file", formData.image);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataToUpload,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      const productData = {
        ...formData,
        image: imageUrl,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">
              Add New Flash Sale Product
            </h1>
            <button
              onClick={() => router.push("/")}
              className="text-blue-200 hover:text-white transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border-l-4 border-red-500">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image <span className="text-red-500">*</span>
                </label>
                <ImageUploadPreview
                  image={formData.image}
                  onImageChange={handleImageChange}
                  alt="Product preview"
                  className="w-full h-64 object-contain border-2 border-dashed border-gray-300 rounded-lg"
                />
              </div>

              {/* Product Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Enter product title"
                />
              </div>

              {/* Price Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Regular Price */}
                <div>
                  <label
                    htmlFor="regularPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Regular Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="regularPrice"
                    name="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>

                {/* Offer Price */}
                <div>
                  <label
                    htmlFor="offerPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Offer Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="offerPrice"
                    name="offerPrice"
                    value={formData.offerPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>
              </div>

              {/* Inventory */}
              <div>
                <label
                  htmlFor="itemsLeft"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="itemsLeft"
                  name="itemsLeft"
                  value={formData.itemsLeft}
                  onChange={handleChange}
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>

              {/* Flash Sale End */}
              <div>
                <label
                  htmlFor="flashSaleEnd"
                  className="block text-sm font-medium text-gray-700"
                >
                  Flash Sale End Date/Time{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="flashSaleEnd"
                  name="flashSaleEnd"
                  value={formData.flashSaleEnd}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-4 cursor-pointer py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.image}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
