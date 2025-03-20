"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { FileText, Loader, Info, Plus, X, CheckCircle, XCircle, Trash, Upload, Menu } from "lucide-react"
import { toast } from "react-hot-toast"
import GuideSidebar from "../../../../components/dashboard/guide/GuideSidebar"
import postApi from "../../../../services/postApi"

export default function GuidePosts() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("posts")
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewPost, setPreviewPost] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", description: "" })
  const [selectedImages, setSelectedImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const fileInputRef = useRef(null)

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsSidebarOpen(!mobile) // Open sidebar by default on desktop
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const userData = localStorage.getItem("user")
      const guideId = userData ? JSON.parse(userData).id : user?.id

      if (!guideId) {
        setError("User ID not found. Please log in again.")
        toast.error("User ID not found. Please log in again.")
        setIsLoading(false)
        return
      }

      const response = await postApi.getGuidePosts(guideId)
      if (response.success) {
        setPosts(response.data)
      } else {
        setError(response.message || "Failed to fetch posts")
        toast.error(response.message || "Failed to fetch posts")
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching posts")
      toast.error(err.message || "An error occurred while fetching posts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPost((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024,
    )
    setSelectedImages((prev) => [...prev, ...files])
    setPreviewImages((prev) => [...prev, ...files.map((file) => ({ file, url: URL.createObjectURL(file) }))])
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(previewImages[index].url)
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Submit button clicked")

    if (!newPost.title.trim() || !newPost.description.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    console.log("Submitting post...")

    try {
      const userData = localStorage.getItem("user")
      const guideId = userData ? JSON.parse(userData).id : user?.id

      if (!guideId) {
        toast.error("User ID not found. Please log in again.")
        return
      }

      console.log("Guide ID:", guideId)
      console.log("Post Data:", newPost)
      console.log("Selected Images:", selectedImages)

      // Create FormData
      const formData = new FormData()

      // Append the post data as a JSON string with the correct Content-Type
      const postBlob = new Blob([JSON.stringify(newPost)], { type: "application/json" })
      formData.append("post", postBlob)

      // Append images
      if (selectedImages && selectedImages.length > 0) {
        selectedImages.forEach((image) => {
          formData.append("images", image)
        })
      }

      // Send the request
      const response = await postApi.createGuidePost(guideId, formData)
      console.log("API Response:", response)

      if (response.success) {
        toast.success("Post created successfully")
        setShowCreateModal(false)
        resetForm()
        fetchPosts()
      } else {
        throw new Error(response.message || "Failed to create post")
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err)
      toast.error(err.message || "An error occurred while creating the post")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return
    try {
      const response = await postApi.deletePost(postId)
      if (response.success) {
        setPosts(posts.filter((post) => post.id !== postId))
        toast.success("Post deleted successfully")
      } else {
        throw new Error(response.message || "Failed to delete post")
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while deleting the post")
    }
  }

  const resetForm = () => {
    setNewPost({ title: "", description: "" })
    previewImages.forEach((image) => URL.revokeObjectURL(image.url))
    setSelectedImages([])
    setPreviewImages([])
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </span>
        )
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Pending
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#191b20] text-white flex">
      <GuideSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Mobile overlay when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className={`flex-1 transition-all duration-300 ${isMobile ? "ml-0" : isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="bg-[#232630] border-b border-gray-700 shadow-md sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-[#fe5532] hover:bg-[#fe5532]/10 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-white">Post Management</h1>
            <div className="flex items-center">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-3 py-1.5 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Create Post</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2">My Posts</h1>
            <p className="text-gray-400">Share your experiences and insights with the community</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#fe5532]/10 border-l-4 border-[#fe5532] text-[#fe5532] rounded">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader className="w-8 h-8 text-[#fe5532] animate-spin" />
              <span className="ml-2 text-gray-300">Loading posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center p-8 bg-[#232630] rounded-lg shadow-sm">
              <FileText className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-6">
                Share your experiences and insights with the community by creating your first post.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-all shadow-md"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Post
              </button>
            </div>
          ) : (
            <div className="bg-[#232630] rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-[#191b20]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-[#191b20]/50">
                        <td className="px-4 py-3 text-sm text-white">{post.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-300 hidden md:table-cell">
                          {post.description.length > 60 ? `${post.description.substring(0, 60)}...` : post.description}
                        </td>
                        <td className="px-4 py-3 text-sm">{getStatusBadge(post.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-400 hidden sm:table-cell">
                          {formatDate(post.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-[#fe5532] hover:text-[#fe5532]/80 p-1"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#232630] rounded-lg p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-white">Create New Post</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Title <span className="text-[#fe5532]">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newPost.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent"
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description <span className="text-[#fe5532]">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newPost.description}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent"
                    placeholder="Share your experience or insights..."
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Images</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-[#fe5532] transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Upload className="mx-auto h-10 w-10 text-gray-500" />
                    <p className="mt-2 text-sm text-gray-400">Click to upload images or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
                {previewImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Selected Images ({previewImages.length})
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {previewImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-700">
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-[#fe5532] text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Create Post
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

