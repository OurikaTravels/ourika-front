"use client"

import LogoImage from "../../assets/images/logo.png"

export default function AuthLayout({ children, isLoginForm = true }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-8 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-20 w-80 h-80 rounded-full bg-[#ff5c5c] blur-[100px] animate-pulse"></div>
          <div
            className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-[#3b82f6] blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-[#a855f7] blur-[80px] animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative mb-8 flex items-center">
          <div className="mr-5">
            <img
              src={LogoImage || "/placeholder.svg"}
              alt="Ourika Travels Logo"
              className="h-16 w-auto transition-all duration-300 hover:scale-105"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">
              <span className="text-[#ff5c5c]">OURIKA</span> TRAVELS
            </h1>
            <p className="text-gray-300 mt-1 text-sm font-light tracking-wider">Discover the beauty of Morocco</p>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center relative z-10">
          <div className="w-full">
            <h2 className="text-5xl font-bold mb-8 leading-tight">
              {isLoginForm ? "Welcome back to your adventure portal" : "Join our team of expert guides"}
            </h2>
            <p className="text-gray-300 text-xl">
              {isLoginForm
                ? "Sign in to access your bookings, manage your trips, and discover new destinations across Morocco."
                : "Share your knowledge and passion for Morocco with travelers from around the world."}
            </p>

            <div className="mt-14 space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff5c5c] to-[#ff7b7b] flex items-center justify-center mr-5 shadow-lg shadow-[#ff5c5c]/30 flex-shrink-0 transition-transform duration-300 hover:scale-110">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <p className="text-gray-200 pt-2 text-lg">
                  {isLoginForm ? "Access exclusive tours and experiences" : "Create and manage your own tour offerings"}
                </p>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff5c5c] to-[#ff7b7b] flex items-center justify-center mr-5 shadow-lg shadow-[#ff5c5c]/30 flex-shrink-0 transition-transform duration-300 hover:scale-110">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <p className="text-gray-200 pt-2 text-lg">
                  {isLoginForm ? "Manage your bookings in one place" : "Connect with travelers from around the world"}
                </p>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff5c5c] to-[#ff7b7b] flex items-center justify-center mr-5 shadow-lg shadow-[#ff5c5c]/30 flex-shrink-0 transition-transform duration-300 hover:scale-110">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <p className="text-gray-200 pt-2 text-lg">
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

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="md:hidden flex justify-center mb-8">
            <div className="flex flex-col items-center">
              <img
                src={LogoImage || "/placeholder.svg"}
                alt="Ourika Travels Logo"
                className="h-16 w-auto mb-2 transition-all duration-300 hover:scale-105"
              />
              <h2 className="text-2xl font-bold">
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

