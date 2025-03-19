"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Send } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import postApi from "../../services/postApi"

export default function PostComments({ postId, initialComments = [], onCommentAdded }) {
  const { isAuthenticated, user } = useAuth()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e) => {
    e.preventDefault()

    if (!newComment.trim() || !isAuthenticated) return

    setIsSubmitting(true)

    try {
      const response = await postApi.addComment(postId, newComment)

      if (response.success) {
        const addedComment = response.data
        setComments([...comments, addedComment])
        onCommentAdded && onCommentAdded(addedComment)
        setNewComment("")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  return (
    <div className="space-y-4">
      {/* Comment List */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src="/placeholder.svg"
                    alt={`${comment.userFirstName} ${comment.userLastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm text-gray-900 dark:text-white">
                    {comment.userFirstName} {comment.userLastName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                src={
                  user?.profileImage
                    ? `${process.env.REACT_APP_API_BASE_URL}/uploads/images/${user.profileImage}`
                    : "/placeholder.svg"
                }
                alt={user?.firstName || "User"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full py-2 px-4 pr-10 bg-gray-100 dark:bg-gray-700 border-none rounded-full focus:ring-2 focus:ring-[#ff5c5c] focus:bg-white dark:focus:bg-gray-800 transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#ff5c5c] disabled:text-gray-400 disabled:cursor-not-allowed p-1 rounded-full hover:bg-[#ff5c5c]/10 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
          Please{" "}
          <a href="/login" className="text-[#ff5c5c] hover:underline">
            log in
          </a>{" "}
          to comment
        </div>
      )}
    </div>
  )
}

