"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { toast } from "react-hot-toast"
import { Loader, AlertTriangle, CheckCircle, XCircle, User, Globe, Mail, Save } from "lucide-react"
import touristApi from "../../../../services/touristApi"

export default function TouristProfile() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationality: "",
    verified: false,
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isEdited, setIsEdited] = useState(false)

  useEffect(() => {
    fetchTouristData()
  }, [])

  const fetchTouristData = async () => {
    if (!user?.id) return

    try {
      const response = await touristApi.getTouristById(user.id)
      if (response.success) {
        const { data } = response
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          nationality: data.nationality || "",
          verified: data.verified || false,
          role: data.role || "",
        })
      } else {
        toast.error(response.message || "Failed to fetch profile")
      }
    } catch (error) {
      toast.error("Failed to fetch profile data")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setIsEdited(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await touristApi.updateTouristProfile(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nationality: formData.nationality,
      })

      if (response.success) {
        toast.success("Profile updated successfully")
        setIsEdited(false)
      } else {
        throw new Error(response.message || "Failed to update profile")
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ff5d5d]/10 to-[#ff7b7b]/10 px-6 py-8 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {formData.verified ? (
                <div className="flex items-center text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              ) : (
                <div className="flex items-center text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                  <XCircle className="w-4 h-4 mr-1.5" />
                  <span className="text-sm font-medium">Not Verified</span>
                </div>
              )}
              <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                <span className="text-sm font-medium capitalize">{formData.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {!formData.verified && (
            <div className="mb-8 bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-800">Email Verification Required</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Please verify your email address to access all features. Check your inbox for the verification link.
                  </p>
                  <button className="mt-2 text-sm font-medium text-amber-800 hover:text-amber-900 underline">
                    Resend verification email
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff5d5d]/20 focus:border-[#ff5d5d] transition-colors"
                    placeholder="Your first name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff5d5d]/20 focus:border-[#ff5d5d] transition-colors"
                    placeholder="Your last name"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  placeholder="Your email address"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nationality</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality || ""}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff5d5d]/20 focus:border-[#ff5d5d] transition-colors"
                  placeholder="Your nationality"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !isEdited}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 font-medium text-white ${
                  isEdited
                    ? "bg-gradient-to-r from-[#ff5d5d] to-[#ff7b7b] hover:shadow-md disabled:opacity-70"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

