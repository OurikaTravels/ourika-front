"use client"

import { Link } from "react-router-dom"
import {
  Users,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  Map,
  User,
  Tag,
  LayoutDashboard,
} from "lucide-react"

export default function DashboardSidebar({ isSidebarOpen, setIsSidebarOpen, activeSection, setActiveSection }) {
  const sidebarSections = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      link: "/Dashboard/Admin"
    },
    {
      id: "treks",
      name: "Trek Management",
      icon: <Map className="w-5 h-5" />,
      subsections: ["All Treks", "Service Management", "Highlights Management"],
    },
    {
      id: "guides",
      name: "Guide Management",
      icon: <User className="w-5 h-5" />,
      subsections: ["All Guides"],
    },
    {
      id: "reservations",
      name: "Reservations",
      icon: <Calendar className="w-5 h-5" />,
      subsections: ["All Reservations"],
    },
    {
      id: "users",
      name: "Tourist Management",
      icon: <Users className="w-5 h-5" />,
      subsections: ["All Tourist"],
    },
    {
      id: "categories",
      name: "Categories",
      icon: <Tag className="w-5 h-5" />,
      subsections: ["All Categories"],
    },
  ]

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-[#191b20] text-white transition-all duration-300 ease-in-out fixed h-full z-10 border-r border-gray-800`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-[#fe5532] flex items-center justify-center mr-3">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h2 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>Admin Panel</h2>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-[#fe5532]/20 text-[#fe5532] transition-colors"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-4 overflow-y-auto h-[calc(100%-64px)]">
        {sidebarSections.map((section) => (
          <div key={section.id} className="mb-1">
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
              <span className={`mr-3 ${activeSection === section.id ? "text-[#fe5532]" : ""}`}>{section.icon}</span>
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
              <div className="bg-[#232630] py-1">
                {section.subsections.map((subsection) => {
 
                  let route = `/admin/${section.id}/${subsection.toLowerCase().replace(/\s+/g, "-")}`

                  if (section.id === "categories") {
                    if (subsection === "All Categories") {
                      route = "/admin/categories/all-categories"
                    } else if (subsection === "Add Category") {
                      route = "/admin/categories/add-category"
                    }
                  } else if (section.id === "treks") {
                    if (subsection === "All Treks") {
                      route = "/admin/treks/all-treks"
                    } else if (subsection === "Add Trek") {
                      route = "/admin/treks/add-trek"
                    } else if (subsection === "Service Management") {
                      route = "/admin/treks/service-management"
                    } else if (subsection === "Highlights Management") {
                      route = "/admin/treks/highlights-management"
                    }
                  } else if (section.id === "guides") {
                    if (subsection === "All Guides") {
                      route = "/admin/guides/all-guides"
                    } else if (subsection === "Applications") {
                      route = "/admin/guides/applications"
                    } else if (subsection === "Performance") {
                      route = "/admin/guides/performance"
                    } else if (subsection === "Schedule") {
                      route = "/admin/guides/schedule"
                    } else if (subsection === "Edit Profile") {
                      route = "/guide/profile/edit"
                    }
                  } else if (section.id === "reservations") {
                    if (subsection === "All Reservations") {
                      route = "/admin/reservations/all-reservations"
                    } else if (subsection === "Pending") {
                      route = "/admin/reservations/pending"
                    } else if (subsection === "Confirmed") {
                      route = "/admin/reservations/confirmed"
                    } else if (subsection === "Cancelled") {
                      route = "/admin/reservations/cancelled"
                    }
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

