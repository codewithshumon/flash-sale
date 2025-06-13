"use client";

import { useEffect, useState } from "react";

import ProductCard from "./components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Update countdown every second
  useEffect(() => {
    if (products.some((product) => product.timeRemaining)) {
      const timer = setInterval(() => {
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (!product.timeRemaining) return product;

            const newTimeRemaining = product.timeRemaining - 1000;
            if (newTimeRemaining <= 0) {
              return {
                ...product,
                timeRemaining: 0,
                countdown: { hours: 0, minutes: 0, seconds: 0 },
              };
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

  return (
    <div className="relative w-full  h-full">
      <div className="relative w-full max-w-[1440px] h-full px-10 py-20 mx-auto">
        <h1 className="text-2xl font-bold text-[#0B2A6E] uppercase mb-6">
          Flash Sale
        </h1>

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
