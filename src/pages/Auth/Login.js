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
        navigate("/guide/profile/edit-profile")
      } else if (user?.role === "tourist") {
        navigate("/tourist/profile")
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
      <div className="w-full">
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


          <LoadingButton isLoading={isLoading}>Sign in</LoadingButton>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/Auth/RegisterGuide")}
                className="font-medium text-[#049769]"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

