"use client"

import { useState, useRef, useEffect } from "react"
import { User, HelpCircle, LogOut, ChevronDown, UserCircle, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AuthModal from "../auth/AuthModal"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLoginClick = () => {
    setIsOpen(false)
    setIsAuthModalOpen(true)
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate("/")
      setIsOpen(false)
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const handleSupportClick = () => {
    navigate("/support")
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ff5d5d]/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-[#ff5d5d]/10 flex items-center justify-center">
          <User className="h-5 w-5 text-[#049769]" />
        </div>
        {isAuthenticated && (
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-lg border  bg-white z-50 overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-top-5">
          <div className="p-5">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-[#ff5d5d]/10 flex items-center justify-center flex-shrink-0">
                    <UserCircle className="h-7 w-7 text-[#049769]" />
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">{user.firstName || user.email}</h2>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    to={user.role === "tourist" ? "/tourist/profile" : "/guide/profile/edit-profile"}
                    className="w-full flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50 text-gray-700 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3 text-gray-500 group-hover:text-[#049769] transition-colors" />
                    <span className="font-medium">Edit Profile</span>
                  </Link>

                  <button
                    onClick={handleSupportClick}
                    className="w-full flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50 text-gray-700 group"
                  >
                    <HelpCircle className="h-5 w-5 mr-3 text-gray-500 group-hover:text-[#049769] transition-colors" />
                    <span className="font-medium">Support</span>
                  </button>

                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-red-50 text-[#049769] group"
                    >
                      <LogOut className="h-5 w-5 mr-3 group-hover:text-[#049769]" />
                      <span className="font-medium">Log out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#049769]/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[#049769]" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Welcome to Ourika</h2>
                </div>

                <button
                  onClick={handleLoginClick}
                  className="w-full py-3 px-4 rounded-lg bg-[#049769] text-white hover:shadow-md transition-all duration-200 mb-4 flex items-center justify-center font-medium"
                >
                  <User className="h-5 w-5 mr-2" />
                  Log in or sign up
                </button>

                <button
                  onClick={handleSupportClick}
                  className="w-full flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50 text-gray-700 group"
                >
                  <HelpCircle className="h-5 w-5 mr-3 text-gray-500 group-hover:text-[#049769] Lo transition-colors" />
                  <span className="font-medium">Support</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}  />
    </div>
  )
}

export default ProfileDropdown

