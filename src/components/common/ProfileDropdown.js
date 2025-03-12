"use client"

import { useState } from "react"
import { User, Globe, Monitor, HelpCircle, Download, CreditCard, Sun, Moon } from "lucide-react"
import AuthModal from "../auth/AuthModal"
import { useTheme } from "../../context/ThemeContext"

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const handleLoginClick = () => {
    setIsOpen(false)
    setIsAuthModalOpen(true)
  }

  const handleThemeChange = () => {
    toggleTheme()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-gray-700 hover:text-[#ff5d5d] transition-colors duration-200 ${
          theme === "dark" ? "text-gray-300 hover:text-[#ff5d5d]" : "text-gray-700 hover:text-[#ff5d5d]"
        }`}
      >
        <User className="h-6 w-6" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg border z-50 ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="p-4">
            <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
              Profile
            </h2>

            <button
              onClick={handleLoginClick}
              className="w-full py-2 px-4 rounded-full bg-[#ff5d5d] text-white hover:bg-[#ff4040] transition-colors duration-200 mb-4 flex items-center justify-center font-medium"
            >
              <User className="h-5 w-5 mr-2" />
              Log in or sign up
            </button>

            <div className="space-y-2">
              <DropdownItem
                icon={<CreditCard className="h-5 w-5" />}
                label="Currency"
                value="MAD (د.م.)"
                theme={theme}
              />
              <DropdownItem icon={<Globe className="h-5 w-5" />} label="Language" value="English" theme={theme} />

              {/* Theme Toggle Item */}
              <button
                onClick={handleThemeChange}
                className="w-full flex items-center justify-between py-2 px-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Monitor className="h-5 w-5" />
                  <span className="ml-3">Appearance</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">{theme === "dark" ? "Dark" : "Light"}</span>
                  {theme === "dark" ? <Moon className="h-5 w-5 ml-2" /> : <Sun className="h-5 w-5 ml-2" />}
                </div>
              </button>

              <DropdownItem icon={<HelpCircle className="h-5 w-5" />} label="Support" theme={theme} />
              <DropdownItem icon={<Download className="h-5 w-5" />} label="Download the app" theme={theme} />
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} theme={theme} />
    </div>
  )
}

const DropdownItem = ({ icon, label, value, theme }) => (
  <button
    className={`w-full flex items-center justify-between py-2 px-1 rounded-md transition-colors duration-200 ${
      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
    }`}
  >
    <div className={`flex items-center ${theme === "dark" ? "text-gray-100" : "text-gray-700"}`}>
      {icon}
      <span className="ml-3">{label}</span>
    </div>
    {value && (
      <div className={`flex items-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        <span className="text-sm">{value}</span>
        <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    )}
  </button>
)

export default ProfileDropdown

