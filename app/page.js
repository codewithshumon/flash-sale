"use client";

import { useEffect, useState } from "react";

import ProductCard from "./components/ProductCard";
import { useRouter } from "next/navigation";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/fetch-products?limit=5&sort=newest");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        if (data.success) {
          // Initialize countdown for each product
          const productsWithCountdown = data.data.map((product) => ({
            ...product,
            countdown: product.timeRemaining
              ? calculateCountdown(product.timeRemaining)
              : null,
          }));
          setProducts(productsWithCountdown);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  // Function to calculate countdown values
  const calculateCountdown = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  // In your Home component's countdown update useEffect
  useEffect(() => {
    if (products.some((product) => product.timeRemaining)) {
      const timer = setInterval(() => {
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (!product.timeRemaining) return product;

            const newTimeRemaining = product.timeRemaining - 1000;
            if (newTimeRemaining <= 0) {
              // Return the product without timeRemaining and countdown
              const { timeRemaining, countdown, ...rest } = product;
              return rest;
            }
            return {
              ...product,
              timeRemaining: newTimeRemaining,
              countdown: calculateCountdown(newTimeRemaining),
            };
          })
        );
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [products]);

  const handleAdminClick = () => {
    router.push("/admin");
  };

  return (
    <div className="relative w-full  h-full">
      <div className="relative w-full max-w-[1440px] h-full px-10 py-20 mx-auto">
        <div className="relative w-full flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0B2A6E] uppercase mb-6">
            Flash Sale
          </h1>
          <button
            onClick={handleAdminClick}
            className="bg-[#0B2A6E] cursor-pointer text-white px-4 py-2 rounded hover:bg-[#1a3a8e] transition-colors"
          >
            Admin
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-50 rounded">
            Error: {error}
          </div>
        ) : (
          <ProductCard products={products} />
        )}
      </div>
    </div>
  );
}
