"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
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
} from "lucide-react"
import Post from "../../components/community/Post"

export default function GuideProfilePage() {
  const { username } = useParams()
  const [guide, setGuide] = useState(null)
  const [posts, setPosts] = useState([])
  const [reviews, setReviews] = useState([])
  const [activeTab, setActiveTab] = useState("posts")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch guide data from API
    // For now, using mock data
    setTimeout(() => {
      setGuide(mockGuide)
      setPosts(mockPosts)
      setReviews(mockReviews)
      setIsLoading(false)
    }, 1000)
  }, [username])

  if (isLoading) {
    return <GuideProfileSkeleton />
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Guide not found</h2>
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Link
          to="/community"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-[#ff5c5c] dark:hover:text-[#ff5c5c] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Community
        </Link>
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-[#ff5c5c] to-[#ff8f8f] relative">
            {guide.coverPhoto && (
              <img src={guide.coverPhoto || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700 z-10">
                <img
                  src={guide.avatar || "/placeholder.svg?height=128&width=128"}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 md:mt-0 md:ml-6 md:pb-4">
                <div className="flex items-center flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mr-2">{guide.name}</h1>
                  <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Guide
                  </div>
                  <div className="ml-2 flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">{guide.rating}</span>
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({guide.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center mt-1 text-gray-600 dark:text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{guide.location}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {guide.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-[#ff5c5c] bg-opacity-10 text-[#ff5c5c] px-2 py-1 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
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

            {/* Official Badge */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-md mb-6">
              <div className="flex">
                <Award className="h-6 w-6 text-blue-500 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Official OurikaTravels Guide</h3>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                    This guide has been verified and approved by OurikaTravels. All credentials and qualifications have
                    been confirmed.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center text-[#ff5c5c]">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">{guide.experience}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Years Experience</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center text-[#ff5c5c]">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">{guide.touristsGuided}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tourists Guided</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center text-[#ff5c5c]">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">{guide.trekCount}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Treks Completed</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center text-[#ff5c5c]">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">{guide.responseRate}%</span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Response Rate</p>
              </div>
            </div>

            {/* About */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About</h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{guide.bio}</p>

              {guide.languages && guide.languages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {guide.languages.map((language, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {guide.certifications && guide.certifications.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Certifications</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                    {guide.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "posts"
                    ? "border-b-2 border-[#ff5c5c] text-[#ff5c5c]"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "reviews"
                    ? "border-b-2 border-[#ff5c5c] text-[#ff5c5c]"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "posts" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Posts</h2>
                {posts.length > 0 ? (
                  posts.map((post) => <Post key={post.id} post={post} />)
                ) : (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <p>No posts yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tourist Reviews</h2>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="ml-1 font-semibold text-gray-900 dark:text-white">{guide.rating}</span>
                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">({guide.reviewCount} reviews)</span>
                  </div>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-start">
                          <img
                            src={review.user.avatar || "/placeholder.svg?height=40&width=40"}
                            alt={review.user.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 dark:text-white">{review.user.name}</h3>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-500 fill-current"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{review.date}</p>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">{review.comment}</p>
                            {review.trek && (
                              <div className="mt-2 text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Trek: </span>
                                <span className="text-[#ff5c5c]">{review.trek}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="text-center pt-4">
                      <button className="text-[#ff5c5c] hover:text-[#ff4040] font-medium">View all reviews</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <p>No reviews yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function GuideProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>

          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-700"></div>

              <div className="mt-4 md:mt-0 md:ml-6 md:pb-4">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-3"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>

            <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg h-20"></div>
              ))}
            </div>

            <div className="mb-6">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mock data
const mockGuide = {
  id: 1,
  name: "Ahmed Hassan",
  username: "ahmedguide",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  coverPhoto:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
  verified: true,
  rating: 4.9,
  reviewCount: 156,
  location: "Marrakech, Morocco",
  specialties: ["Mountain Trekking", "Hiking", "Adventure Tours"],
  bio: "Professional mountain guide with over 10 years of experience leading treks through the Atlas Mountains. I specialize in creating authentic experiences that combine adventure with cultural immersion.\n\nBorn and raised in the foothills of the Atlas Mountains, I have an intimate knowledge of the terrain, local customs, and hidden gems that most tourists never discover. My goal is to provide safe, memorable, and transformative journeys for travelers from around the world.",
  experience: 10,
  touristsGuided: 1240,
  trekCount: 342,
  responseRate: 98,
  languages: ["English", "French", "Arabic", "Berber"],
  certifications: [
    "Certified Mountain Guide - Moroccan Ministry of Tourism",
    "Wilderness First Responder",
    "High Altitude Trekking Specialist",
    "Cultural Heritage Guide",
  ],
}

const mockPosts = [
  {
    id: 1,
    author: {
      name: "Ahmed Hassan",
      username: "ahmedguide",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      verified: true,
    },
    date: "2023-06-15T10:30:00Z",
    content:
      "Just finished an amazing trek through the Atlas Mountains with a wonderful group from Canada! The views were breathtaking and the weather was perfect. 🏔️\n\nHighly recommend this route for experienced hikers looking for a challenge with rewarding panoramas.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    location: "Atlas Mountains, Morocco",
    tags: ["hiking", "mountains", "adventure", "morocco"],
    likes: 124,
    comments: 18,
    shares: 5,
  },
  {
    id: 2,
    author: {
      name: "Ahmed Hassan",
      username: "ahmedguide",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      verified: true,
    },
    date: "2023-06-08T14:15:00Z",
    content:
      "Today's hike through Paradise Valley was refreshing! We swam in natural pools, jumped from cliffs (safely!), and enjoyed a picnic lunch by the water. Perfect escape from the summer heat. 💦",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1439&q=80",
    location: "Paradise Valley, Agadir",
    tags: ["swimming", "hiking", "nature", "waterfall"],
    likes: 76,
    comments: 9,
    shares: 4,
  },
]

const mockReviews = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    },
    rating: 5,
    date: "June 2023",
    comment:
      "Ahmed was an exceptional guide! His knowledge of the Atlas Mountains is impressive, and he made sure our trek was both safe and enjoyable. He shared fascinating stories about local culture and history throughout our journey. Highly recommend!",
    trek: "Atlas Mountains 3-Day Trek",
  },
  {
    id: 2,
    user: {
      name: "Michael Brown",
      avatar:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    },
    rating: 5,
    date: "May 2023",
    comment:
      "One of the best trekking experiences I've ever had. Ahmed is professional, knowledgeable, and genuinely cares about providing an authentic experience. The views were incredible and the pace was perfect for our group.",
    trek: "Toubkal Summit Expedition",
  },
  {
    id: 3,
    user: {
      name: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    },
    rating: 4,
    date: "April 2023",
    comment:
      "Ahmed was very knowledgeable and made our hike through the mountains memorable. He was attentive to everyone's needs and made sure we were all comfortable. The only reason for 4 stars instead of 5 is that the trek was more challenging than described, but Ahmed helped us through it.",
    trek: "Ourika Valley Day Trip",
  },
]

