"use client";

import { useState, useEffect } from "react";
import categoryApi from "../../services/categoryApi";
import trekApi from "../../services/trekApi";
import TrekCard from "../common/TrekCard";
import { toast } from "react-hot-toast";

export default function TrekCardsSection() {
  const [categories, setCategories] = useState([]);
  const [treks, setTreks] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAllCategories();
        if (response.success) {
          setCategories(response.data);
        } else {
          toast.error(response.message || "Failed to fetch categories");
        }
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch treks based on active category
  useEffect(() => {
    const fetchTreks = async () => {
      setIsLoading(true);
      try {
        let response;
        if (activeCategory) {
          response = await trekApi.getTreksByCategory(activeCategory);
          console.log("Category treks response:", response); // Debug log
        } else {
          response = await trekApi.getAllTreks();
          console.log("All treks response:", response); // Debug log
        }

        if (response.success) {
          // Handle both array and nested data structure
          const treksData = Array.isArray(response.data) 
            ? response.data 
            : response.data?.data || [];
          
          setTreks(treksData);
        } else {
          toast.error(response.message || "Failed to fetch treks");
        }
      } catch (error) {
        console.error("Error fetching treks:", error); // Debug log
        toast.error("Failed to load treks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreks();
  }, [activeCategory]);

  // Debug log for rendered treks
  useEffect(() => {
    console.log("Current treks state:", treks);
  }, [treks]);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-4 pb-4">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-6 py-2 rounded-full transition-all duration-200 whitespace-nowrap text-sm font-medium
                ${!activeCategory
                  ? "bg-[#ff5d5d] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              All Treks
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all duration-200 whitespace-nowrap text-sm font-medium
                  ${activeCategory === category.id
                    ? "bg-[#ff5d5d] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Treks Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white dark:bg-gray-800 rounded-lg h-[400px]"
              />
            ))}
          </div>
        ) : treks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No treks found for this category
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {treks.map((trek) => (
              <TrekCard
                key={trek.id}
                trekId={trek.id}
                images={trek.images || []}
                title={trek.title}
                type={trek.type}
                duration={trek.duration}
                pickup={trek.pickup}
                rating={trek.rating || 0}
                reviews={trek.reviews || 0}
                price={trek.price || 0}
                currency={trek.currency || 'MAD'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
