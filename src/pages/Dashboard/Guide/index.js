"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../../context/AuthContext"
import { toast } from "react-hot-toast"
import guideApi from "../../../services/guideApi"
import { Camera, Loader, User, Mail, Phone, Languages, Clock, Award, Save, X, CheckCircle, Menu } from "lucide-react"
import GuideSidebar from "../../../components/dashboard/guide/GuideSidebar"

export default function GuideDashboard() {
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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


  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsSidebarOpen(!mobile)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const response = await guideApi.getGuideProfile(user.id)
        if (response.success) {
          setFormData(response.data)
        }
      } catch (error) {
        toast.error("Failed to load profile data")
      }
    }

    if (user?.id) {
      fetchGuideData()
    }
  }, [user])

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
      const response = await guideApi.updateGuideProfile(formData)
      if (response.success) {
        toast.success("Profile updated successfully")
      } else {
        toast.error(response.message || "Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred while updating profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await guideApi.uploadProfileImage(formData)
      if (response.success) {
        toast.success("Profile image updated successfully")
      } else {
        toast.error(response.message || "Failed to upload image")
      }
    } catch (error) {
      toast.error("An error occurred while uploading image")
    }
  }

  return (
    <div className="flex h-screen bg-[#191b20]">
      <GuideSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${isMobile ? "ml-0" : isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="bg-[#232630] border-b border-gray-700 shadow-md sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-[#fe5532] hover:bg-[#fe5532]/10 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-white">Profile Settings</h1>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-[#232630] p-5 md:p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#fe5532]" />
                    Personal Information
                  </h2>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfileImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center text-sm text-[#fe5532] hover:text-[#fe5532]/80 transition-colors"
                  >
                    <Camera className="w-4 h-4 mr-1" />
                    Change Photo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-300">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#fe5532] focus:border-[#fe5532] bg-[#191b20] text-white"
                    />
                    <User className="absolute left-3 top-10 w-4 h-4 text-gray-500" />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#fe5532] focus:border-[#fe5532] bg-[#191b20] text-white"
                    />
                    <User className="absolute left-3 top-10 w-4 h-4 text-gray-500" />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border border-gray-600 rounded-lg bg-[#191b20]/50 text-gray-400 cursor-not-allowed"
                      disabled
                    />
                    <Mail className="absolute left-3 top-10 w-4 h-4 text-gray-500" />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#fe5532] focus:border-[#fe5532] bg-[#191b20] text-white"
                    />
                    <Phone className="absolute left-3 top-10 w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="bg-[#232630] p-5 md:p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4 text-white flex items-center">
                  <Award className="w-5 h-5 mr-2 text-[#fe5532]" />
                  Professional Details
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-300">About You</label>
                  <textarea
                    name="aboutYou"
                    value={formData.aboutYou}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#fe5532] focus:border-[#fe5532] bg-[#191b20] text-white"
                    placeholder="Tell visitors about your experience and background..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Languages</label>
                    <input
                      type="text"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#fe5532] focus:border-[#fe5532] bg-[#191b20] text-white"
                      placeholder="e.g., English, French, Arabic"
                    />
                    <Languages className="absolute left-3 top-10 w-4 h-4 text-gray-500" />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Experience (years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#fe5532] focus:border-[#fe5532] bg-[#191b20] text-white"
                    />
                    <Clock className="absolute left-3 top-10 w-4 h-4 text-gray-500" />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Specialties</label>
                    <input
                      type="text"
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#fe5532] focus:border-[#fe5532] bg-[#191b20] text-white"
                      placeholder="e.g., Mountain Climbing, Desert Tours"
                    />
                    <Award className="absolute left-3 top-10 w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#fe5532] text-white py-3 px-6 rounded-lg hover:bg-[#fe5532]/90 transition-colors disabled:bg-gray-600 disabled:text-gray-400 font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-md"
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
                  className="flex-1 bg-[#232630] text-white border border-gray-600 py-3 px-6 rounded-lg hover:bg-[#232630]/80 transition-colors font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                  onClick={() => window.history.back()}
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

