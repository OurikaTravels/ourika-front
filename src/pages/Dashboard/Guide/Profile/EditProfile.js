"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { toast } from "react-hot-toast"
import guideApi from "../../../../services/guideApi"
import { Camera, Loader, User, Mail, Phone, Languages, Clock, Award, Save, X, CheckCircle } from "lucide-react"

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
  const [imageKey, setImageKey] = useState(Date.now()) // Add key for image refresh
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")

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
        // Force refresh the image by updating the key
        setProfileImage(response.data.profileImage)
        setImageKey(Date.now())
        
        // Show popup
        setPopupMessage("Profile image updated successfully")
        setShowPopup(true)
        
        toast.success('Profile image updated successfully')
        
        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false)
        }, 3000)
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
        // Show popup notification
        setPopupMessage("Profile updated successfully")
        setShowPopup(true)
        
        toast.success("Profile updated successfully")
        
        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false)
        }, 3000)
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Success Popup */}
      {showPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center z-50 animate-fadeIn">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>{popupMessage}</span>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#010001] dark:text-white">Your Profile</h1>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Profile Image Section with key for forced refresh */}
      <div className="mb-10 flex flex-col items-center">
        <div className="relative mb-4">
          <div 
            className="w-32 h-32 rounded-full border-4 border-[#FF5C5C] overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleImageClick}
          >
            {profileImage ? (
              <img
                key={imageKey} // Force re-render when key changes
                src={`http://localhost:8080/api/uploads/images/${profileImage}?v=${imageKey}`} // Add cache-busting query param
                alt="Profile"
                className="w-full h-full object-cover group-hover:opacity-80 transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <User className="w-16 h-16 text-[#FF5C5C]" />
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#010001] bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Camera className="w-8 h-8 text-white" />
            </div>

            {/* Loading Overlay */}
            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#010001] bg-opacity-60">
                <Loader className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-[#FF5C5C] rounded-full p-2 shadow-md cursor-pointer hover:bg-[#ff7a7a] transition-colors" onClick={handleImageClick}>
            <Camera className="w-4 h-4 text-white" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Click to change your profile photo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-[#010001] dark:text-white flex items-center">
            <User className="w-5 h-5 mr-2 text-[#FF5C5C]" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF5C5C] focus:border-[#FF5C5C] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <User className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF5C5C] focus:border-[#FF5C5C] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <User className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                disabled
              />
              <Mail className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF5C5C] focus:border-[#FF5C5C] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Phone className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-[#010001] dark:text-white flex items-center">
            <Award className="w-5 h-5 mr-2 text-[#FF5C5C]" />
            Professional Details
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">About You</label>
            <textarea
              name="aboutYou"
              value={formData.aboutYou}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF5C5C] focus:border-[#FF5C5C] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Tell visitors about your experience and background..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Languages</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF5C5C] focus:border-[#FF5C5C] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., English, French, Arabic"
              />
              <Languages className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Experience (years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF5C5C] focus:border-[#FF5C5C] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Clock className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Specialties</label>
              <input
                type="text"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF5C5C] focus:border-[#FF5C5C] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Mountain Climbing, Desert Tours"
              />
              <Award className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#FF5C5C] text-white py-3 px-6 rounded-lg hover:bg-[#ff7a7a] transition-colors disabled:bg-gray-400 font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-md"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
          <button
            type="button"
            className="flex-1 bg-white text-[#010001] border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base flex items-center justify-center gap-2"
            onClick={() => window.history.back()}
          >
            <X className="w-5 h-5" />
            <span>Cancel</span>
          </button>
        </div>
      </form>
      
      {/* Add some CSS for the popup animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}