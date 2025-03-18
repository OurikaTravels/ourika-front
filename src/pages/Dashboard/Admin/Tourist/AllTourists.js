"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { Search, Loader, User } from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar";
import touristApi from "../../../../services/touristApi";

export default function AllTourists() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("users");
  const [notifications] = useState(3);
  const [tourists, setTourists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTourists();
  }, []);

  const fetchTourists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await touristApi.getAllTourists();
      console.log('API Response:', response); // For debugging
      
      if (response.success) {
        // Correctly access the data array from the response
        setTourists(response.data || []);
        if (response.message) {
          toast.success(response.message);
        }
      } else {
        throw new Error(response.message || "Failed to fetch tourists");
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching tourists";
      setError(errorMessage);
      toast.error(errorMessage);
      setTourists([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTourists = tourists.filter((tourist) =>
    tourist &&
    (tourist.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     tourist.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     tourist.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     tourist.nationality?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <DashboardHeader user={user} notifications={notifications} />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Tourists</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage tourist accounts</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tourists..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader className="w-8 h-8 text-[#ff5c5c] animate-spin" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Loading tourists...</span>
              </div>
            ) : filteredTourists.length === 0 ? (
              <div className="text-center p-12">
                <User className="w-16 h-16 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No tourists match your search criteria" : "No tourists found"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nationality
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTourists.map((tourist) => (
                      <tr key={tourist.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {tourist.firstName} {tourist.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {tourist.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {tourist.nationality}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {tourist.role}
                          </span>
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
