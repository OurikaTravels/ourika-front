"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { toast } from "react-hot-toast"
import guideApi from "../../../../services/guideApi"
import { Camera, Loader, User, Mail, Phone, Languages, Clock, Award, Save, X, CheckCircle, Menu } from "lucide-react"
import GuideSidebar from "../../../../components/dashboard/guide/GuideSidebar"

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
  const [imageKey, setImageKey] = useState(Date.now()) 
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")
  const [isMobile, setIsMobile] = useState(false)

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


    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }


    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setIsUploadingImage(true)

    try {
      const response = await guideApi.uploadProfileImage(user.id, file)

      if (response.success) {
        setProfileImage(response.data.profileImage)
        setImageKey(Date.now())

      
        setPopupMessage("Profile image updated successfully")
        setShowPopup(true)

        toast.success("Profile image updated successfully")

    
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
        experience: Number.parseInt(formData.experience, 10) || 0,
      }

      const response = await guideApi.updateGuideProfile(user.id, profileData)

      if (response.success) {
 
        setPopupMessage("Profile updated successfully")
        setShowPopup(true)

        toast.success("Profile updated successfully")


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
    <div className="min-h-screen bg-[#191b20] text-white flex">
      <GuideSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />


      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className={`flex-1 transition-all duration-300 ${isMobile ? "ml-0" : isSidebarOpen ? "ml-64" : "ml-20"}`}>

        {showPopup && (
          <div className="fixed top-4 right-4 bg-[#56acfe] text-white p-4 rounded-lg shadow-lg flex items-center z-50 animate-fadeIn">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{popupMessage}</span>
          </div>
        )}

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
            <h1 className="text-lg font-semibold text-white">Edit Profile</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400 hidden md:flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">

            <div className="mb-8 flex flex-col items-center bg-[#232630] p-6 rounded-lg shadow-md">
              <div className="relative mb-4">
                <div
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#fe5532] overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleImageClick}
                >
                  {profileImage ? (
                    <img
                      key={imageKey} 
                      src={`http://localhost:8080/api/uploads/images/${profileImage}?v=${imageKey}`} // Add cache-busting query param
                      alt="Profile"
                      className="w-full h-full object-cover group-hover:opacity-80 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#191b20] flex items-center justify-center">
                      <User className="w-14 h-14 text-[#fe5532]" />
                    </div>
                  )}

 
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Camera className="w-8 h-8 text-white" />
                  </div>


                  {isUploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                      <Loader className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div
                  className="absolute bottom-0 right-0 bg-[#fe5532] rounded-full p-2 shadow-md cursor-pointer hover:bg-[#fe5532]/80 transition-colors"
                  onClick={handleImageClick}
                >
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
              <p className="text-sm text-gray-400">Click to change your profile photo</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-[#232630] p-5 md:p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4 text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#fe5532]" />
                  Personal Information
                </h2>
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
    </div>
  )
}

