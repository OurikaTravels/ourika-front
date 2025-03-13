"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import Post from "../../components/community/Post"
import CreatePostCard from "../../components/community/CreatePostCard"
import CommunitySidebar from "../../components/community/CommunitySidebar"
import CommunityHeader from "../../components/community/CommunityHeader"

export default function CommunityPage() {
  const { isAuthenticated, user } = useAuth()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Mock data for initial rendering
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
      commentsList: [
        {
          id: 101,
          author: {
            name: "Leila Mansouri",
            username: "leilaexplores",
            avatar:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            verified: true,
          },
          content: "The views look absolutely stunning! Which trail did you take?",
          date: "2023-06-15T11:45:00Z",
          likes: 3,
        },
        {
          id: 102,
          author: {
            name: "John Smith",
            username: "johnsmith",
            avatar:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            verified: false,
          },
          content: "I'm planning a trip there next month. Any tips for a first-timer?",
          date: "2023-06-15T13:20:00Z",
          likes: 1,
        },
      ],
    },
    {
      id: 2,
      author: {
        name: "Fatima Zahra",
        username: "fatimaexplorer",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
        verified: true,
      },
      date: "2023-06-12T15:45:00Z",
      content:
        "Spent the day guiding a food tour through the medina of Marrakech. We sampled traditional Moroccan dishes, from tagine to pastilla, and learned about the spices that make our cuisine unique. My guests were delighted by the flavors and hospitality! 🍽️",
      image:
        "https://images.unsplash.com/photo-1535540878297-f4439276f513?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
      location: "Marrakech Medina, Morocco",
      tags: ["foodtour", "marrakech", "moroccanfood", "culinary"],
      likes: 87,
      comments: 12,
      shares: 3,
      commentsList: [
        {
          id: 201,
          author: {
            name: "Sarah Johnson",
            username: "sarahj",
            avatar:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            verified: false,
          },
          content: "The food looks amazing! What was your favorite dish from the tour?",
          date: "2023-06-12T16:30:00Z",
          likes: 5,
        },
      ],
    },
    {
      id: 3,
      author: {
        name: "Youssef Berrada",
        username: "desertguide",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
        verified: true,
      },
      date: "2023-06-10T08:20:00Z",
      content:
        "Another magical night in the Sahara Desert with my tour group. We rode camels at sunset, enjoyed traditional Berber music around the campfire, and slept under the stars. The desert silence is truly something everyone should experience once in their lifetime. ✨",
      image:
        "https://images.unsplash.com/photo-1548636621-7a35c35b0dd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      location: "Merzouga, Sahara Desert",
      tags: ["sahara", "desert", "camping", "nightsky"],
      likes: 215,
      comments: 32,
      shares: 18,
      commentsList: [
        {
          id: 301,
          author: {
            name: "Michael Brown",
            username: "mikebrown",
            avatar:
              "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            verified: false,
          },
          content: "This looks incredible! How long was the camel ride to the camp?",
          date: "2023-06-10T10:15:00Z",
          likes: 2,
        },
        {
          id: 302,
          author: {
            name: "Emma Wilson",
            username: "emmaw",
            avatar:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            verified: false,
          },
          content: "The night sky in the desert is unbelievable. I still remember my trip there last year!",
          date: "2023-06-10T12:45:00Z",
          likes: 4,
        },
        {
          id: 303,
          author: {
            name: "Karim Alaoui",
            username: "karimtrekker",
            avatar:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            verified: true,
          },
          content: "Great photos, Youssef! Which camp site did you use this time?",
          date: "2023-06-10T14:20:00Z",
          likes: 1,
        },
      ],
    },
    {
      id: 4,
      author: {
        name: "Karim Alaoui",
        username: "karimtrekker",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
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
      commentsList: [],
    },
    {
      id: 5,
      author: {
        name: "Leila Mansouri",
        username: "leilaexplores",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
        verified: true,
      },
      date: "2023-06-05T11:30:00Z",
      content:
        "Just wrapped up a 3-day tour of the blue city, Chefchaouen. We explored the narrow blue streets, hiked to the Spanish Mosque for sunset views, and visited local artisans. My guests were mesmerized by the unique atmosphere and colors! 💙",
      image:
        "https://images.unsplash.com/photo-1548784903-0bdd2b0f7b87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      location: "Chefchaouen, Morocco",
      tags: ["bluecity", "chefchaouen", "photography", "culture"],
      likes: 143,
      comments: 21,
      shares: 12,
      commentsList: [
        {
          id: 501,
          author: {
            name: "David Chen",
            username: "davidc",
            avatar:
              "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            verified: false,
          },
          content: "The blue is so vibrant! Is it really that blue in person?",
          date: "2023-06-05T13:10:00Z",
          likes: 2,
        },
        {
          id: 502,
          author: {
            name: "Fatima Zahra",
            username: "fatimaexplorer",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            verified: true,
          },
          content: "I love Chefchaouen! Did you take them to that little café with the amazing mint tea?",
          date: "2023-06-05T14:25:00Z",
          likes: 3,
        },
      ],
    },
  ]

  const mockGuides = [
    {
      id: 1,
      name: "Ahmed Hassan",
      username: "ahmedguide",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      verified: true,
      rating: 4.9,
      location: "Marrakech, Morocco",
      speciality: "Mountain Trekking",
    },
    {
      id: 2,
      name: "Fatima Zahra",
      username: "fatimaexplorer",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      verified: true,
      rating: 4.8,
      location: "Fes, Morocco",
      speciality: "Food Tours",
    },
    {
      id: 3,
      name: "Youssef Berrada",
      username: "desertguide",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      verified: true,
      rating: 4.9,
      location: "Merzouga, Morocco",
      speciality: "Desert Expeditions",
    },
    {
      id: 4,
      name: "Leila Mansouri",
      username: "leilaexplores",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      verified: true,
      rating: 4.7,
      location: "Chefchaouen, Morocco",
      speciality: "Cultural Tours",
    },
  ]

  const trendingTopics = [
    "morocco",
    "hiking",
    "adventure",
    "desert",
    "mountains",
    "food",
    "culture",
    "photography",
    "travel",
    "trekking",
  ]

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setPosts(mockPosts)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts])
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Community Header */}
      <CommunityHeader toggleSidebar={toggleSidebar} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connect with guides and travelers, share experiences, and discover new adventures
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            {isAuthenticated && <CreatePostCard onPostCreated={handlePostCreated} />}

            {/* Posts Feed */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Latest Posts</h2>

              {isLoading ? (
                // Loading skeleton
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 animate-pulse">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <Post key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>

         
          <div className="lg:col-span-1">
            <CommunitySidebar
              guides={mockGuides}
              topics={trendingTopics}
              externalIsSidebarOpen={isSidebarOpen}
              externalToggleSidebar={toggleSidebar}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

