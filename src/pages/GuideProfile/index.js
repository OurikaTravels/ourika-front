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
  Trophy,
  Briefcase,
  Globe,
  Phone,
  ExternalLink,
  Heart
} from "lucide-react"
import Post from "../../components/community/Post"
import guideApi from "../../services/guideApi"

export default function GuideProfilePage() {
  const { id } = useParams()
  const [guide, setGuide] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthday: null,
    language: '',
    experience: 0,
    phone: '',
    speciality: '',
    licenseNumber: '',
    isValidateGuide: false,
    aboutYou: '',
    profileImage: '',
    // Added mock data for additional stats
    touristsGuided: 1240,
    treksCompleted: 342,
    responseRate: 98,
    specialties: [],
    languages: [],
    certifications: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('about')
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const response = await guideApi.getGuideProfile(id)
        if (response.success) {
          // Enhance with mock data for visual purposes
          setGuide({
            ...response.data,
            touristsGuided: 1240,
            treksCompleted: 342,
            responseRate: 98,
            specialties: response.data.speciality.split(',').map(s => s.trim()),
            languages: response.data.language.split(',').map(l => l.trim()),
            certifications: [
              "Certified Mountain Guide - Moroccan Ministry of Tourism",
              "Wilderness First Responder",
              "High Altitude Trekking Specialist",
              "Cultural Heritage Guide"
            ],
            rating: 4.9,
            reviewCount: 156,
            location: "Marrakech, Morocco"
          })
          
          // Fetch mock posts (you would replace this with actual API call)
          setPosts(mockPosts)
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuideData()
  }, [id])

  if (isLoading) {
    return <GuideProfileSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Guide not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The guide you're looking for doesn't exist or has been removed."}
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

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        
        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/community"
            className="inline-flex items-center text-white bg-black/30 backdrop-blur-sm hover:bg-black/50 px-3 py-1.5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Community
          </Link>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 mb-6">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={guide.profileImage ? `http://localhost:8080/api/uploads/images/${guide.profileImage}` : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
              alt={`${guide.firstName} ${guide.lastName}`}
              className="w-32 h-32 rounded-full border-4 border-gray-900 object-cover"
            />
            {guide.isValidateGuide && (
              <div className="absolute bottom-0 right-0 bg-green-500 p-1 rounded-full border-2 border-gray-900">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 md:pb-4 flex flex-col md:flex-row md:items-end md:justify-between w-full">
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-2xl font-bold text-white">
                  {`${guide.firstName} ${guide.lastName}`}
                </h1>
                {guide.isValidateGuide && (
                  <div className="flex items-center bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Guide
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-sm mt-1 mb-2">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-gray-300">{guide.location || "Morocco"}</span>
                
                <div className="flex items-center ml-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-medium ml-1">{guide.rating || 4.9}</span>
                  <span className="text-gray-400 ml-1">({guide.reviewCount || 156} reviews)</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {guide.specialties && guide.specialties.map((specialty, index) => (
                  <span key={index} className="inline-block bg-[#ff5c5c]/20 text-[#ff5c5c] text-xs font-medium px-2.5 py-1 rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex mt-4 md:mt-0 space-x-2">
              <button className="bg-[#ff5c5c] hover:bg-[#ff4040] text-white px-4 py-2 rounded-md font-medium transition-colors">
                Contact
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-md">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Official Verification Badge */}
        <div className="bg-blue-900/40 border-l-4 border-blue-500 rounded-md p-4 mb-6 flex items-start">
          <Award className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-400">Official OurikaTravels Guide</h3>
            <p className="text-gray-300 text-sm">
              This guide has been verified and approved by OurikaTravels. All credentials and qualifications have been confirmed.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50">
            <div className="flex items-center text-gray-400 mb-1">
              <Briefcase className="w-4 h-4 mr-2" />
              <span className="text-sm">Years Experience</span>
            </div>
            <div className="text-2xl font-bold text-white">{guide.experience}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50">
            <div className="flex items-center text-gray-400 mb-1">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">Tourists Guided</span>
            </div>
            <div className="text-2xl font-bold text-white">{guide.touristsGuided}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50">
            <div className="flex items-center text-gray-400 mb-1">
              <Trophy className="w-4 h-4 mr-2" />
              <span className="text-sm">Treks Completed</span>
            </div>
            <div className="text-2xl font-bold text-white">{guide.treksCompleted}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50">
            <div className="flex items-center text-gray-400 mb-1">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">Response Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">{guide.responseRate}%</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex overflow-x-auto space-x-8">
            <button
              onClick={() => handleTabChange('about')}
              className={`py-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'about'
                  ? 'border-[#ff5c5c] text-[#ff5c5c]'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleTabChange('posts')}
              className={`py-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'posts'
                  ? 'border-[#ff5c5c] text-[#ff5c5c]'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => handleTabChange('reviews')}
              className={`py-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-[#ff5c5c] text-[#ff5c5c]'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-10">
          {activeTab === 'about' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">About</h2>
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {guide.aboutYou || `Professional mountain guide with over ${guide.experience} years of experience leading treks through the Atlas Mountains. I specialize in creating authentic experiences that combine adventure with cultural immersion.

Born and raised in the foothills of the Atlas Mountains, I have an intimate knowledge of the terrain, local customs, and hidden gems that most tourists never discover. My goal is to provide safe, memorable, and transformative journeys for travelers from around the world.`}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {guide.languages && guide.languages.map((language, index) => (
                    <span key={index} className="inline-flex items-center bg-gray-800 text-gray-200 text-sm px-3 py-1 rounded-full">
                      <Globe className="w-3 h-3 mr-1" />
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Certifications</h2>
                <ul className="space-y-2 text-gray-300">
                  {guide.certifications && guide.certifications.map((certification, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{certification}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-300">{guide.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <ExternalLink className="w-5 h-5 text-gray-400 mr-3" />
                    <a href="#" className="text-blue-400 hover:underline">OurikaTravels Profile</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map(post => (
                  <Post key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                  <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-300">No posts yet</h3>
                  <p className="text-gray-500 mt-1">This guide hasn't posted any updates yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {mockReviews.map(review => (
                <div key={review.id} className="bg-gray-800 rounded-xl p-5">
                  <div className="flex items-start">
                    <img 
                      src={review.user.avatar} 
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white">{review.user.name}</span>
                        <span className="text-gray-400 text-sm">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} mr-0.5`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                      <div className="mt-3 text-sm text-gray-400">
                        <span className="text-[#ff5c5c]">{review.trek}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GuideProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-800 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-700 animate-pulse"></div>

          <div className="mt-4 md:mt-0 md:ml-6 md:pb-4 flex flex-col md:flex-row md:items-end md:justify-between w-full">
            <div>
              <div className="h-8 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-32 mb-3 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-700 rounded-full w-20 animate-pulse"></div>
                <div className="h-6 bg-gray-700 rounded-full w-20 animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex mt-4 md:mt-0 space-x-2">
              <div className="h-10 bg-gray-700 rounded w-24 animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-md p-4 mb-6 animate-pulse h-20"></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4 h-20 animate-pulse"></div>
          ))}
        </div>

        <div className="border-b border-gray-700 mb-6">
          <div className="flex space-x-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-700 rounded w-20 animate-pulse mb-3"></div>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="h-6 bg-gray-700 rounded w-32 mb-3 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

// Mock data
const mockPosts = [
  {
    id: 1,
    author: {
      name: "Ahmed Hassan",
      username: "ahmedguide",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      verified: true,
      speciality: "Mountain Guide"
    },
    date: "2023-06-15T10:30:00Z",
    content:
      "Just finished an amazing trek through the Atlas Mountains with a wonderful group from Canada! The views were breathtaking and the weather was perfect. 🏔️\n\nHighly recommend this route for experienced hikers looking for a challenge with rewarding panoramas.",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    ],
    location: "Atlas Mountains, Morocco",
    tags: ["hiking", "mountains", "adventure", "morocco"],
    likes: 124,
    comments: 18,
  },
  {
    id: 2,
    author: {
      name: "Ahmed Hassan",
      username: "ahmedguide",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      verified: true,
      speciality: "Mountain Guide"
    },
    date: "2023-06-08T14:15:00Z",
    content:
      "Today's hike through Paradise Valley was refreshing! We swam in natural pools, jumped from cliffs (safely!), and enjoyed a picnic lunch by the water. Perfect escape from the summer heat. 💦",
    images: [
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1439&q=80"
    ],
    location: "Paradise Valley, Agadir",
    tags: ["swimming", "hiking", "nature", "waterfall"],
    likes: 76,
    comments: 9,
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