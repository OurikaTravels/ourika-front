"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  MapPin,
  Star,
  Award,
  Users,
  Clock,
  CheckCircle,
  ChevronLeft,
  Share2,
  Trophy,
  Briefcase,
  Globe,
  Phone,
  ExternalLink,
  Mail,
  Calendar,
  Mountain,
} from "lucide-react"
import guideApi from "../../services/guideApi"

export default function GuideProfilePage() {
  const { id } = useParams()
  const [guide, setGuide] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: null,
    language: "",
    experience: 0,
    phone: "",
    speciality: "",
    licenseNumber: "",
    isValidateGuide: false,
    aboutYou: "",
    profileImage: "",

    touristsGuided: 1240,
    treksCompleted: 342,
    responseRate: 98,
    specialties: [],
    languages: [],
    certifications: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const response = await guideApi.getGuideProfile(id)
        if (response.success) {
    
          setGuide({
            ...response.data,
            touristsGuided: 1240,
            treksCompleted: 342,
            responseRate: 98,
            specialties: response.data.speciality.split(",").map((s) => s.trim()),
            languages: response.data.language.split(",").map((l) => l.trim()),
            certifications: [
              "Certified Mountain Guide - Moroccan Ministry of Tourism",
              "Wilderness First Responder",
              "High Altitude Trekking Specialist",
              "Cultural Heritage Guide",
            ],
            rating: 4.9,
            reviewCount: 156,
            location: "Marrakech, Morocco",
          })
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
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-emerald-600 text-5xl mb-4">
          <Mountain />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Guide Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/community"
          className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
        >
          Back to Community
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">

      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent"></div>

        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/community"
            className="inline-flex items-center text-white bg-emerald-800/60 backdrop-blur-sm hover:bg-emerald-700/70 px-3 py-1.5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Community
          </Link>
        </div>
      </div>

   
      <div className="max-w-5xl mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 mb-6">
  
          <div className="relative">
            <img
              src={
                guide.profileImage
                  ? `http://localhost:8080/api/uploads/images/${guide.profileImage}`
                  : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              }
              alt={`${guide.firstName} ${guide.lastName}`}
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
            />
            {guide.isValidateGuide && (
              <div className="absolute bottom-0 right-0 bg-emerald-500 p-1 rounded-full border-2 border-white">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 md:pt-24 flex flex-col md:flex-row md:items-end md:justify-between w-full">
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{`${guide.firstName} ${guide.lastName}`}</h1>
                {guide.isValidateGuide && (
                  <div className="flex items-center bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Guide
                  </div>
                )}
              </div>

              <div className="flex items-center text-sm mt-1 mb-2">
                <MapPin className="w-4 h-4 mr-1 text-emerald-600" />
                <span className="text-gray-600">{guide.location || "Morocco"}</span>

                <div className="flex items-center ml-4">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-gray-800 font-medium ml-1">{guide.rating || 4.9}</span>
                  <span className="text-gray-500 ml-1">({guide.reviewCount || 156} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {guide.specialties &&
                  guide.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-block bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
              </div>
            </div>

            <div className="flex mt-4 md:mt-0 space-x-2">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                Contact
              </button>
              <button className="bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-600 p-2 rounded-md shadow-sm transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>


        <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-md p-4 mb-6 flex items-start">
          <Award className="w-6 h-6 text-emerald-600 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-emerald-700">Official OurikaTravels Guide</h3>
            <p className="text-gray-600 text-sm">
              This guide has been verified and approved by OurikaTravels. All credentials and qualifications have been
              confirmed.
            </p>
          </div>
        </div>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center text-emerald-600 mb-1">
              <Briefcase className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Years Experience</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{guide.experience}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center text-emerald-600 mb-1">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Tourists Guided</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{guide.touristsGuided}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center text-emerald-600 mb-1">
              <Trophy className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Treks Completed</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{guide.treksCompleted}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center text-emerald-600 mb-1">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Response Rate</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{guide.responseRate}%</div>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-emerald-100">About</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-6">
            {guide.aboutYou ||
              `Professional mountain guide with over ${guide.experience} years of experience leading treks through the Atlas Mountains. I specialize in creating authentic experiences that combine adventure with cultural immersion.

Born and raised in the foothills of the Atlas Mountains, I have an intimate knowledge of the terrain, local customs, and hidden gems that most tourists never discover. My goal is to provide safe, memorable, and transformative journeys for travelers from around the world.`}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-emerald-700 mb-3 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-emerald-600" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {guide.languages &&
                  guide.languages.map((language, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-emerald-50 text-emerald-700 text-sm px-3 py-1 rounded-full"
                    >
                      {language}
                    </span>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-700 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                Availability
              </h3>
              <p className="text-gray-700">
                Available for treks and tours year-round, with peak availability during spring and autumn seasons.
              </p>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-emerald-100 flex items-center">
            <Award className="w-5 h-5 mr-2 text-emerald-600" />
            Certifications
          </h2>
          <ul className="space-y-3 text-gray-700">
            {guide.certifications &&
              guide.certifications.map((certification, index) => (
                <li key={index} className="flex items-start bg-emerald-50 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{certification}</span>
                </li>
              ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Phone className="w-5 h-5 mr-3 text-white" />
              <span>{guide.phone || "+212 123 456 789"}</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Mail className="w-5 h-5 mr-3 text-white" />
              <span>{guide.email}</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 md:col-span-2">
              <ExternalLink className="w-5 h-5 mr-3 text-white" />
              <a href="#" className="text-white hover:underline">
                View Available Tours
              </a>
            </div>
          </div>
        </div>


        <div className="bg-emerald-50 rounded-xl p-8 mb-10 text-center">
          <h2 className="text-2xl font-bold text-emerald-800 mb-3">Ready for an unforgettable adventure?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Book a trek with {guide.firstName} and experience the beauty of Morocco's landscapes with a knowledgeable
            local guide.
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-md hover:shadow-lg">
            Book a Trek
          </button>
        </div>
      </div>
    </div>
  )
}

