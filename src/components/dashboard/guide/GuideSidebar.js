"use client"

import { Link } from "react-router-dom"
import { FileText, Calendar, ChevronDown, ChevronRight, Menu, Map, User, MessageSquare } from "lucide-react"

export default function GuideSidebar({ isSidebarOpen, setIsSidebarOpen, activeSection, setActiveSection }) {
  const sidebarSections = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <Map className="w-5 h-5" />,
    },
    {
      id: "posts",
      name: "Post Management",
      icon: <FileText className="w-5 h-5" />,
      subsections: ["My Posts", "Create Post", "Drafts", "Analytics"],
    },
    {
      id: "reservations",
      name: "Reservations",
      icon: <Calendar className="w-5 h-5" />,
      subsections: ["Upcoming Tours", "Past Tours", "Requests", "Calendar"],
    },
    {
      id: "reviews",
      name: "Reviews & Ratings",
      icon: <MessageSquare className="w-5 h-5" />,
      subsections: ["All Reviews", "Responses", "Analytics"],
    },
    {
      id: "profile",
      name: "Profile",
      icon: <User className="w-5 h-5" />,
      subsections: ["Edit Profile", "Certifications", "Experience", "Settings"],
    },
  ]

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-[#111926] text-white transition-all duration-300 ease-in-out fixed h-full z-10`}
    >
      <div className="p-4 flex items-center justify-between">
        <h2 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>Guide Portal</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-4">
        {sidebarSections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className={`w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                activeSection === section.id ? "bg-gray-700 text-white" : ""
              }`}
            >
              <span className="mr-3">{section.icon}</span>
              {isSidebarOpen && (
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

            {isSidebarOpen && section.subsections && activeSection === section.id && (
              <div className="bg-gray-800 py-2">
                {section.subsections.map((subsection) => {
                  let route = `/guide/${section.id}/${subsection.toLowerCase().replace(/\s+/g, "-")}`

                  if (section.id === "profile" && subsection === "Edit Profile") {
                    route = "/guide/profile/edit-profile"
                  }

                  return (
                    <Link
                      key={subsection}
                      to={route}
                      className="flex items-center px-11 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 mr-2" />
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

