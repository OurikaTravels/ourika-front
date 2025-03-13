"use client"

import { useState, useRef } from "react"
import { Image, MapPin, Tag, X } from 'lucide-react'
import { useAuth } from "../../context/AuthContext"

export default function CreatePostCard({ onPostCreated }) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const fileInputRef = useRef(null)

  const handleContentChange = (e) => {
    setContent(e.target.value)
    if (e.target.value.length > 0 && !isExpanded) {
      setIsExpanded(true)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setIsExpanded(true)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
    fileInputRef.current.value = ""
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return

    // Here you would typically send the post data to your API
    const newPost = {
      id: Date.now(),
      content,
      image: imagePreview,
      location,
      tags,
      author: {
        name: user?.lastName || "Guest User",
        username: user?.email?.split('@')[0] || "guest",
        avatar: user?.profileImage || "/placeholder.svg?height=40&width=40",
        verified: user?.role === "guide"
      },
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0
    }

    if (onPostCreated) {
      onPostCreated(newPost)
    }

    // Reset form
    setContent("")
    setImage(null)
    setImagePreview(null)
    setLocation("")
    setTags([])
    setIsExpanded(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
      <div className="p-4">
        <div className="flex space-x-3">
          <img 
            src={user?.profileImage || "/placeholder.svg?height=40&width=40"} 
            alt="User avatar" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <textarea
                placeholder="Share your trekking experience..."
                value={content}
                onChange={handleContentChange}
                onClick={() => setIsExpanded(true)}
                className="w-full border-0 focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 bg-transparent resize-none"
                rows={isExpanded ? 3 : 1}
              />
              
              {imagePreview && (
                <div className="relative mt-2 mb-3">
                  <img 
                    src={imagePreview || "/placeholder.svg"} 
                    alt="Preview" 
                    className="w-full max-h-60 object-cover rounded-lg"
                  />
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {isExpanded && (
                <>
                  {/* Location input */}
                  <div className="flex items-center mt-2 mb-3">
                    <MapPin size={18} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Add location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 border-0 focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 bg-transparent"
                    />
                  </div>
                  
                  {/* Tags input */}
                  <div className="flex flex-wrap items-center mt-2 mb-3">
                    <Tag size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                    <div className="flex flex-wrap gap-2 flex-1">
                      {tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-[#ff5c5c] bg-opacity-10 text-[#ff5c5c] px-2 py-1 rounded-full text-sm flex items-center"
                        >
                          #{tag}
                          <button 
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-700"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                      <form onSubmit={handleAddTag} className="flex-1 min-w-[100px]">
                        <input
                          type="text"
                          placeholder="Add tags"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          className="w-full border-0 focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 bg-transparent"
                        />
                      </form>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="text-gray-500 hover:text-[#ff5c5c] transition-colors"
                  >
                    <Image size={20} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="px-4 py-1.5 bg-[#ff5c5c] text-white rounded-full font-medium hover:bg-[#ff4040] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
