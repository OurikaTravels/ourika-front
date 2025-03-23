"use client"

import { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"

const WishlistHeader = ({ theme }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Spacer div when header is fixed */}
      {isScrolled && <div className="h-16 md:h-20" />}

      <div
        className={`${theme === "dark" ? "bg-[#0F172A]" : "bg-white"} ${
          isScrolled ? "fixed top-0 left-0 right-0 z-50 border-b shadow-sm " + 
          (theme === "dark" ? "border-gray-800" : "border-gray-200") : ""
        } transition-all duration-200`}
      >
        <div className="container mx-auto px-4">
          <div className={`${isScrolled ? "h-16 md:h-20" : "py-4 md:py-6"} flex flex-col md:flex-row items-start md:items-center justify-between`}>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Link to="/" className="text-[#16af2a] hover:text-[#2eb335] flex items-center gap-1 transition-colors duration-200">
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </Link>
              <h1 className={`text-xl md:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>My Wishlist</h1>
            </div>

            {!isScrolled && (
              <p className={`text-sm md:text-base ${theme === "dark" ? "text-gray-400" : "text-gray-600"} md:max-w-2xl mt-2 md:mt-0`}>
                Manage your saved experiences and plan your next adventure
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default WishlistHeader