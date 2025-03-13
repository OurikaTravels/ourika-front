"use client"

import { useState } from "react"
import { Send, X } from 'lucide-react'
import { useAuth } from "../../context/AuthContext"
import { formatDistanceToNow } from "date-fns"

export default function PostComments({ postId, initialComments = [] }) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  
  const handleSubmitComment = (e) => {
    e.preventDefault()
    
    if (!newComment.trim()) return
    
    const comment = {
      id: Date.now(),
      author: {
        name: user?.lastName || "Guest User",
        username: user?.email?.split('@')[0] || "guest",
        avatar: user?.profileImage || "/placeholder.svg?height=32&width=32",
        verified: user?.role === "guide"
      },
      content: newComment,
      date: new Date().toISOString(),
      likes: 0
    }
    
    setComments([...comments, comment])
    setNewComment("")
  }
  
  if (!isExpanded && comments.length === 0) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="w-full text-center py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#ff5c5c] transition-colors"
      >
        Add a comment...
      </button>
    )
  }
  
  return (
    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="flex items-start space-x-2 mb-4">
        <img 
          src={user?.profileImage || "/placeholder.svg?height=32&width=32"} 
          alt="User avatar" 
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1 relative">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-[#ff5c5c] focus:border-[#ff5c5c] resize-none"
            rows={2}
            disabled={!isAuthenticated}
          />
          {newComment && (
            <button 
              type="submit"
              className="absolute right-2 bottom-2 text-[#ff5c5c] hover:text-[#ff4040] transition-colors"
            >
              <Send size={18} />
            </button>
          )}
        </div>
      </form>
      
      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <img 
                src={comment.author.avatar || "/placeholder.svg"} 
                alt={comment.author.name} 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {comment.author.name}
                    </span>
                    {comment.author.verified && (
                      <svg className="w-3 h-3 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="mx-1 text-xs text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      @{comment.author.username}
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">{comment.content}</p>
                </div>
                <div className="flex items-center mt-1 ml-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatDistanceToNow(new Date(comment.date), { addSuffix: true })}</span>
                  <span className="mx-2">•</span>
                  <button className="hover:text-[#ff5c5c] transition-colors">Like</button>
                  <span className="mx-2">•</span>
                  <button className="hover:text-[#ff5c5c] transition-colors">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      )}
      
      {isExpanded && comments.length > 0 && (
        <button 
          onClick={() => setIsExpanded(false)}
          className="w-full text-center py-2 mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#ff5c5c] transition-colors"
        >
          Hide comments
        </button>
      )}
    </div>
  )
}
