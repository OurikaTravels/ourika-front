"use client"

import { useState, useEffect } from "react"
import categoryApi from "../../services/categoryApi"
import { toast } from "react-hot-toast"

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories()
      if (response.success) {
        setCategories(response.data)
        if (response.data.length > 0) {
          setActiveCategory(response.data[0].id)
        }
      } else {
        toast.error(response.message || "Failed to fetch categories")
      }
    } catch (error) {
      toast.error("Failed to load categories")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full mt-8 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto py-4">
          <div className="animate-pulse flex space-x-4 overflow-x-auto px-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full min-w-[100px]"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mt-8 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="container mx-auto relative">
        <div className="flex items-center justify-start gap-4 py-4 overflow-x-auto px-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-6 py-2 rounded-full transition-all duration-200 
                whitespace-nowrap text-sm font-medium
                ${
                  activeCategory === category.id
                    ? "bg-[#ff5d5d] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

