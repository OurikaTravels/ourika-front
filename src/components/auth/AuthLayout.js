"use client"

import LogoImage from "../../assets/images/logo.png"

export default function AuthLayout({ children, isLoginForm = true }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel - Green gradient background */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-900 to-emerald-700 text-white p-8 flex-col justify-between relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-20 w-80 h-80 rounded-full bg-emerald-400 blur-[100px] animate-pulse"></div>
          <div
            className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-teal-500 blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-green-300 blur-[80px] animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Logo and brand */}
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
              <span className="text-emerald-400">OURIKA</span> TRAVELS
            </h1>
            <p className="text-emerald-100 mt-1 text-sm font-light tracking-wider">Discover the beauty of Morocco</p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow flex items-center justify-center relative z-10">
          <div className="w-full">
            <h2 className="text-5xl font-bold mb-8 leading-tight">
              {isLoginForm ? "Welcome back to your adventure portal" : "Join our team of expert guides"}
            </h2>
            <p className="text-emerald-100 text-xl">
              {isLoginForm
                ? "Sign in to access your bookings, manage your trips, and discover new destinations across Morocco."
                : "Share your knowledge and passion for Morocco with travelers from around the world."}
            </p>

            <div className="mt-14 space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mr-5 shadow-lg shadow-emerald-600/30 flex-shrink-0 transition-transform duration-300 hover:scale-110">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <p className="text-white pt-2 text-lg">
                  {isLoginForm ? "Access exclusive tours and experiences" : "Create and manage your own tour offerings"}
                </p>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mr-5 shadow-lg shadow-emerald-600/30 flex-shrink-0 transition-transform duration-300 hover:scale-110">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <p className="text-white pt-2 text-lg">
                  {isLoginForm ? "Manage your bookings in one place" : "Connect with travelers from around the world"}
                </p>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mr-5 shadow-lg shadow-emerald-600/30 flex-shrink-0 transition-transform duration-300 hover:scale-110">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <p className="text-white pt-2 text-lg">
                  {isLoginForm ? "Get personalized travel recommendations" : "Earn income sharing your local expertise"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-emerald-200 relative z-10">
          © {new Date().getFullYear()} Ourika Travels. All rights reserved.
        </div>
      </div>

      {/* Right panel - White background with form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-white to-emerald-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8 border border-emerald-100">
          {/* Mobile logo */}
          <div className="md:hidden flex justify-center mb-8">
            <div className="flex flex-col items-center">
              <img
                src={LogoImage || "/placeholder.svg"}
                alt="Ourika Travels Logo"
                className="h-16 w-auto mb-2 transition-all duration-300 hover:scale-105"
              />
              <h2 className="text-2xl font-bold">
                <span className="text-emerald-600">OURIKA</span> TRAVELS
              </h2>
            </div>
          </div>
          
          {/* Form content */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-emerald-100 opacity-50 -z-10"></div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-emerald-200 opacity-40 -z-10"></div>
            
            {/* Actual form content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
