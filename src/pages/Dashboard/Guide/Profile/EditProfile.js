"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { toast } from "react-hot-toast"
import guideApi from "../../../../services/guideApi"
import { Camera, Loader } from "lucide-react"

export default function EditProfile() {
  const { user } = useAuth()
  const fileInputRef = useRef(null)
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
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [profileImage, setProfileImage] = useState(null)

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
        setProfileImage(data.profileImage)
      } else {
        toast.error(response.message || "Failed to fetch profile")
      }
    } catch (error) {
      toast.error("Failed to fetch profile data")
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setIsUploadingImage(true)

    try {
      const response = await guideApi.uploadProfileImage(user.id, file)
      
      if (response.success) {
        setProfileImage(response.data.profileImage)
        toast.success('Profile image updated successfully')
      } else {
        throw new Error(response.message || "Failed to upload profile image")
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload profile image")
    } finally {
      setIsUploadingImage(false)
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
      
      {/* Profile Image Section */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div 
            className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden cursor-pointer group"
            onClick={handleImageClick}
          >
            {profileImage ? (
              <img
                src={`http://localhost:8080/api/uploads/images/${profileImage}`}
                alt="Profile"
                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>

            {/* Loading Overlay */}
            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Loader className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>

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