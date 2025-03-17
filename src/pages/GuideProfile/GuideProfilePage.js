"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Calendar,
  Award,
  Users,
  Clock,
  CheckCircle,
  MessageCircle,
  ChevronLeft,
  Share2,
} from "lucide-react";
import guideApi from "../../services/guideApi";
import { toast } from "react-hot-toast";

export default function GuideProfilePage() {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGuideProfile();
  }, [id]);

  const fetchGuideProfile = async () => {
    try {
      const response = await guideApi.getGuideProfile(id);
      if (response.success) {
        setGuide(response.data);
      } else {
        toast.error(response.message || "Failed to fetch guide profile");
      }
    } catch (error) {
      toast.error("Failed to load guide profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ff5c5c] border-t-transparent"></div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Guide not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The guide you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/community"
            className="inline-flex items-center px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Link
          to="/community"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-[#ff5c5c] dark:hover:text-[#ff5c5c] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Community
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-[#ff5c5c] to-[#ff8f8f] relative">
            {guide.coverPhoto && (
              <img
                src={`http://localhost:8080/api/uploads/images/${guide.coverPhoto}`}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="p-6">
            <div className="md:flex md:items-center">
              <div className="flex items-center">
                <img
                  src={`http://localhost:8080/api/uploads/images/${guide.profileImage}`}
                  alt={guide.firstName}
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 -mt-12 object-cover"
                />
              </div>

              <div className="mt-4 md:mt-0 md:ml-6">
                <div className="flex items-center flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mr-2">
                    {`${guide.firstName} ${guide.lastName}`}
                  </h1>
                  {guide.isValidateGuide && (
                    <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Guide
                    </div>
                  )}
                </div>

                <div className="flex items-center mt-1 text-gray-600 dark:text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{guide.location || "Morocco"}</span>
                </div>

                {guide.speciality && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-[#ff5c5c] bg-opacity-10 text-[#ff5c5c] px-2 py-1 rounded-full text-xs">
                      {guide.speciality}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 md:mt-0 md:ml-auto flex space-x-2">
                <button className="px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors">
                  Contact
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#ff5c5c] border border-gray-200 dark:border-gray-700 rounded-md">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {guide.isValidateGuide && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-md mt-6">
                <div className="flex">
                  <Award className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Official OurikaTravels Guide
                    </h3>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                      This guide has been verified and approved by OurikaTravels.
                      All credentials and qualifications have been confirmed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center text-[#ff5c5c]">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">
                    {guide.experience || 0}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Years Experience
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center text-[#ff5c5c]">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">
                    {guide.touristsGuided || 0}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tourists Guided
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center text-[#ff5c5c]">
                  <Star className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">
                    {guide.rating || "N/A"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Rating
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center text-[#ff5c5c]">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">100%</span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Response Rate
                </p>
              </div>
            </div>

            {guide.aboutYou && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  About
                </h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {guide.aboutYou}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}