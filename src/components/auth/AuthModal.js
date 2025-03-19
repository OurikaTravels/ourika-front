"use client"

import { useState } from "react"
import { X, Mail, Lock, Eye, EyeOff, User, Globe } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { toast } from "react-hot-toast"
import { authApi } from "../../services/api" 

const AuthModal = ({ isOpen, onClose, theme }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [nationality, setNationality] = useState("") // Add this state
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()

  // Add nationality options
  const nationalities = [
    "Select Nationality",
    "American",
    "British",
    "Canadian",
    "Chinese",
    "French",
    "German",
    "Indian",
    "Italian",
    "Japanese",
    "Korean",
    "Russian",
    "Spanish",
    "Other"
  ]

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        // Handle login
        const result = await login(email, password)
        if (result.success) {
          toast.success("Logged in successfully")
          onClose()
        } else {
          toast.error(result.error || "Login failed")
        }
      } else {
        // Handle tourist registration
        const touristData = {
          firstName,
          lastName,
          email,
          password,
          nationality // Add nationality to the request
        }
        
        const result = await authApi.registerTourist(touristData)
        toast.success("Tourist account created successfully")
        // Automatically switch to login mode after successful registration
        setIsLogin(true)
        setEmail("")
        setPassword("")
        setFirstName("")
        setLastName("")
        setNationality("")
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setEmail("")
    setPassword("")
    setFirstName("")
    setLastName("")
    setNationality("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className={`relative w-full max-w-md rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >

        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Log in to your account" : "Create a tourist account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label
                    htmlFor="firstName"
                    className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                  >
                    First Name
                  </label>
                  <div
                    className={`relative rounded-md shadow-sm border ${
                      theme === "dark" ? "border-gray-600" : "border-gray-300"
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2 rounded-md focus:ring-[#ff5d5d] focus:border-[#ff5d5d] ${
                        theme === "dark"
                          ? "bg-gray-700 text-white placeholder-gray-400"
                          : "bg-white text-gray-900 placeholder-gray-400"
                      }`}
                      placeholder="John"
                      required={!isLogin}
                    />
                  </div>
                </div>
                
                <div>
                  <label
                    htmlFor="lastName"
                    className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Last Name
                  </label>
                  <div
                    className={`relative rounded-md shadow-sm border ${
                      theme === "dark" ? "border-gray-600" : "border-gray-300"
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2 rounded-md focus:ring-[#ff5d5d] focus:border-[#ff5d5d] ${
                        theme === "dark"
                          ? "bg-gray-700 text-white placeholder-gray-400"
                          : "bg-white text-gray-900 placeholder-gray-400"
                      }`}
                      placeholder="Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="nationality"
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Nationality
                  </label>
                  <div
                    className={`relative rounded-md shadow-sm border ${
                      theme === "dark" ? "border-gray-600" : "border-gray-300"
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className={`h-5 w-5 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`} />
                    </div>
                    <select
                      id="nationality"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      required
                      className={`block w-full pl-10 pr-3 py-2 rounded-md focus:ring-[#ff5d5d] focus:border-[#ff5d5d] ${
                        theme === "dark"
                          ? "bg-gray-700 text-white placeholder-gray-400"
                          : "bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    >
                      {nationalities.map((nat) => (
                        <option 
                          key={nat} 
                          value={nat === "Select Nationality" ? "" : nat}
                          disabled={nat === "Select Nationality"}
                        >
                          {nat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              >
                Email
              </label>
              <div
                className={`relative rounded-md shadow-sm border ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 rounded-md focus:ring-[#ff5d5d] focus:border-[#ff5d5d] ${
                    theme === "dark"
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-white text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              >
                Password
              </label>
              <div
                className={`relative rounded-md shadow-sm border ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-2 rounded-md focus:ring-[#ff5d5d] focus:border-[#ff5d5d] ${
                    theme === "dark"
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-white text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="••••••••"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md bg-[#ff5d5d] text-white hover:bg-[#ff4040] transition-colors duration-200 font-medium disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : isLogin ? (
                "Log in"
              ) : (
                "Sign up as Tourist"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-1 text-[#ff5d5d] hover:text-[#ff4040] font-medium"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
