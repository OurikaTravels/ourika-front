"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import PostComments from "./PostComments"
import { Link } from "react-router-dom"

export default function Post({ post }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4 overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/guide/${post.author.username}`}>
            <img
              src={post.author.avatar || "/placeholder.svg?height=40&width=40"}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <div>
            <div className="flex items-center">
              <Link
                to={`/guide/${post.author.username}`}
                className="font-medium text-gray-900 dark:text-white hover:text-[#ff5c5c] dark:hover:text-[#ff5c5c] transition-colors"
              >
                {post.author.name}
              </Link>
              {post.author.verified && (
                <svg className="w-4 h-4 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>@{post.author.username}</span>
              <span className="mx-1">·</span>
              <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-line">{post.content}</p>

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-[#ff5c5c] text-sm font-medium hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="mb-3">
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post content"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Post Location */}
      {post.location && (
        <div className="px-4 pb-3">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{post.location}</span>
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <button
          className={`flex items-center space-x-1 ${liked ? "text-red-500" : "text-gray-500 dark:text-gray-400"} hover:text-red-500 transition-colors`}
          onClick={handleLike}
        >
          <Heart size={20} className={liked ? "fill-current" : ""} />
          <span>{likeCount}</span>
        </button>

        <button
          className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
          onClick={toggleComments}
        >
          <MessageCircle size={20} />
          <span>{post.comments}</span>
        </button>

        <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors">
          <Share2 size={20} />
          <span>{post.shares}</span>
        </button>

        <button
          className={`flex items-center space-x-1 ${saved ? "text-yellow-500" : "text-gray-500 dark:text-gray-400"} hover:text-yellow-500 transition-colors`}
          onClick={handleSave}
        >
          <Bookmark size={20} className={saved ? "fill-current" : ""} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4">
          <PostComments postId={post.id} initialComments={post.commentsList || []} />
        </div>
      )}
    </div>
  )
}

