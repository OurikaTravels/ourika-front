"use client"

import { useState, useEffect } from "react"
import { ArrowRight, MapPin, Star } from "lucide-react"
import HeroImage1 from "../../assets/images/hero.jpg"
import HeroImage2 from "../../assets/images/about.jpg"


const backgroundImages = [
  HeroImage1,
  HeroImage2,
]

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 10000) 

    window.addEventListener("scroll", handleScroll)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(imageInterval)
    }
  }, [])

  const parallaxOffset = scrollPosition * 0.15

  return (
    <section className="relative w-full h-screen max-h-[800px] overflow-hidden bg-white">
      
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-all duration-1000 ease-out"
          style={{
            transform: `translateY(${parallaxOffset}px)`,
            opacity: currentImageIndex === index ? 1 : 0,
            zIndex: currentImageIndex === index ? 1 : 0,
          }}
        >
          <img
            src={image}
            alt={`Hero background ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
      ))}

     
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImageIndex === index 
                ? "bg-white w-4" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center z-10">
        
        <div
          className={`flex items-center gap-2 backdrop-blur-sm w-fit px-4 py-2 rounded-full mb-4 md:mb-6 transition-all duration-700 ease-out transform bg-white/20 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <span className="bg-[#ff5d5d] h-2 w-2 rounded-full animate-pulse" />
          <span className="text-xs sm:text-sm font-normal text-white">
            Originals by OurikaTravels
          </span>
        </div>

        
        <div
          className={`max-w-xl md:max-w-2xl lg:max-w-3xl text-white transition-all duration-1000 ease-out transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-3 sm:mb-6 leading-tight drop-shadow-lg text-white">
            Travel memories you'll <span className="font-normal italic text-[#ff5d5d]">never forget</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-light drop-shadow-md max-w-lg text-gray-100">
            See the Vatican Museums like never before
          </p>

          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-[#ff5d5d]" />
              <span className="text-sm text-gray-200">
                Vatican City, Rome
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-[#ff5d5d] text-[#ff5d5d]" />
                ))}
              </div>
              <span className="text-sm text-gray-200">
                (4.9/5 from 2,300+ reviews)
              </span>
            </div>
          </div>

          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full
                transition-all duration-300
                flex items-center justify-center gap-2 font-medium text-base sm:text-lg
                shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform
                bg-[#ff5d5d] hover:bg-[#ff4040] text-white"
            >
              Explore Tours
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2
                transition-all duration-300
                flex items-center justify-center gap-2 font-medium text-base sm:text-lg
                shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform
                bg-white/10 border-white/50 hover:bg-white/20 text-white"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

