"use client"

import { useState, useEffect } from "react"
import { Plus, X, Loader, Check, AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import highlightApi from "../../services/highlightApi"

export default function HighlightSelector({ trekId, availableHighlights, selectedHighlights, setSelectedHighlights }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newHighlightContent, setNewHighlightContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredHighlight, setHoveredHighlight] = useState(null)

  useEffect(() => {
    if (trekId) {
      fetchTrekHighlights()
    }
  }, [trekId])

  const fetchTrekHighlights = async () => {
    setIsLoading(true)
    try {
      const response = await highlightApi.getAllHighlights()
      if (response.success) {
        setIsLoading(false)
      } else {
        throw new Error(response.message || "Failed to fetch trek highlights")
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching trek highlights")
      setIsLoading(false)
    }
  }

  const handleToggleHighlight = async (highlight) => {
    const isSelected = selectedHighlights.some((h) => h.id === highlight.id)

    try {
      if (isSelected) {
        const response = await highlightApi.removeHighlightFromTrek(trekId, highlight.id)
        if (response.success) {
          setSelectedHighlights(selectedHighlights.filter((h) => h.id !== highlight.id))
          toast.success("Highlight removed from trek")
        } else {
          throw new Error(response.message || "Failed to remove highlight")
        }
      } else {
        const response = await highlightApi.addHighlightToTrek(trekId, highlight.id)
        if (response.success) {
          setSelectedHighlights([...selectedHighlights, highlight])
          toast.success("Highlight added to trek")
        } else {
          throw new Error(response.message || "Failed to add highlight")
        }
      }
    } catch (err) {
      toast.error(err.message || "An error occurred")
    }
  }

  const handleAddNewHighlight = async (e) => {
    e.preventDefault()

    if (!newHighlightContent.trim()) {
      setError("Highlight content is required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await highlightApi.createHighlight({ content: newHighlightContent.trim() })
      if (response.success) {
        const newHighlight = response.data

        const addToTrekResponse = await highlightApi.addHighlightToTrek(trekId, newHighlight.id)
        if (addToTrekResponse.success) {
          setSelectedHighlights([...selectedHighlights, newHighlight])
        }

        availableHighlights.push(newHighlight)

        toast.success("Highlight created and added to trek")
        setNewHighlightContent("")
        setShowAddModal(false)
      } else {
        throw new Error(response.message || "Failed to create highlight")
      }
    } catch (err) {
      setError(err.message || "An error occurred while creating the highlight")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredHighlights = availableHighlights.filter((highlight) =>
    highlight.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Select Highlights</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-3 py-1.5 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add New Highlight
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search highlights..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader className="w-8 h-8 text-[#fe5532] animate-spin" />
          <span className="ml-2 text-gray-400">Loading highlights...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHighlights.map((highlight) => {
            const isSelected = selectedHighlights.some((h) => h.id === highlight.id)
            return (
              <div
                key={highlight.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#fe5532]/10 border-[#fe5532] text-white"
                    : "bg-[#232630] border-gray-700 text-gray-300 hover:border-[#fe5532]/50"
                }`}
                onClick={() => handleToggleHighlight(highlight)}
                onMouseEnter={() => setHoveredHighlight(highlight.id)}
                onMouseLeave={() => setHoveredHighlight(null)}
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="font-medium">{highlight.content}</p>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[#fe5532] ml-2 flex-shrink-0" />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#232630] rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Add New Highlight</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[#fe5532]/10 border-l-4 border-[#fe5532] text-[#fe5532] rounded flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddNewHighlight}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="highlightContent" className="block text-sm font-medium text-gray-300 mb-1">
                    Highlight Content <span className="text-[#fe5532]">*</span>
                  </label>
                  <textarea
                    id="highlightContent"
                    value={newHighlightContent}
                    onChange={(e) => setNewHighlightContent(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent"
                    placeholder="Enter highlight content"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#191b20] text-gray-300 rounded-md hover:bg-[#191b20]/70 transition-colors disabled:opacity-70 border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors disabled:opacity-70 flex items-center shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin w-4 h-4 mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Add Highlight"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 bg-[#232630] rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-white">Selected Highlights ({selectedHighlights.length})</h4>
        </div>
        {selectedHighlights.length === 0 ? (
          <p className="text-gray-400 text-sm">No highlights selected yet. Click on highlights above to select them.</p>
        ) : (
          <div className="space-y-2">
            {selectedHighlights.map((highlight) => (
              <div
                key={highlight.id}
                className="flex items-center justify-between bg-[#191b20] text-white px-4 py-2 rounded-lg text-sm"
              >
                <span className="line-clamp-1 mr-2">{highlight.content}</span>
                <button
                  onClick={() => handleToggleHighlight(highlight)}
                  className="ml-2 text-gray-400 hover:text-[#fe5532] flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

