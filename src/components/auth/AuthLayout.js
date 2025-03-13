"use client"

import LogoImage from "../../assets/images/logo.png"

export default function AuthLayout({ children, isLoginForm = true }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-8 flex-col justify-between relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-40 w-64 h-64 rounded-full bg-[#ff5c5c] blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-[#3b82f6] blur-3xl"></div>
        </div>
        
        <div className="relative mb-8 flex items-center">
          {/* Replace SVG with Logo Image */}
          <div className="mr-4">
            <img 
              src={LogoImage} 
              alt="Ourika Travels Logo" 
              className="h-12 w-auto"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              <span className="text-[#ff5c5c]">OURIKA</span> TRAVELS
            </h1>
            <p className="text-gray-300 mt-1 text-sm font-light">Discover the beauty of Morocco</p>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center relative z-10">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              {isLoginForm 
                ? "Welcome back to your adventure portal" 
                : "Join our team of expert guides"}
            </h2>
            <p className="text-gray-300 text-lg">
              {isLoginForm
                ? "Sign in to access your bookings, manage your trips, and discover new destinations across Morocco."
                : "Share your knowledge and passion for Morocco with travelers from around the world."}
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff5c5c] to-[#ff7b7b] flex items-center justify-center mr-4 shadow-lg shadow-[#ff5c5c]/20 flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <p className="text-gray-200 pt-1">
                  {isLoginForm ? "Access exclusive tours and experiences" : "Create and manage your own tour offerings"}
                </p>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff5c5c] to-[#ff7b7b] flex items-center justify-center mr-4 shadow-lg shadow-[#ff5c5c]/20 flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <p className="text-gray-200 pt-1">
                  {isLoginForm ? "Manage your bookings in one place" : "Connect with travelers from around the world"}
                </p>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff5c5c] to-[#ff7b7b] flex items-center justify-center mr-4 shadow-lg shadow-[#ff5c5c]/20 flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <p className="text-gray-200 pt-1">
                  {isLoginForm ? "Get personalized travel recommendations" : "Earn income sharing your local expertise"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-400 relative z-10">
          © {new Date().getFullYear()} Ourika Travels. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="md:hidden flex justify-center mb-8">
            {/* Mobile logo - Replace SVG with Logo Image */}
            <div className="flex flex-col items-center">
              <img 
                src={LogoImage} 
                alt="Ourika Travels Logo" 
                className="h-12 w-auto mb-2"
              />
              <h2 className="text-xl font-bold">
                <span className="text-[#ff5c5c]">OURIKA</span> TRAVELS
              </h2>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}