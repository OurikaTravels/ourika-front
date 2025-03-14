"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Loader, Check, Info, MapPin, Clock, DollarSign } from "lucide-react"
import DashboardHeader from "../../../../components/dashboard/DashboardHeader"
import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar"
import { Link } from "react-router-dom"
import trekApi from "../../../../services/trekApi"
import categoryApi from "../../../../services/categoryApi"
import { toast } from "react-hot-toast"

export default function AddTrek() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("treks")
  const [notifications] = useState(3)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [error, setError] = useState(null)

  // Form state for Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    description: "",
    duration: "",
    startLocation: "",
    endLocation: "",
    fullDescription: "",
    price: "",
    categoryId: "",
  })

  // Form validation errors
  const [errors, setErrors] = useState({})

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const response = await categoryApi.getAllCategories()
      if (response.success) {
        setCategories(response.data)
      } else {
        setError(response.message || "Failed to fetch categories")
        toast.error(response.message || "Failed to fetch categories")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching categories"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target

    // Handle price as a number
    if (name === "price") {
      const numValue = value === "" ? "" : Number.parseFloat(value)
      setBasicInfo({
        ...basicInfo,
        [name]: numValue,
      })
    } else {
      setBasicInfo({
        ...basicInfo,
        [name]: value,
      })
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateBasicInfo = () => {
    const newErrors = {}

    if (!basicInfo.title.trim()) newErrors.title = "Title is required"
    if (!basicInfo.description.trim()) newErrors.description = "Description is required"
    if (!basicInfo.duration.trim()) newErrors.duration = "Duration is required"
    if (!basicInfo.startLocation.trim()) newErrors.startLocation = "Start location is required"
    if (!basicInfo.endLocation.trim()) newErrors.endLocation = "End location is required"
    if (!basicInfo.fullDescription.trim()) newErrors.fullDescription = "Full description is required"

    if (basicInfo.price === "" || isNaN(basicInfo.price)) {
      newErrors.price = "Price must be a valid number"
    } else if (Number.parseFloat(basicInfo.price) <= 0) {
      newErrors.price = "Price must be greater than zero"
    }

    if (!basicInfo.categoryId) newErrors.categoryId = "Category selection is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitBasicInfo = async (e) => {
    e.preventDefault()

    if (!validateBasicInfo()) {
      toast.error("Please fill in all required fields correctly")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await trekApi.createTrek(basicInfo)

      if (response.success) {
        toast.success("Trek basic information saved successfully!")
        // In a real multi-step form, you would store the trek ID and move to the next step
        // For now, we'll navigate back to a hypothetical trek list page
        setTimeout(() => {
          navigate("/admin/treks/all-treks")
        }, 1500)
      } else {
        setError(response.message || "Failed to create trek")
        toast.error(response.message || "Failed to create trek")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while creating the trek"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Steps configuration
  const steps = [
    { id: 1, name: "Basic Information", description: "Trek details and category" },
    { id: 2, name: "Media", description: "Images and videos" },
    { id: 3, name: "Services", description: "Included services" },
    { id: 4, name: "Highlights", description: "Key attractions" },
    { id: 5, name: "Review", description: "Final check" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar Component */}
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Header Component */}
        <DashboardHeader user={user} notifications={notifications} />

        {/* Main Content */}
        <main className="p-6">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link
                to="/admin/treks/all-treks"
                className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Trek</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Create a new trek experience for your customers</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol className="flex items-center">
                {steps.map((step, stepIdx) => (
                  <li
                    key={step.id}
                    className={`relative ${stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""} ${stepIdx !== 0 ? "pl-4 sm:pl-8" : ""} flex-1`}
                  >
                    {step.id < currentStep ? (
                      <div className="group">
                        <span className="flex items-center">
                          <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#ff5c5c] group-hover:bg-[#ff4040]">
                            <Check className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">{step.name}</span>
                        </span>
                        {stepIdx !== steps.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full sm:w-full bg-[#ff5c5c]"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    ) : step.id === currentStep ? (
                      <div className="group" aria-current="step">
                        <span className="flex items-center">
                          <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#ff5c5c] bg-white dark:bg-gray-800">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5c5c]" aria-hidden="true" />
                          </span>
                          <span className="ml-3 text-sm font-medium text-[#ff5c5c]">{step.name}</span>
                        </span>
                        {stepIdx !== steps.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full sm:w-full bg-gray-300 dark:bg-gray-600"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="group">
                        <span className="flex items-center">
                          <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                            <span className="h-2.5 w-2.5 rounded-full bg-transparent" aria-hidden="true" />
                          </span>
                          <span className="ml-3 text-sm font-medium text-gray-500 dark:text-gray-400">{step.name}</span>
                        </span>
                        {stepIdx !== steps.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full sm:w-full bg-gray-300 dark:bg-gray-600"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Step 1: Basic Information Form */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Trek Information</h2>

              <form onSubmit={handleSubmitBasicInfo}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Title */}
                  <div className="col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Trek Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={basicInfo.title}
                      onChange={handleBasicInfoChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.title ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                      placeholder="Enter trek title"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
                  </div>

                  {/* Short Description */}
                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={basicInfo.description}
                      onChange={handleBasicInfoChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.description
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                      placeholder="Brief description of the trek"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label
                      htmlFor="duration"
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
                        id="duration"
                        name="duration"
                        value={basicInfo.duration}
                        onChange={handleBasicInfoChange}
                        className={`w-full pl-10 px-4 py-2 rounded-lg border ${
                          errors.duration
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                        placeholder="e.g., PT240H for 10 days"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Use ISO 8601 duration format (e.g., PT240H for 10 days)
                    </p>
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.duration}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={basicInfo.price}
                        onChange={handleBasicInfoChange}
                        min="0"
                        step="0.01"
                        className={`w-full pl-10 px-4 py-2 rounded-lg border ${
                          errors.price ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
                  </div>

                  {/* Start Location */}
                  <div>
                    <label
                      htmlFor="startLocation"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Start Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="startLocation"
                        name="startLocation"
                        value={basicInfo.startLocation}
                        onChange={handleBasicInfoChange}
                        className={`w-full pl-10 px-4 py-2 rounded-lg border ${
                          errors.startLocation
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                        placeholder="Starting point of the trek"
                      />
                    </div>
                    {errors.startLocation && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startLocation}</p>
                    )}
                  </div>

                  {/* End Location */}
                  <div>
                    <label
                      htmlFor="endLocation"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      End Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="endLocation"
                        name="endLocation"
                        value={basicInfo.endLocation}
                        onChange={handleBasicInfoChange}
                        className={`w-full pl-10 px-4 py-2 rounded-lg border ${
                          errors.endLocation
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                        placeholder="Ending point of the trek"
                      />
                    </div>
                    {errors.endLocation && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endLocation}</p>
                    )}
                  </div>

                  {/* Category Selection */}
                  <div className="col-span-2">
                    <label
                      htmlFor="categoryId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={basicInfo.categoryId}
                      onChange={handleBasicInfoChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.categoryId
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                    >
                      <option value="">Select a category</option>
                      {isLoadingCategories ? (
                        <option disabled>Loading categories...</option>
                      ) : (
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoryId}</p>
                    )}
                  </div>

                  {/* Full Description */}
                  <div className="col-span-2">
                    <label
                      htmlFor="fullDescription"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Full Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="fullDescription"
                      name="fullDescription"
                      value={basicInfo.fullDescription}
                      onChange={handleBasicInfoChange}
                      rows="6"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.fullDescription
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                      placeholder="Detailed description of the trek experience"
                    ></textarea>
                    {errors.fullDescription && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullDescription}</p>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/admin/treks/all-treks"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save & Continue
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Placeholder for future steps */}
          {currentStep > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Step {currentStep}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                This step would be implemented in a full multi-step form. For now, we're focusing on the basic
                information step.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

