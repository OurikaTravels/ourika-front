"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Lock, Phone, Calendar, Award, Globe, Briefcase, FileText, Eye, EyeOff } from "lucide-react"
import { authApi } from "../../services/api"
import AuthLayout from "../../components/auth/AuthLayout"
import FormInput from "../../components/auth/FormInput"
import LoadingButton from "../../components/auth/LoadingButton"
import ErrorAlert from "../../components/auth/ErrorAlert"

export default function RegisterGuide() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthday: "",
    language: "English",
    experience: "",
    phone: "",
    speciality: "",
    licenseNumber: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const guideData = {
        ...formData,
        birthday: Number.parseInt(formData.birthday),
        experience: Number.parseInt(formData.experience),
      }

      const result = await authApi.registerGuide(guideData)

      if (result.success) {
        console.log(result.data)
        // First redirect to email verification
        navigate("/Auth/EmailVerification", { 
          state: { 
            email: formData.email,
            redirectAfterVerification: "/guide/profile/edit-profile" // Add this to handle post-verification redirect
          } 
        })
      } else {
        setError(result.message || "Registration failed")
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout isLoginForm={false}>
      <div className="w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#111926]">Guide Registration</h2>
          <p className="text-gray-500 mt-2">Join our community of expert guides.</p>
        </div>

        <ErrorAlert error={error} />

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="firstName"
                name="firstName"
                label="First Name"
                icon={User}
                required
                value={formData.firstName}
                onChange={handleChange}
              />
              <FormInput
                id="lastName"
                name="lastName"
                label="Last Name"
                icon={User}
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

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

            
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="phone"
                name="phone"
                type="tel"
                label="Phone Number"
                icon={Phone}
                required
                value={formData.phone}
                onChange={handleChange}
              />
              <FormInput
                id="birthday"
                name="birthday"
                type="number"
                label="Birth Year"
                icon={Calendar}
                min="1950"
                max="2005"
                required
                value={formData.birthday}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Language
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="language"
                    name="language"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm "
                    value={formData.language}
                    onChange={handleChange}
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Spanish">Spanish</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>

              <FormInput
                id="experience"
                name="experience"
                type="number"
                label="Years of Experience"
                icon={Briefcase}
                min="0"
                max="50"
                required
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="speciality" className="block text-sm font-medium text-black mb-1">
                  Speciality
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Award className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="speciality"
                    name="speciality"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#ff5c5c] focus:border-[#ff5c5c]"
                    value={formData.speciality}
                    onChange={handleChange}
                  >
                    <option value="">Select a speciality</option>
                    <option value="Hiking">Hiking</option>
                    <option value="Desert Tours">Desert Tours</option>
                    <option value="City Tours">City Tours</option>
                    <option value="Cultural Tours">Cultural Tours</option>
                    <option value="Food Tours">Food Tours</option>
                  </select>
                </div>
              </div>

              <FormInput
                id="licenseNumber"
                name="licenseNumber"
                label="License Number"
                icon={FileText}
                required
                value={formData.licenseNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <LoadingButton isLoading={isLoading}>Register as Guide</LoadingButton>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/Auth/Login")}
                className="font-medium text-[#049769] "
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

