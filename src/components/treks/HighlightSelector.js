"use client"

import { useState } from "react"
import { Plus, Trash2, Loader, Search, Info } from "lucide-react"
import { toast } from "react-hot-toast"
import highlightApi from "../../services/highlightApi"

/**
 * Component for selecting highlights for a trek
 */
export default function HighlightSelector({ trekId, availableHighlights, selectedHighlights, setSelectedHighlights }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [highlightId, setHighlightId] = useState("")
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredHighlight, setHoveredHighlight] = useState(null)

  /**
   * Add a highlight to the trek by ID
   */
  const addHighlightById = async (highlightIdToAdd) => {
    if (!trekId) {
      console.error("Trek ID is missing:", trekId)
      toast.error("Trek ID is missing. Please complete step 1 first.")
      return
    }

    // Convert highlightId to a number for consistent comparison
    const highlightIdNum = Number.parseInt(highlightIdToAdd)

    // Check if already selected
    if (selectedHighlights.some((h) => h.id === highlightIdNum)) {
      toast.error("This highlight is already selected")
      return
    }

    // Find the highlight in available highlights
    const highlightToAdd = availableHighlights.find((h) => h.id === highlightIdNum)
    if (!highlightToAdd) {
      toast.error("Highlight ID not found in available highlights")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      console.log("Adding highlight to trek:", { trekId, highlightId: highlightIdNum })

      // Convert highlightId to a number before passing to API
      const response = await highlightApi.addHighlightToTrek(trekId, highlightIdNum)

      console.log("API response:", response)

      if (!response.success) {
        throw new Error(response.message || "Failed to add highlight to trek")
      }

      // Update the UI immediately
      setSelectedHighlights((prev) => [...prev, highlightToAdd])
      setHighlightId("") // Clear the input
      toast.success("Highlight added to trek successfully")
    } catch (err) {
      console.error("Error adding highlight:", err)
      setError(err.message || "Failed to add highlight to trek")
      toast.error(err.message || "Failed to add highlight to trek")
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!highlightId.trim()) {
      setError("Please enter a highlight ID")
      return
    }

    addHighlightById(highlightId)
  }

  /**
   * Remove a highlight from the trek
   */
  const removeHighlightFromTrek = async (highlightId) => {
    if (!trekId) {
      toast.error("Trek ID is missing")
      return
    }

    setIsSubmitting(true)
    try {
      console.log("Removing highlight from trek:", { trekId, highlightId })

      // Make sure highlightId is a number
      const response = await highlightApi.removeHighlightFromTrek(trekId, highlightId)

      console.log("API response:", response)

      if (!response.success) {
        throw new Error(response.message || "Failed to remove highlight from trek")
      }

      // Update the UI immediately
      setSelectedHighlights((prev) => prev.filter((h) => h.id !== highlightId))
      toast.success("Highlight removed from trek successfully")
    } catch (err) {
      console.error("Error removing highlight:", err)
      toast.error(err.message || "Failed to remove highlight from trek")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter highlights based on search term
  const filteredHighlights = availableHighlights.filter(
    (highlight) =>
      highlight.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      highlight.id.toString().includes(searchTerm),
  )

  return (
    <div className="space-y-8">
      {/* Info message */}
      {trekId ? (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 rounded">
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>Click on any highlight from the table below to add it to your trek, or use the ID input field.</p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-700 dark:text-amber-300 rounded">
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>Trek ID is missing. Please complete step 1 first.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Highlights */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Available Highlights</h3>

          {/* Search and Add highlight form */}
          <div className="space-y-4 mb-5">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent"
                placeholder="Search highlights..."
              />
            </div>

            {/* Add by ID 
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <div className="flex-1">
                <label
                  htmlFor="highlightId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Add by ID
                </label>
                <input
                  type="number"
                  id="highlightId"
                  value={highlightId}
                  onChange={(e) => {
                    setHighlightId(e.target.value)
                    setError("")
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent"
                  placeholder="Enter ID"
                  disabled={isSubmitting || !trekId}
                />
                {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !trekId}
                className="mt-6 px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-1" /> Add
                  </>
                )}
              </button>
            </form>*/}
          </div>

          {/* Available highlights list */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            {filteredHighlights.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? "No highlights match your search" : "No highlights available"}
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredHighlights.map((highlight) => {
                      const isSelected = selectedHighlights.some((h) => h.id === highlight.id)
                      return (
                        <tr
                          key={highlight.id}
                          className={`
                            ${isSelected ? "bg-green-50 dark:bg-green-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-600"} 
                            ${hoveredHighlight === highlight.id ? "bg-gray-100 dark:bg-gray-600" : ""}
                            cursor-pointer transition-colors
                          `}
                          onMouseEnter={() => setHoveredHighlight(highlight.id)}
                          onMouseLeave={() => setHoveredHighlight(null)}
                          onClick={() => !isSelected && trekId && addHighlightById(highlight.id)}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {highlight.id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">{highlight.content}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                            {isSelected ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Added
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addHighlightById(highlight.id)
                                }}
                                disabled={isSubmitting || !trekId}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-[#ff5c5c] hover:bg-[#ff4040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5c5c] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Selected Highlights */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Selected Highlights</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {selectedHighlights.length} selected
            </span>
          </div>

          {selectedHighlights.length === 0 ? (
            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg text-center border border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-600 dark:text-gray-400 mb-2">No highlights selected yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Click on a highlight from the left panel to add it to your trek
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-24rem)] overflow-y-auto pr-1">
              {selectedHighlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center mb-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mr-2">
                        ID: {highlight.id}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 text-sm">{highlight.content}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHighlightFromTrek(highlight.id)}
                    disabled={isSubmitting}
                    className="p-2 text-gray-500 hover:text-white hover:bg-red-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Remove highlight"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

