"use client"

import { useState, useEffect } from "react"
import { Plus, Trash, Clock, Car, Edit, X, Save, Loader } from "lucide-react"
import { toast } from "react-hot-toast"
import activityApi from "../../services/activityApi"

export function ActivityForm({ trekId, onActivityAdded, onActivityUpdated }) {
  const [activityType, setActivityType] = useState("ACTIVITY") // Default to general activity
  const [activities, setActivities] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [editActivityId, setEditActivityId] = useState(null)

  const [newActivity, setNewActivity] = useState({
    title: "",
    type: "ACTIVITY",
    description: "",
    isOptional: false,
    activityOrder: 1,
    
    transportType: "",
    transportDuration: "",
  })

  useEffect(() => {
    if (trekId) {
      fetchActivities()
    }
  }, [trekId])

  const fetchActivities = async () => {
    if (!trekId) return

    setIsLoading(true)
    try {
      const response = await activityApi.getTrekActivities(trekId)
      if (response.success) {
        setActivities(response.data)
      } else {
        toast.error(response.message || "Failed to fetch activities")
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
      toast.error("An error occurred while fetching activities")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const inputValue = type === "checkbox" ? checked : value

    setNewActivity((prev) => ({
      ...prev,
      [name]: inputValue,
    }))

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleTypeChange = (e) => {
    const type = e.target.value
    setActivityType(type)
    setNewActivity((prev) => ({
      ...prev,
      type: type,
    }))
  }

  const validateActivity = () => {
    const newErrors = {}

    if (!newActivity.title.trim()) newErrors.title = "Title is required"
    if (!newActivity.description.trim()) newErrors.description = "Description is required"

    if (newActivity.type === "TRANSPORTATION") {
      if (!newActivity.transportType.trim()) newErrors.transportType = "Transport type is required"
      if (!newActivity.transportDuration.trim()) newErrors.transportDuration = "Duration is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddActivity = async (e) => {
    e.preventDefault()

    if (!validateActivity()) {
      return
    }

    setIsSubmitting(true)

    try {
      const activityData = {
        title: newActivity.title,
        type: newActivity.type,
        description: newActivity.description,
        isOptional: newActivity.isOptional,
        activityOrder: activities.length + 1,
      }

      if (newActivity.type === "TRANSPORTATION") {
        activityData.transportType = newActivity.transportType
        activityData.transportDuration = newActivity.transportDuration
      }

      const response = await activityApi.addActivityToTrek(trekId, activityData)

      if (!response.success) {
        throw new Error(response.message || "Failed to add activity")
      }

      setActivities([...activities, response.data])

      setNewActivity({
        title: "",
        type: activityType, 
        description: "",
        isOptional: false,
        activityOrder: activities.length + 2,
        transportType: "",
        transportDuration: "",
      })

      if (onActivityAdded) {
        onActivityAdded(response.data)
      }

      toast.success("Activity added successfully")
    } catch (error) {
      console.error("Error adding activity:", error)
      setErrors({ submit: error.message || "Failed to add activity" })
      toast.error(error.message || "Failed to add activity")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditActivity = (activity) => {
    setEditMode(true)
    setEditActivityId(activity.id)
    setActivityType(activity.type)

    setNewActivity({
      title: activity.title,
      type: activity.type,
      description: activity.description,
      isOptional: activity.isOptional,
      activityOrder: activity.activityOrder,
      transportType: activity.transportType || "",
      transportDuration: activity.transportDuration || "",
    })
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setEditActivityId(null)

    setNewActivity({
      title: "",
      type: activityType,
      description: "",
      isOptional: false,
      activityOrder: activities.length + 1,
      transportType: "",
      transportDuration: "",
    })
  }

  const handleUpdateActivity = async (e) => {
    e.preventDefault()

    if (!validateActivity()) {
      return
    }

    setIsSubmitting(true)

    try {
      const activityData = {
        title: newActivity.title,
        type: newActivity.type,
        description: newActivity.description,
        isOptional: newActivity.isOptional,
        activityOrder: newActivity.activityOrder,
      }

      if (newActivity.type === "TRANSPORTATION") {
        activityData.transportType = newActivity.transportType
        activityData.transportDuration = newActivity.transportDuration
      }

      const response = await activityApi.updateActivity(editActivityId, activityData)

      if (!response.success) {
        throw new Error(response.message || "Failed to update activity")
      }

      setActivities(activities.map((activity) => (activity.id === editActivityId ? response.data : activity)))

      handleCancelEdit()

      if (onActivityUpdated) {
        onActivityUpdated(response.data)
      }

      toast.success("Activity updated successfully")
    } catch (error) {
      console.error("Error updating activity:", error)
      setErrors({ submit: error.message || "Failed to update activity" })
      toast.error(error.message || "Failed to update activity")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveActivity = async (activityId, index) => {
    try {
      const response = await activityApi.removeActivityFromTrek(trekId, activityId)

      if (!response.success) {
        throw new Error(response.message || "Failed to remove activity")
      }

      const updatedActivities = [...activities]
      updatedActivities.splice(index, 1)

      const reorderedActivities = updatedActivities.map((activity, idx) => ({
        ...activity,
        activityOrder: idx + 1,
      }))

      setActivities(reorderedActivities)
      toast.success("Activity removed successfully")

      for (let i = 0; i < reorderedActivities.length; i++) {
        const activity = reorderedActivities[i]
        if (activity.activityOrder !== i + 1) {
          await activityApi.updateActivityOrder(trekId, activity.id, i + 1)
        }
      }
    } catch (error) {
      console.error("Error removing activity:", error)
      toast.error(error.message || "Failed to remove activity")
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activity Type</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="activityType"
              value="ACTIVITY"
              checked={activityType === "ACTIVITY"}
              onChange={handleTypeChange}
              className="form-radio h-4 w-4 text-[#ff5c5c] focus:ring-[#ff5c5c]"
              disabled={editMode}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">General Activity</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="activityType"
              value="TRANSPORTATION"
              checked={activityType === "TRANSPORTATION"}
              onChange={handleTypeChange}
              className="form-radio h-4 w-4 text-[#ff5c5c] focus:ring-[#ff5c5c]"
              disabled={editMode}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Transportation</span>
          </label>
        </div>
      </div>

      <form
        onSubmit={editMode ? handleUpdateActivity : handleAddActivity}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {editMode
            ? `Edit ${activityType === "TRANSPORTATION" ? "Transportation" : "Activity"}`
            : `Add ${activityType === "TRANSPORTATION" ? "Transportation" : "Activity"}`}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newActivity.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.title ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
              placeholder={
                activityType === "TRANSPORTATION" ? "e.g., Transfer to Trailhead" : "e.g., Hiking to Cascade"
              }
            />
            {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
          </div>

          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={newActivity.description}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.description ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
              placeholder="Describe the activity"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
          </div>

          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isOptional"
                checked={newActivity.isOptional}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-[#ff5c5c] rounded focus:ring-[#ff5c5c]"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">This activity is optional</span>
            </label>
          </div>

          {activityType === "TRANSPORTATION" && (
            <>
              <div>
                <label
                  htmlFor="transportType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Transport Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Car className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="transportType"
                    name="transportType"
                    value={newActivity.transportType}
                    onChange={handleInputChange}
                    className={`w-full pl-10 px-4 py-2 rounded-lg border ${
                      errors.transportType
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                  >
                    <option value="">Select transport type</option>
                    <option value="VAN">Van</option>
                    <option value="BUS">Bus</option>
                    <option value="CAR">Car</option>
                    <option value="TRAIN">Train</option>
                    <option value="BOAT">Boat</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                {errors.transportType && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.transportType}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="transportDuration"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Duration <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="transportDuration"
                    name="transportDuration"
                    value={newActivity.transportDuration}
                    onChange={handleInputChange}
                    className={`w-full pl-10 px-4 py-2 rounded-lg border ${
                      errors.transportDuration
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                    placeholder="e.g., PT1H30M for 1h 30m"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Use ISO 8601 duration format (e.g., PT1H30M for 1 hour 30 minutes)
                </p>
                {errors.transportDuration && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.transportDuration}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          {editMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                {editMode ? "Updating..." : "Adding..."}
              </span>
            ) : (
              <>
                {editMode ? (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Update {activityType === "TRANSPORTATION" ? "Transportation" : "Activity"}
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Add {activityType === "TRANSPORTATION" ? "Transportation" : "Activity"}
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader className="animate-spin h-8 w-8 text-[#ff5c5c]" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading activities...</span>
        </div>
      ) : activities.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activities</h3>

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#ff5c5c] text-white text-sm font-medium mr-2">
                      {activity.activityOrder}
                    </span>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                      {activity.type === "TRANSPORTATION" ? "Transportation" : "Activity"}
                    </span>
                    {activity.isOptional && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                  {activity.type === "TRANSPORTATION" && (
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Car className="h-4 w-4 mr-1" />
                      <span>{activity.transportType}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{activity.transportDuration}</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditActivity(activity)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    disabled={editMode}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleRemoveActivity(activity.id, index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    disabled={editMode}
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

