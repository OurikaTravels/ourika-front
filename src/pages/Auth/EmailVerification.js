"use client"

import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { Mail, CheckCircle, ArrowRight } from "lucide-react"

export default function EmailVerification() {
  const location = useLocation()
  const email = location.state?.email || "your email"
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#ff5c5c]">OURIKA TRAVELS</h1>
          <p className="text-gray-500 mt-2">Guide Registration</p>
        </div>

        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
         
          <div className="bg-[#111926] p-8 flex flex-col items-center">
            <div className={`relative transition-all duration-1000 ${animationComplete ? "scale-100" : "scale-75"}`}>
              <div className="w-24 h-24 rounded-full bg-[#ff5c5c]/20 flex items-center justify-center">
                {animationComplete ? (
                  <CheckCircle className="h-12 w-12 text-[#ff5c5c]" />
                ) : (
                  <Mail className="h-12 w-12 text-[#ff5c5c]" />
                )}
              </div>
              {animationComplete && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white animate-bounce">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          </div>

         
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              {animationComplete ? "Registration Successful!" : "Verifying Your Email..."}
            </h2>
            <p className="text-gray-600 text-center mb-6">
              {animationComplete
                ? `We've sent a verification link to ${email}. Please check your inbox and click the link to activate your account.`
                : "Please wait while we process your registration..."}
            </p>

            <div className="space-y-4">
              {animationComplete && (
                <>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Mail className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          If you don't see the email in your inbox, please check your spam folder.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/Auth/Login"
                    className="group w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#ff5c5c] hover:bg-[#ff5c5c]/90 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      Return to Login
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </>
              )}

              {!animationComplete && (
                <div className="flex justify-center">
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-3 w-3 bg-[#ff5c5c] rounded-full"></div>
                    <div className="h-3 w-3 bg-[#ff5c5c] rounded-full"></div>
                    <div className="h-3 w-3 bg-[#ff5c5c] rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

