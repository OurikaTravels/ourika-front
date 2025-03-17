"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { Link } from "react-router-dom";
import { Search, Loader, Info, CheckCircle, XCircle, Calendar, User, Globe, Award } from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar";
import guideApi from "../../../../services/guideApi";

export default function AllGuides() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("guides");
  const [notifications] = useState(3);
  const [guides, setGuides] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [sortByReservation, setSortByReservation] = useState(false);

  // Fetch guides on component mount or when sortByReservation changes
  useEffect(() => {
    fetchGuides();
  }, [sortByReservation]);

  // Fetch guides from the API
  const fetchGuides = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = sortByReservation
        ? await guideApi.getGuidesOrderedByReservationDate()
        : await guideApi.getAllGuides();

      console.log('API Response:', response); // Add this debug log

      if (response.success) {
        setGuides(response.data || []);
        console.log('Guides set:', response.data); // Add this debug log
      } else {
        const errorMessage = response.message || "Failed to fetch guides";
        setError(errorMessage);
        toast.error(errorMessage);
        setGuides([]);
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred while fetching guides";
      setError(errorMessage);
      toast.error(errorMessage);
      setGuides([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle guide validation
  const handleToggleValidation = async (guideId, guideName, currentStatus) => {
    const action = currentStatus ? "invalidate" : "validate";
    if (window.confirm(`Are you sure you want to ${action} ${guideName}?`)) {
      setIsValidating(true);
      try {
        const response = await guideApi.toggleGuideValidation(guideId);
        if (response.success) {
          setGuides(guides.map((guide) =>
            guide.id === guideId ? { ...guide, isValidateGuide: !guide.isValidateGuide } : guide
          ));
          toast.success(`${guideName} has been ${action}d successfully`);
        } else {
          throw new Error(response.message || `Failed to ${action} guide`);
        }
      } catch (err) {
        const errorMessage = err.message || `An error occurred while ${action}ing the guide`;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsValidating(false);
      }
    }
  };

  // Toggle sorting by reservation date
  const toggleSortByReservation = () => {
    setSortByReservation(!sortByReservation);
  };

  // Filter guides based on search term
  const filteredGuides = Array.isArray(guides)
    ? guides.filter((guide) =>
        `${guide.firstName} ${guide.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.language?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    console.log('Filtered Guides:', filteredGuides);
  }, [filteredGuides]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
    
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Guides</h1>
              <button
                onClick={toggleSortByReservation}
                className={`flex items-center px-4 py-2 ${
                  sortByReservation
                    ? "bg-[#ff5c5c] text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                } rounded-md hover:bg-[#ff4040] hover:text-white transition-colors`}
              >
                <Calendar className="w-5 h-5 mr-2" />
                {sortByReservation ? "Sorted by Reservation" : "Sort by Reservation Date"}
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Manage and validate tour guides</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search guides by name, email, or language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Guides Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader className="w-8 h-8 text-[#ff5c5c] animate-spin" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Loading guides...</span>
              </div>
            ) : filteredGuides.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No guides match your search criteria" : "No guides found."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Guide Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Reservation
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredGuides.map((guide) => (
                      <tr key={guide.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {guide.profileImage ? (
                                <img
                                  src={`${process.env.REACT_APP_API_BASE_URL}/treks/1/images/${guide.profileImage}`}
                                  alt={`${guide.firstName} ${guide.lastName}`}
                                  className="h-10 w-10 rounded-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder.svg";
                                  }}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {`${guide.firstName} ${guide.lastName}`}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {guide.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            <Globe className="w-3 h-3 mr-1" />
                            {guide.language}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-amber-500 mr-1" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {guide.experience} years
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {guide.isValidateGuide ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Validated
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              <XCircle className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          No reservations yet
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/guide/${guide.id}`}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              View Profile
                            </Link>
                            <button
                              onClick={() => handleToggleValidation(
                                guide.id, 
                                `${guide.firstName} ${guide.lastName}`,
                                guide.isValidateGuide
                              )}
                              disabled={isValidating}
                              className={`text-${guide.isValidateGuide ? 'yellow' : 'green'}-600 
                                hover:text-${guide.isValidateGuide ? 'yellow' : 'green'}-900 
                                dark:text-${guide.isValidateGuide ? 'yellow' : 'green'}-400 
                                dark:hover:text-${guide.isValidateGuide ? 'yellow' : 'green'}-300 
                                disabled:opacity-50`}
                            >
                              {guide.isValidateGuide ? 'Invalidate' : 'Validate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}