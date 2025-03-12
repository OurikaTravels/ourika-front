"use client"

import { useState, useEffect } from "react"
import { ArrowRight, MapPin, Star } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import HeroImage from "../../assets/images/hero.jpg"

export default function Hero() {
  const { theme } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

 
  const parallaxOffset = scrollPosition * 0.15

  return (
    <section className={`relative w-full h-[85vh] max-h-[800px] overflow-hidden ${
      theme === "dark" ? "bg-gray-900" : "bg-white"
    }`}>
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <img
          src={HeroImage}
          alt="Vatican Museums"
          className="w-full h-full object-cover object-center"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${
          theme === "dark" 
            ? "from-black/90 via-black/70 to-black/50" 
            : "from-black/80 via-black/60 to-black/40"
        }`} />
      </div>

      
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        
        <div
          className={`flex items-center gap-2 backdrop-blur-sm w-fit px-4 py-2 rounded-full mb-4 md:mb-6 transition-all duration-700 ease-out transform ${
            theme === "dark" ? "bg-gray-800/40" : "bg-white/20"
          } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <span className="bg-[#ff5d5d] h-2 w-2 rounded-full animate-pulse" />
          <span className={`text-xs sm:text-sm font-normal ${
            theme === "dark" ? "text-gray-300" : "text-white"
          }`}>
            Originals by OurikaTravels
          </span>
        </div>

        <div
          className={`max-w-xl md:max-w-2xl lg:max-w-3xl text-white transition-all duration-1000 ease-out transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-light mb-3 sm:mb-6 leading-tight drop-shadow-lg ${
            theme === "dark" ? "text-gray-100" : "text-white"
          }`}>
            Travel memories you'll <span className="font-normal italic text-[#ff5d5d]">never forget</span>
          </h1>
          <p className={`text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-light drop-shadow-md max-w-lg ${
            theme === "dark" ? "text-gray-200" : "text-gray-100"
          }`}>
            See the Vatican Museums like never before
          </p>

          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-[#ff5d5d]" />
              <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-200"}`}>
                Ourika, Marrakech
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-[#ff5d5d] text-[#ff5d5d]" />
                ))}
              </div>
              <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-200"}`}>
                (4.9/5 from 2,300+ reviews)
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full
                transition-all duration-300
                flex items-center justify-center gap-2 font-medium text-base sm:text-lg
                shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform
                ${theme === "dark" 
                  ? "bg-[#ff4040] hover:bg-[#ff2d2d] text-white" 
                  : "bg-[#ff5d5d] hover:bg-[#ff4040] text-white"
                }`}
            >
              Explore Tours
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2
                transition-all duration-300
                flex items-center justify-center gap-2 font-medium text-base sm:text-lg
                shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform
                ${theme === "dark"
                  ? "bg-gray-800/30 border-gray-400/50 hover:bg-gray-800/50 text-white"
                  : "bg-white/10 border-white/50 hover:bg-white/20 text-white"
                }`}
            >
              Learn More
            </button>
          </div>

        </div>

      </div>
    </section>
  )
}

