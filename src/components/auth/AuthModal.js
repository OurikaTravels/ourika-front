"use client"

import { useState } from "react"
import { X, Mail, Lock, Eye, EyeOff, User } from "lucide-react"

const AuthModal = ({ isOpen, onClose, theme }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(isLogin ? "Login" : "Signup", { email, password, name })

  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setEmail("")
    setPassword("")
    setName("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className={`relative w-full max-w-md rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Close button */}
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
            {isLogin ? "Log in to your account" : "Create an account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (only for signup) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  Full Name
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
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 rounded-md focus:ring-[#ff5d5d] focus:border-[#ff5d5d] ${
                      theme === "dark"
                        ? "bg-gray-700 text-white placeholder-gray-400"
                        : "bg-white text-gray-900 placeholder-gray-400"
                    }`}
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
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

            {/* Password field */}
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

            {/* Forgot password (only for login) */}
            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-[#ff5d5d] hover:text-[#ff4040]">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md bg-[#ff5d5d] text-white hover:bg-[#ff4040] transition-colors duration-200 font-medium"
            >
              {isLogin ? "Log in" : "Sign up"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div
              className={`absolute inset-0 flex items-center ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className={`w-full border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`py-2 px-4 rounded-md border flex justify-center items-center ${
                theme === "dark" ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className={`py-2 px-4 rounded-md border flex justify-center items-center ${
                theme === "dark" ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </button>
          </div>

          {/* Toggle between login and signup */}
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

