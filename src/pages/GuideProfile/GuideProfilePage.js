"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  MapPin,
  Star,
  Calendar,
  Award,
  Users,
  MessageCircle,
  ChevronLeft,
  Share2,
  CheckCircle,
  Globe,
  Languages,
  Mountain,
} from "lucide-react"
import guideApi from "../../services/guideApi"
import { toast } from "react-hot-toast"

export default function GuideProfilePage() {
  const { id } = useParams()
  const [guide, setGuide] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGuideProfile()
  }, [id])

  const fetchGuideProfile = async () => {
    try {
      const response = await guideApi.getGuideProfile(id)
      if (response.success) {
        setGuide(response.data)
      } else {
        toast.error(response.message || "Failed to fetch guide profile")
      }
    } catch (error) {
      toast.error("Failed to load guide profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-md">
          <Mountain className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Guide not found</h2>
          <p className="text-gray-600 mb-6">The guide you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/community"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link
          to="/community"
          className="inline-flex items-center text-emerald-700 hover:text-emerald-800 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Community
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-emerald-100">
          {/* Cover Photo with Gradient Overlay */}
          <div className="h-56 bg-gradient-to-r from-emerald-600 to-teal-500 relative">
            {guide.coverPhoto ? (
              <>
                <img
                  src={`http://localhost:8080/api/uploads/images/${guide.coverPhoto}`}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 to-emerald-700/40"></div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-emerald-200/30 flex items-center justify-center">
                  <Mountain className="h-16 w-16 text-white/70" />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="md:flex md:items-center">
              {/* Profile Image */}
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={`http://localhost:8080/api/uploads/images/${guide.profileImage}`}
                    alt={guide.firstName}
                    className="w-28 h-28 rounded-full border-4 border-white -mt-16 object-cover shadow-md"
                  />
                  {guide.isValidateGuide && (
                    <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Details */}
              <div className="mt-4 md:mt-0 md:ml-6">
                <div className="flex items-center flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900 mr-2">{`${guide.firstName} ${guide.lastName}`}</h1>
                  {guide.isValidateGuide && (
                    <div className="flex items-center bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Guide
                    </div>
                  )}
                </div>

                <div className="flex items-center mt-1 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-1 text-emerald-600" />
                  <span>{guide.location || "Morocco"}</span>
                </div>

                {guide.speciality && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                      {guide.speciality}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 md:mt-0 md:ml-auto flex space-x-2">
                <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-md hover:from-emerald-700 hover:to-teal-600 transition-colors shadow-sm">
                  Contact
                </button>
                <button className="p-2 text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 rounded-md bg-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Verification Badge */}
            {guide.isValidateGuide && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md mt-6">
                <div className="flex">
                  <Award className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-emerald-800">Official OurikaTravels Guide</h3>
                    <p className="mt-1 text-sm text-emerald-700">
                      This guide has been verified and approved by OurikaTravels. All credentials and qualifications
                      have been confirmed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center text-emerald-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">{guide.experience || 0}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">Years Experience</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center text-emerald-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">{guide.touristsGuided || 0}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">Tourists Guided</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center text-emerald-600">
                  <Star className="w-5 h-5 mr-2 fill-current" />
                  <span className="text-lg font-semibold">{guide.rating || "N/A"}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">Rating</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center text-emerald-600">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">100%</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">Response Rate</p>
              </div>
            </div>

            {/* About Section */}
            {guide.aboutYou && (
              <div className="mt-8 bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                  <Globe className="w-5 h-5 mr-2 text-emerald-600" />
                  About
                </h3>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{guide.aboutYou}</p>
              </div>
            )}

            {/* Languages Section (Placeholder) */}
            <div className="mt-6 bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                <Languages className="w-5 h-5 mr-2 text-emerald-600" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm">English</span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm">French</span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm">Arabic</span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm">Berber</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

