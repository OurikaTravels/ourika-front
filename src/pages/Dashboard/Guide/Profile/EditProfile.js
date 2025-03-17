"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { toast } from "react-hot-toast"
import guideApi from "../../../../services/guideApi"

export default function EditProfile() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    aboutYou: "",
    language: "",
    speciality: "",
    experience: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchGuideProfile()
  }, [])

  const fetchGuideProfile = async () => {
    if (!user?.id) return

    try {
      const response = await guideApi.getGuideProfile(user.id)
      if (response.success) {
        const { data } = response
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          aboutYou: data.aboutYou || "",
          language: data.language || "",
          speciality: data.speciality || "",
          experience: data.experience || "",
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        aboutYou: formData.aboutYou,
        speciality: formData.speciality,
        language: formData.language,
        experience: parseInt(formData.experience, 10) || 0,
      }

      const response = await guideApi.updateGuideProfile(user.id, profileData)
      
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">About You</label>
          <textarea
            name="aboutYou"
            value={formData.aboutYou}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Languages</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., English, French, Arabic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Specialties</label>
          <input
            type="text"
            name="speciality"
            value={formData.speciality}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Mountain Climbing, Desert Tours"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  )
}