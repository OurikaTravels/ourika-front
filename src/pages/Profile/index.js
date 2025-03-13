"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Calendar, Camera, Edit2 } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"


export default function ProfilePage() {
  const { theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+212 666-666666",
    address: "123 Main St, Marrakech",
    birthDate: "1990-01-01"
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsEditing(false)
  }

  return (
    <div className={`flex flex-col transition-colors duration-200 ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
    }`}>
      
      <div className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          <div className={`shadow rounded-lg transition-colors duration-200 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="relative h-32 bg-gradient-to-r from-[#ff5d5d] to-[#ff4040] rounded-t-lg">
              <div className="absolute -bottom-16 left-8">
                <div className={`relative w-32 h-32 rounded-full border-4 overflow-hidden transition-colors duration-200 ${
                  theme === "dark" ? "border-gray-800 bg-gray-700" : "border-white bg-white"
                }`}>
                  <img
                    src={"/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <label className={`absolute bottom-0 inset-x-0 py-2 flex justify-center items-center cursor-pointer transition-colors duration-200 ${
                    theme === "dark" ? "bg-gray-800/80" : "bg-black/50"
                  }`}>
                    <Camera className="h-5 w-5 text-white" />
                  </label>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
                  theme === "dark" 
                    ? "bg-gray-800/20 hover:bg-gray-800/40" 
                    : "bg-white/20 hover:bg-white/40"
                }`}
              >
                <Edit2 className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="pt-20 pb-8 px-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className={`h-5 w-5 ${
                          theme === "dark" ? "text-gray-500" : "text-gray-400"
                        }`} />
                      </div>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 rounded-md shadow-sm focus:ring-[#ff5d5d] focus:border-[#ff5d5d] transition-colors duration-200 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800"
                            : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100"
                        } disabled:cursor-not-allowed`}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#ff5d5d] text-white rounded-md hover:bg-[#ff4040] transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

