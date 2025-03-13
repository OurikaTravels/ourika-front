"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import AuthLayout from "../../components/auth/AuthLayout"
import FormInput from "../../components/auth/FormInput"
import LoadingButton from "../../components/auth/LoadingButton"
import ErrorAlert from "../../components/auth/ErrorAlert"

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "ADMIN") {
        navigate("/Dashboard/Admin")
      } else if (user?.role === "GUIDE") {
        navigate("/Dashboard/Guide")
      } else if (user?.role === "tourist") {
        navigate("/profile")
      }
    }
  }, [isAuthenticated, navigate, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (!result.success) {
        setError(result.error || "Failed to login")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout isLoginForm={true}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#111926]">Sign in</h2>
          <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
        </div>

        <ErrorAlert error={error} />

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email"
              icon={Mail}
              required
              value={formData.email}
              onChange={handleChange}
            />

            <div className="relative">
              <FormInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                icon={Lock}
                required
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#ff5c5c] focus:ring-[#ff5c5c] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-[#ff5c5c] hover:text-[#ff5c5c]/80 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <LoadingButton isLoading={isLoading}>Sign in</LoadingButton>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/Auth/RegisterGuide")}
                className="font-medium text-[#ff5c5c] hover:text-[#ff5c5c]/80 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>

          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
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
                </svg>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Test Account</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>Email: guide2@example.com</p>
              <p>Password: password123</p>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

