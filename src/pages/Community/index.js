"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"
import Post from "../../components/community/Post"
import CommunitySidebar from "../../components/community/CommunitySidebar"
import postApi from "../../services/postApi"
import { toast } from "react-hot-toast"

export default function CommunityPage() {
  const { isAuthenticated, user } = useAuth()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await postApi.getAllPosts()
      if (response.success) {
        setPosts(response.data)
        console.log("Fetched Posts:", response.data)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error("Failed to fetch posts")
    } finally {
      setIsLoading(false)
    }
  }

 
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Debug: Log posts and guides when the component renders
  useEffect(() => {
    if (!isLoading) {
      console.log("Posts:", posts)
      const uniqueGuides = posts
        .map(post => post.guide)
        .filter((guide, index, self) => 
          index === self.findIndex(g => g.id === guide.id)
        )
      console.log("Unique Guides:", uniqueGuides)
    }
  }, [isLoading, posts])

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts])
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connect with guides and travelers, share experiences, and discover new adventures
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Latest Posts</h2>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 animate-pulse">
                      {/* ... existing loading skeleton ... */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => {
                    return (
                      <Post 
                        key={post.id} 
                        post={{
                          id: post.id,
                          content: post.description,
                          images: post.images,
                          date: post.createdAt,
                          likes: post.likeCount,
                          comments: post.commentCount,
                          commentsList: post.comments,
                          author: {
                            id: post.guide.id, 
                            name: `${post.guide.firstName} ${post.guide.lastName}`,
                            avatar: post.guide.profileImage,
                            verified: post.guide.isValidateGuide,
                            speciality: post.guide.speciality
                          }
                        }} 
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <CommunitySidebar
              guides={posts
                .map(post => post.guide)
                .filter((guide, index, self) => 
                  index === self.findIndex(g => g.id === guide.id)
                )
                .map(guide => {
                  return {
                    id: guide.id,
                    name: `${guide.firstName} ${guide.lastName}`,
                    username: guide.email.split('@')[0],
                    avatar: guide.profileImage,
                    verified: guide.isValidateGuide,
                    rating: 4.5, 
                    location: guide.location || "Morocco",
                    speciality: guide.speciality
                  }
                })}
              topics={["morocco", "hiking", "adventure", "desert", "mountains"]}
              externalIsSidebarOpen={isSidebarOpen}
              externalToggleSidebar={toggleSidebar}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
