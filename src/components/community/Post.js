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
import { useAuth } from "../../context/AuthContext"
import { toast } from "react-toastify"

export default function Post({ post }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [comments, setComments] = useState(post.commentsList || [])

  useEffect(() => {
    if (user?.id) {
      fetchLikedPosts();
    }
  }, [user?.id]);

  const fetchLikedPosts = async () => {
    try {
      const response = await postApi.getLikedPosts(user.id);
      if (response.success) {
        setLikedPosts(response.data);
        // Check if current post is in liked posts
        setLiked(response.data.includes(post.id));
      }
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && showImageModal) setShowImageModal(false)
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [showImageModal])

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const response = await postApi.toggleLike(post.id);
      if (response.success) {
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        setLiked(!liked);
        // Refresh liked posts after toggling
        fetchLikedPosts();
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

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

  // Determine grid layout based on number of images
  const getGridClass = () => {
    if (!post.images || post.images.length === 0) return ""

    switch (post.images.length) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-2"
      case 4:
        return "grid-cols-2 grid-rows-2"
      default:
        return "grid-cols-3"
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden max-w-2xl mx-auto">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-emerald-50">
        <div className="flex items-center space-x-3">
          <Link to={`/guide/${post.author.id}`} className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-emerald-100 hover:ring-emerald-400 transition-all duration-300">
              <img
                src={`http://localhost:8080/api/uploads/images/${post.author.avatar}`}
                alt={post.author.name}
                className="w-full h-full object-cover transition-transform hover:scale-110"
              />
            </div>
          </Link>
          <div>
            <div className="flex items-center">
              <Link
                to={`/guide/${post.author.id}`}
                className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
              >
                {post.author.name}
              </Link>
              {post.author.verified && (
                <svg className="w-4 h-4 ml-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {post.author.speciality} • {formatDate(post.date)}
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-3 sm:px-4 pb-2 pt-3">
        {post.title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>}
        <p className="text-gray-800 mb-3 whitespace-pre-line leading-relaxed">{post.content}</p>

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="text-emerald-600 text-xs sm:text-sm font-medium hover:underline cursor-pointer bg-emerald-50 px-2 py-1 rounded-full transition-colors hover:bg-emerald-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image Grid */}
      {post.images && post.images.length > 0 && (
        <div className="mb-3 px-3">
          <div
            className={`grid gap-1.5 ${getGridClass()}`}
            style={{ maxHeight: post.images.length > 1 ? "400px" : "auto" }}
          >
            {post.images.slice(0, post.images.length === 3 ? 3 : 4).map((image, index) => (
              <div
                key={index}
                className={`relative cursor-pointer overflow-hidden rounded-lg ${
                  post.images.length === 3 && index === 0 ? "col-span-2 row-span-2" : ""
                }`}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={`http://localhost:8080/api/uploads/images/${image}`}
                  alt={`Post content ${index + 1}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  style={{
                    aspectRatio:
                      post.images.length === 1 ? "16/9" : post.images.length === 3 && index === 0 ? "1/1" : "1/1",
                    maxHeight: post.images.length === 1 ? "400px" : "200px",
                    width: "100%",
                  }}
                />
                {index === 3 && post.images.length > 4 && (
                  <div className="absolute inset-0 bg-emerald-900 bg-opacity-70 flex items-center justify-center transition-opacity hover:bg-opacity-80">
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
                  src={`http://localhost:8080/api/uploads/images/${post.images[currentImageIndex]}`}
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
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
            <span>{post.location}</span>
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-t border-emerald-100 bg-gradient-to-r from-white to-emerald-50">
        <button
          className={`flex items-center space-x-1.5 ${
            liked ? "text-emerald-600" : "text-gray-500"
          } hover:text-emerald-600 transition-colors`}
          onClick={handleLike}
        >
          <Heart size={18} className={`transition-transform ${liked ? "fill-current scale-110" : "hover:scale-110"}`} />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <button
          className={`flex items-center space-x-1.5 ${
            showComments ? "text-emerald-600" : "text-gray-500"
          } hover:text-emerald-600 transition-colors`}
          onClick={toggleComments}
        >
          <MessageCircle size={18} className="transition-transform hover:scale-110" />
          <span className="text-sm font-medium">{comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-3 sm:px-4 pb-3 border-t border-emerald-100 pt-2 bg-white">
          <PostComments postId={post.id} initialComments={comments} onCommentAdded={handleAddComment} />
        </div>
      )}
    </div>
  )
}

