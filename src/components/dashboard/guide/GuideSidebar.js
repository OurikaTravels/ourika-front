"use client"

import { Link } from "react-router-dom"
import { FileText, ChevronDown, ChevronRight, Menu, Map, User, X } from "lucide-react"
import { useState, useEffect } from "react"

export default function GuideSidebar({ isSidebarOpen, setIsSidebarOpen, activeSection, setActiveSection }) {
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const sidebarSections = [
    {
      id: "posts",
      name: "Post Management",
      icon: <FileText className="w-5 h-5" />, 
      subsections: ["My Posts"],
    },
    {
      id: "profile",
      name: "Profile",
      icon: <User className="w-5 h-5" />,
      subsections: ["Edit Profile"],
    },
  ]

  return (
    <aside
      className={`${
        isSidebarOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : "w-20 -translate-x-0"
      } bg-[#191b20] text-white transition-all duration-300 ease-in-out fixed h-full z-30 shadow-lg
      ${isMobile ? "w-[85%] max-w-[300px]" : "w-64"}`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <h2 className={`font-bold text-xl ${!isSidebarOpen && !isMobile && "hidden"}`}>Guide Portal</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-[#fe5532]/20 text-[#fe5532] transition-colors"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isMobile && isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <nav className="mt-2 overflow-y-auto h-[calc(100%-64px)]">
        {sidebarSections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => {
                if (section.link) {
                  window.location.href = section.link;
                } else {
                  setActiveSection(activeSection === section.id ? null : section.id);
                }
              }}
              className={`w-full flex items-center px-4 py-3 hover:bg-[#fe5532]/10 hover:text-white transition-colors ${
                activeSection === section.id ? "bg-[#fe5532]/20 text-[#fe5532]" : "text-gray-300"
              }`}
            >
              <span className="mr-3 text-[#fe5532]">{section.icon}</span>
              {(isSidebarOpen || isMobile) && (
                <>
                  <span className="flex-1 text-left">{section.name}</span>
                  {section.subsections && (
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        activeSection === section.id ? "transform rotate-180" : ""
                      }`}
                    />
                  )}
                </>
              )}
            </button>

            {(isSidebarOpen || isMobile) && section.subsections && activeSection === section.id && (
              <div className="bg-[#232630] py-1">
                {section.subsections.map((subsection) => {
                  let route = `/guide/${section.id}/${subsection.toLowerCase().replace(/\s+/g, "-")}`

                  if (section.id === "profile" && subsection === "Edit Profile") {
                    route = "/guide/profile/edit-profile"
                  }

                  return (
                    <Link
                      key={subsection}
                      to={route}
                      className="flex items-center px-11 py-2 text-sm text-gray-400 hover:text-[#fe5532] hover:bg-[#fe5532]/10 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 text-[#fe5532]" />
                      {subsection}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

