"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Clock, MapPin, Star, Share2, Heart, Users, Globe, Calendar } from "lucide-react"
import { toast } from "react-hot-toast"
import trekApi from "../../../../services/trekApi"

export default function TrekPreview() {
  const { id } = useParams()
  const [trek, setTrek] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    fetchTrekDetails()
  }, [id])

  const fetchTrekDetails = async () => {
    try {
      const response = await trekApi.getTrekById(id)
      if (response.success) {
        setTrek(response.data)
      } else {
        toast.error(response.message || "Failed to fetch trek details")
      }
    } catch (error) {
      console.error("Error fetching trek:", error)
      toast.error("An error occurred while fetching trek details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff5c5c]"></div>
      </div>
    )
  }

  if (!trek) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Trek not found</h2>
          <Link to="/admin/treks/all-treks" className="text-[#ff5c5c] hover:text-[#ff4040] transition-colors">
            Return to trek list
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/admin/treks/all-treks"
                className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{trek.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {trek.images && trek.images.length > 0 ? (
            <>
              <div className="col-span-2 aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src={`http://localhost:8080/api/treks/${id}/images/${trek.images[activeImageIndex]?.path}`}
                  alt={trek.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-rows-2 gap-4">
                {trek.images.slice(1, 3).map((image, index) => (
                  <div key={image.id} className="aspect-[4/3] rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:8080/api/treks/${id}/images/${image.path}`}
                      alt={`${trek.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-3 aspect-[16/9] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No images available</p>
            </div>
          )}
        </div>

        {/* Trek Details */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{trek.title}</h2>
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="text-gray-700 dark:text-gray-300 mr-2">New</span>
                <span className="text-gray-500 dark:text-gray-400">(No reviews yet)</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{trek.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">{trek.duration}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">{trek.startLocation}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Small group</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">English, French, Spanish</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            {trek.highlights && trek.highlights.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Highlights</h3>
                <ul className="space-y-2">
                  {trek.highlights.map((highlight) => (
                    <li key={highlight.id} className="flex items-start">
                      <span className="w-2 h-2 mt-2 bg-[#ff5c5c] rounded-full mr-3"></span>
                      <span className="text-gray-600 dark:text-gray-400">{highlight.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Activities */}
            {trek.activities && trek.activities.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Activities</h3>
                <div className="space-y-6">
                  {trek.activities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#ff5c5c] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                        <Clock className="w-6 h-6 text-[#ff5c5c]" />
                      </div>
                      <div>
                        <h4 className="text-gray-900 dark:text-white font-medium">{activity.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{activity.description}</p>
                        {activity.type === "TRANSPORTATION" && (
                          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{activity.transportDuration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-8">
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">${trek.price}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">per person</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Participants
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent">
                      <option>1 Adult</option>
                      <option>2 Adults</option>
                      <option>3 Adults</option>
                      <option>4 Adults</option>
                    </select>
                  </div>
                </div>
                <button className="w-full bg-[#ff5c5c] text-white py-3 rounded-lg hover:bg-[#ff4040] transition-colors">
                  Check availability
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Reserve now & pay later</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

