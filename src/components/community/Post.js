"use client"

import { useState, useEffect } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import PostComments from "./PostComments"
import { Link } from "react-router-dom"
import postApi from "../../services/postApi"

export default function Post({ post }) {
  const [liked, setLiked] = useState(post.likedByCurrentUser || false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [comments, setComments] = useState(post.commentsList || [])

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && showImageModal) setShowImageModal(false)
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [showImageModal])

  const handleLike = async () => {
    try {
      const response = await postApi.toggleLike(post.id)
      if (response.success) {
        setLikeCount(liked ? likeCount - 1 : likeCount + 1)
        setLiked(!liked)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  const handleImageClick = (index) => {
    setCurrentImageIndex(index)
    setShowImageModal(true)
  }

  const handlePrevImage = (e) => {
    e?.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e?.stopPropagation()
    setCurrentImageIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1))
  }

  const handleAddComment = (newComment) => {
    setComments([...comments, newComment])
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center space-x-3">
          <Link to={`/guide/${post.author.username}`} className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-gray-700">
              <img
                src={
                  post.author.avatar
                    ? `${process.env.REACT_APP_API_BASE_URL}/uploads/images/${post.author.avatar}`
                    : "/placeholder.svg"
                }
                alt={post.author.name}
                className="w-full h-full object-cover transition-transform hover:scale-110"
              />
            </div>
          </Link>
          <div>
            <div className="flex items-center">
              <Link
                to={`/guide/${post.author.username}`}
                className="font-semibold text-gray-900 dark:text-white hover:text-[#ff5c5c] dark:hover:text-[#ff5c5c] transition-colors"
              >
                {post.author.name}
              </Link>
              {post.author.verified && (
                <svg className="w-4 h-4 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {post.author.speciality} • {formatDate(post.date)}
            </div>
          </div>
        </div>
        <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 sm:px-5 pb-3">
        {post.title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>}
        <p className="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-line leading-relaxed">{post.content}</p>

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="text-[#ff5c5c] text-xs sm:text-sm font-medium hover:underline cursor-pointer bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Image */}
      {post.images && post.images.length > 0 && (
        <div className="mb-3">
          <div
            className={`grid gap-1 ${
              post.images.length === 1
                ? "grid-cols-1"
                : post.images.length === 2
                  ? "grid-cols-2"
                  : post.images.length === 3
                    ? "grid-cols-3 grid-rows-2"
                    : "grid-cols-2 grid-rows-2"
            }`}
          >
            {post.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative cursor-pointer overflow-hidden ${
                  post.images.length === 3 && index === 0
                    ? "col-span-3 row-span-1"
                    : post.images.length === 3 && index > 0
                      ? "col-span-1.5 row-span-1"
                      : ""
                }`}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/uploads/images/${image}`}
                  alt={`Post content ${index + 1}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  style={{
                    aspectRatio:
                      post.images.length === 1 ? "16/9" : post.images.length === 3 && index === 0 ? "3/1" : "1/1",
                  }}
                />
                {index === 3 && post.images.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity hover:bg-opacity-70">
                    <span className="text-white text-xl font-bold">+{post.images.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Image Modal/Carousel */}
          {showImageModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
              onClick={() => setShowImageModal(false)}
            >
              <button
                className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setShowImageModal(false)}
              >
                <X size={24} />
              </button>

              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
                onClick={handlePrevImage}
              >
                <ChevronLeft size={32} />
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
                onClick={handleNextImage}
              >
                <ChevronRight size={32} />
              </button>

              <div className="relative max-w-5xl max-h-[85vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/uploads/images/${post.images[currentImageIndex]}`}
                  alt={`Post content ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/60 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} / {post.images.length}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post Location */}
      {post.location && (
        <div className="px-4 sm:px-5 pb-3">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{post.location}</span>
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-gray-200 dark:border-gray-700">
        <button
          className={`flex items-center space-x-1.5 ${liked ? "text-red-500" : "text-gray-500 dark:text-gray-400"} hover:text-red-500 transition-colors`}
          onClick={handleLike}
        >
          <Heart size={18} className={`transition-transform ${liked ? "fill-current scale-110" : "hover:scale-110"}`} />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <button
          className={`flex items-center space-x-1.5 ${showComments ? "text-blue-500" : "text-gray-500 dark:text-gray-400"} hover:text-blue-500 transition-colors`}
          onClick={toggleComments}
        >
          <MessageCircle size={18} className="transition-transform hover:scale-110" />
          <span className="text-sm font-medium">{comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 sm:px-5 pb-4 border-t border-gray-200 dark:border-gray-700 pt-3">
          <PostComments postId={post.id} initialComments={comments} onCommentAdded={handleAddComment} />
        </div>
      )}
    </div>
  )
}

