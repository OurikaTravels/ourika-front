"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { toast } from "react-hot-toast"
import { Loader, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import touristApi from "../../../../services/touristApi"

export default function TouristProfile() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationality: "",
    verified: false,
    role: ""
  })
  const [isLoading, setIsLoading] = useState(false)

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
          role: data.role || ""
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <div className="flex items-center gap-2">
          {formData.verified ? (
            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full">
              <XCircle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Not Verified</span>
            </div>
          )}
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
            <span className="text-sm font-medium">{formData.role}</span>
          </div>
        </div>
      </div>

      {!formData.verified && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Email Verification Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Please verify your email address to access all features. Check your inbox for the verification link.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full p-2 border rounded-md bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#ff5d5d] text-white py-2 px-4 rounded-md hover:bg-[#ff4040] transition-colors disabled:bg-[#ff8f8f]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Updating...
            </span>
          ) : (
            "Update Profile"
          )}
        </button>
      </form>
    </div>
  )
}
